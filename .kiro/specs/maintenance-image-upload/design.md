# Design Document: Maintenance Image Upload

## Overview

This feature adds optional image upload and display functionality to the maintenance logging system. Users can attach photos when creating or editing maintenance logs, and view them in the maintenance history timeline. The implementation uses Base64 encoding for image storage in MongoDB and provides a clean UI with image previews, thumbnails, and a lightbox for full-size viewing.

## Architecture

The solution follows the existing application architecture:

**Frontend (Next.js + React + TypeScript)**
- Image upload component with file selection and preview
- Image display component for timeline view
- Image lightbox/modal for full-size viewing
- Client-side image validation and Base64 encoding

**Backend (NestJS + MongoDB)**
- Schema already supports images array field
- No backend changes required (images stored as Base64 strings)

**Data Flow:**
1. User selects image files → Frontend validates format and size
2. Frontend converts images to Base64 → Stores in form state
3. User submits form → Base64 strings sent to backend in images array
4. Backend stores maintenance log with images → MongoDB persistence
5. Frontend retrieves logs → Decodes Base64 for display

## Components and Interfaces

### Frontend Components

#### 1. ImageUpload Component
A reusable component for selecting and previewing images.

```typescript
interface ImageUploadProps {
  images: string[]; // Array of Base64 strings
  onChange: (images: string[]) => void;
  maxImages?: number; // Default: 10
  maxSizeMB?: number; // Default: 5
}
```

**Features:**
- File input with accept="image/*"
- Multiple file selection
- Image preview grid with thumbnails
- Remove button for each image
- Validation for file type and size
- Error messages for invalid uploads

#### 2. ImageGallery Component
Displays images in the maintenance timeline.

```typescript
interface ImageGalleryProps {
  images: string[]; // Array of Base64 strings
  onImageClick: (index: number) => void;
}
```

**Features:**
- Grid layout of thumbnail images
- Click handler to open lightbox
- Responsive design

#### 3. ImageLightbox Component
Modal for viewing full-size images.

```typescript
interface ImageLightboxProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}
```

**Features:**
- Full-size image display
- Previous/Next navigation
- Close button
- Keyboard navigation (arrow keys, ESC)
- Click outside to close

### Backend Schema

The existing `MaintenanceLog` schema already has an `images` field, but it's named `photos`. We'll use the existing field:

```typescript
@Prop({ type: [String], default: [] })
photos: string[]; // Array of Base64 encoded images
```

Note: The frontend currently uses `images` but the schema uses `photos`. We'll align on using `images` in the frontend and map it to `photos` in the backend.

## Data Models

### Image Data Structure

Images are stored as Base64-encoded strings with data URI format:

```
data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...
```

This format includes:
- MIME type (image/jpeg, image/png, etc.)
- Encoding type (base64)
- Encoded image data

### Form Data Structure

