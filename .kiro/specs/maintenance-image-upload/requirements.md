# Requirements Document

## Introduction

This feature enhances the maintenance logging system to support image uploads and display. Currently, the maintenance schema has an `images` field, but there is no UI implementation for uploading, storing, or displaying images. This feature will allow users to attach photos to maintenance records (e.g., before/after photos, damage documentation, repair evidence) and view them in the maintenance history.

## Glossary

- **Maintenance Log**: A record documenting vehicle maintenance work, including what was fixed, how it was fixed, cost, staff member, and dates
- **Image Upload Component**: A UI component that allows users to select and upload image files
- **Image Display Component**: A UI component that displays uploaded images in the maintenance history
- **Base64 Encoding**: A method of encoding binary image data as text strings for storage and transmission
- **Image Preview**: A visual representation of an uploaded image before submission

## Requirements

### Requirement 1

**User Story:** As a mechanic, I want to optionally upload photos when creating a maintenance log, so that I can document the repair work visually when needed.

#### Acceptance Criteria

1. WHEN a user creates a new maintenance log THEN the system SHALL display an optional image upload interface
2. WHEN a user selects image files THEN the system SHALL validate that the files are valid image formats (JPEG, PNG, GIF, WebP)
3. WHEN a user selects image files THEN the system SHALL display preview thumbnails of the selected images
4. WHEN a user submits the maintenance form without images THEN the system SHALL create the maintenance log without requiring images
5. WHEN a user submits the maintenance form with images THEN the system SHALL include the uploaded images in the maintenance log data
6. WHEN image files exceed 5MB each THEN the system SHALL reject the upload and display an error message

### Requirement 2

**User Story:** As a mechanic, I want to upload multiple photos for a single maintenance log, so that I can document different aspects of the repair.

#### Acceptance Criteria

1. WHEN a user uploads images THEN the system SHALL allow uploading multiple image files (up to 10 images per maintenance log)
2. WHEN a user uploads multiple images THEN the system SHALL display all selected images as preview thumbnails
3. WHEN a user wants to remove an uploaded image THEN the system SHALL provide a delete button for each preview thumbnail
4. WHEN a user removes an image from the preview THEN the system SHALL update the preview list without that image

### Requirement 3

**User Story:** As a garage administrator, I want to view uploaded photos in the maintenance history timeline, so that I can review the documented repair work.

#### Acceptance Criteria

1. WHEN a maintenance log contains images THEN the system SHALL display the images in the maintenance history timeline view
2. WHEN a maintenance log has no images THEN the system SHALL not display an images section in the timeline
3. WHEN displaying images in the timeline THEN the system SHALL show thumbnail versions for efficient loading
4. WHEN a user clicks on a thumbnail in the timeline THEN the system SHALL display the full-size image in a modal or lightbox
5. WHEN viewing a full-size image THEN the system SHALL provide navigation controls to view other images in the same maintenance log

### Requirement 4

**User Story:** As a mechanic, I want to edit maintenance logs and update their images, so that I can correct or add documentation after initial submission.

#### Acceptance Criteria

1. WHEN a user edits an existing maintenance log THEN the system SHALL display the currently attached images
2. WHEN editing a maintenance log THEN the system SHALL allow adding new images to the existing set
3. WHEN editing a maintenance log THEN the system SHALL allow removing existing images
4. WHEN a user saves the edited maintenance log THEN the system SHALL persist the updated image set

### Requirement 5

**User Story:** As a system administrator, I want images to be stored efficiently, so that the application performs well and storage costs are manageable.

#### Acceptance Criteria

1. WHEN images are uploaded THEN the system SHALL encode them as Base64 strings for storage
2. WHEN images are stored THEN the system SHALL store them in the MongoDB database as part of the maintenance log document
3. WHEN images are retrieved THEN the system SHALL decode Base64 strings back to displayable images
4. WHEN the system stores images THEN the system SHALL maintain the original image format information
