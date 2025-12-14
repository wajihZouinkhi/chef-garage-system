# Implementation Plan

- [ ] 1. Create image utility functions
  - Create utility functions for image validation (file type, size)
  - Create utility functions for Base64 encoding/decoding
  - Create utility function for file reading
  - _Requirements: 1.2, 1.6, 5.1, 5.3_

- [ ] 1.1 Write property test for image format validation
  - **Property 1: Valid image format validation**
  - **Validates: Requirements 1.2**

- [ ] 1.2 Write property test for Base64 round-trip
  - **Property 13: Base64 encoding round-trip**
  - **Validates: Requirements 5.1, 5.3, 5.4**

- [ ] 2. Create ImageUpload component
  - Create reusable ImageUpload component with file input
  - Implement multiple file selection
  - Implement image preview grid with thumbnails
  - Add remove button for each preview
  - Integrate validation functions
  - Display error messages for validation failures
  - _Requirements: 1.1, 1.2, 1.3, 1.6, 2.1, 2.2, 2.3, 2.4_

- [ ] 2.1 Write property test for image preview display
  - **Property 2: Image preview display**
  - **Validates: Requirements 1.3, 2.2**

- [ ] 2.2 Write property test for image count limit
  - **Property 4: Image count limit enforcement**
  - **Validates: Requirements 2.1**

- [ ] 2.3 Write property test for image removal
  - **Property 5: Image removal updates state**
  - **Validates: Requirements 2.4**

- [ ] 3. Integrate ImageUpload into maintenance form
  - Add ImageUpload component to the maintenance form
  - Update form state to include images array
  - Handle image data in form submission
  - Map images to photos field for backend compatibility
  - Ensure form works with and without images (optional)
  - _Requirements: 1.1, 1.4, 1.5_

- [ ] 3.1 Write property test for optional images
  - **Property 3: Optional images in creation**
  - **Validates: Requirements 1.4**

- [ ] 3.2 Write property test for image storage persistence
  - **Property 14: Image storage persistence**
  - **Validates: Requirements 1.5, 5.2**

- [ ] 4. Create ImageGallery component for timeline
  - Create ImageGallery component to display image thumbnails
  - Implement grid layout for thumbnails
  - Add click handlers for opening lightbox
  - Handle empty images array (don't render section)
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 4.1 Write property test for conditional timeline display
  - **Property 6: Timeline displays images conditionally**
  - **Validates: Requirements 3.1, 3.2**

- [ ] 5. Create ImageLightbox component
  - Create modal/lightbox component for full-size image viewing
  - Implement previous/next navigation controls
  - Add close button and click-outside-to-close
  - Implement keyboard navigation (arrow keys, ESC)
  - Handle single and multiple images
  - _Requirements: 3.4, 3.5_

- [ ] 5.1 Write property test for lightbox opening
  - **Property 7: Thumbnail click opens lightbox**
  - **Validates: Requirements 3.4**

- [ ] 5.2 Write property test for lightbox navigation
  - **Property 8: Lightbox navigation controls**
  - **Validates: Requirements 3.5**

- [ ] 6. Integrate ImageGallery and ImageLightbox into timeline
  - Add ImageGallery to maintenance log cards in timeline
  - Connect ImageGallery click events to ImageLightbox
  - Manage lightbox state (open/close, current image index)
  - Style components to match existing design
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 7. Implement edit functionality for images
  - Display existing images when editing maintenance log
  - Allow adding new images to existing set
  - Allow removing existing images
  - Update form submission to handle image changes
  - Ensure edited images persist correctly
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 7.1 Write property test for edit displays existing images
  - **Property 9: Edit displays existing images**
  - **Validates: Requirements 4.1**

- [ ] 7.2 Write property test for edit allows adding images
  - **Property 10: Edit allows adding images**
  - **Validates: Requirements 4.2**

- [ ] 7.3 Write property test for edit allows removing images
  - **Property 11: Edit allows removing images**
  - **Validates: Requirements 4.3**

- [ ] 7.4 Write property test for edit persists changes
  - **Property 12: Edit persists image changes**
  - **Validates: Requirements 4.4**

- [ ] 8. Add styling and polish
  - Style ImageUpload component with consistent design
  - Style ImageGallery thumbnails
  - Style ImageLightbox modal
  - Add loading states for image uploads
  - Add transitions and animations
  - Ensure responsive design for mobile
  - _Requirements: All_

- [ ] 9. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