```typescript
interface MaintenanceFormData {
  title: string;
  description: string;
  cost: number;
  staffId: string;
  staffName: string;
  notes: string;
  startDate: string;
  endDate: string;
  images: string[]; // Array of Base64 data URIs
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


Property 1: Valid image format validation
*For any* file with a MIME type, the validation function should accept files with MIME types image/jpeg, image/png, image/gif, or image/webp, and reject all other MIME types
**Validates: Requirements 1.2**

Property 2: Image preview display
*For any* set of selected image files (up to the maximum limit), the system should display exactly one preview thumbnail for each selected file
**Validates: Requirements 1.3, 2.2**

Property 3: Optional images in creation
*For any* valid maintenance log data without images, the system should successfully create the maintenance log with an empty images array
**Validates: Requirements 1.4**

Property 4: Image count limit enforcement
*For any* attempt to upload images, the system should accept up to 10 images and prevent uploading more than 10 images
**Validates: Requirements 2.1**

Property 5: Image removal updates state
*For any* set of preview images, removing one image should result in a preview list with exactly one fewer image and not containing the removed image
**Validates: Requirements 2.4**

Property 6: Timeline displays images conditionally
*For any* maintenance log with images, the timeline view should display those images, and for any maintenance log without images, the timeline view should not display an images section
**Validates: Requirements 3.1, 3.2**

Property 7: Thumbnail click opens lightbox
*For any* thumbnail image in the timeline, clicking it should open a lightbox modal displaying the full-size version of that image
**Validates: Requirements 3.4**

Property 8: Lightbox navigation controls
*For any* maintenance log with multiple images, the lightbox should provide previous and next navigation controls when viewing any image
**Validates: Requirements 3.5**

Property 9: Edit displays existing images
*For any* maintenance log with images, opening the edit form should display all currently attached images as previews
**Validates: Requirements 4.1**

Property 10: Edit allows adding images
*For any* maintenance log being edited, adding N new images should result in the total image count increasing by N (up to the maximum limit)
**Validates: Requirements 4.2**

Property 11: Edit allows removing images
*For any* maintenance log being edited, removing N images should result in the total image count decreasing by N
**Validates: Requirements 4.3**

Property 12: Edit persists image changes
*For any* maintenance log, if images are added or removed during editing and the form is saved, retrieving the log should reflect the updated image set
**Validates: Requirements 4.4**

Property 13: Base64 encoding round-trip
*For any* valid image file, encoding it to Base64 and then decoding it should produce a displayable image with the same visual content and format information
**Validates: Requirements 5.1, 5.3, 5.4**

Property 14: Image storage persistence
*For any* maintenance log created with images, retrieving that log from the database should return the same images that were submitted
**Validates: Requirements 1.5, 5.2**

## Error Handling

### Client-Side Validation Errors

1. **Invalid File Type**
   - Error: "Invalid file type. Please upload JPEG, PNG, GIF, or WebP images."
   - Action: Reject file, display error message, do not add to preview

2. **File Size Exceeded**
   - Error: "Image size exceeds 5MB limit. Please choose a smaller file."
   - Action: Reject file, display error message, do not add to preview

3. **Maximum Images Exceeded**
   - Error: "Maximum 10 images allowed per maintenance log."
   - Action: Prevent additional file selection, display error message

4. **File Read Error**
   - Error: "Failed to read image file. Please try again."
   - Action: Display error message, allow retry

### Backend Error Handling

The backend doesn't require changes, but existing error handling covers:

1. **Invalid Request Data**
   - HTTP 400: Bad Request
   - Validation errors for required fields

2. **Database Errors**
   - HTTP 500: Internal Server Error
   - Log error, return generic message to client

3. **Authentication Errors**
   - HTTP 401: Unauthorized
   - Redirect to login

## Testing Strategy

### Unit Testing

We'll write unit tests for:

1. **Image Validation Functions**
   - Test valid MIME types (JPEG, PNG, GIF, WebP)
   - Test invalid MIME types
   - Test file size validation (under/over 5MB)
   - Test maximum image count validation

2. **Base64 Encoding/Decoding**
   - Test encoding various image formats
   - Test decoding Base64 strings
   - Test format preservation

3. **Component Rendering**
   - Test ImageUpload component renders file input
   - Test ImageGallery renders correct number of thumbnails
   - Test ImageLightbox opens/closes correctly

4. **State Management**
   - Test adding images updates state
   - Test removing images updates state
   - Test form submission includes images

### Property-Based Testing

We'll use **fast-check** (JavaScript/TypeScript property-based testing library) to verify universal properties. Each property-based test will run a minimum of 100 iterations.

Property-based tests will cover:

1. **Image Format Validation** (Property 1)
   - Generate random MIME types
   - Verify valid formats accepted, invalid rejected

2. **Image Preview Display** (Property 2)
   - Generate random arrays of image files (0-10 images)
   - Verify preview count matches file count

3. **Optional Images** (Property 3)
   - Generate random maintenance log data without images
   - Verify successful creation

4. **Image Count Limit** (Property 4)
   - Generate random image arrays of various sizes
   - Verify limit enforcement

5. **Image Removal** (Property 5)
   - Generate random image arrays
   - Remove random images
   - Verify correct state updates

6. **Base64 Round-Trip** (Property 13)
   - Generate random image data
   - Verify encoding/decoding preserves content

7. **Storage Persistence** (Property 14)
   - Generate random maintenance logs with images
   - Verify retrieval returns same images

### Integration Testing

Integration tests will verify:

1. **End-to-End Image Upload Flow**
   - Create maintenance log with images
   - Verify images stored in database
   - Retrieve and display images

2. **Edit Flow with Images**
   - Edit existing log
   - Add/remove images
   - Verify changes persisted

3. **Timeline Display**
   - Create logs with and without images
   - Verify correct display in timeline
   - Test lightbox functionality

## Implementation Notes

### Image Size Optimization

While the initial implementation stores full Base64-encoded images, future optimizations could include:

1. **Client-side image compression** before encoding
2. **Thumbnail generation** for timeline display
3. **Lazy loading** for images in long timelines
4. **External storage** (S3, Cloudinary) for larger deployments

### Browser Compatibility

The implementation uses standard Web APIs:
- FileReader API for reading files
- Canvas API (if compression added)
- Base64 encoding/decoding (built-in)

These are supported in all modern browsers (Chrome, Firefox, Safari, Edge).

### Accessibility

Image components will include:
- Alt text for images (using maintenance log title)
- Keyboard navigation for lightbox
- ARIA labels for buttons
- Focus management in modal

### Performance Considerations

1. **Base64 Encoding Size**: Base64 increases file size by ~33%. A 3MB image becomes ~4MB.
2. **Database Document Size**: MongoDB documents have a 16MB limit. With 10 images at 5MB each (6.65MB Base64), we're within limits.
3. **Network Transfer**: Large images increase API response times. Consider pagination for logs with many images.
4. **Memory Usage**: Loading many images simultaneously can impact browser performance. Implement lazy loading if needed.

## Migration Strategy

The schema already supports the `photos` field (array of strings). No database migration is required. The frontend will:

1. Map `images` to `photos` when sending to backend
2. Map `photos` to `images` when receiving from backend
3. Handle both empty arrays and undefined gracefully

Existing maintenance logs without images will display normally with no images section.
