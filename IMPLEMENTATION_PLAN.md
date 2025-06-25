# Image Carousel Implementation Plan

This document outlines the steps needed to implement the ImageCarousel component in the application.

## 1. ImageCarousel Component

The ImageCarousel component has been created at `/home/germanov/WebstormProje/KanbaNiwa/github/app/view/src/components/ImageCarousel/index.tsx`. This component provides the following features:

- Carousel display for images with navigation arrows
- Thumbnail navigation for quick access to specific images
- Modal for viewing images in full size when clicked
- Optional delete functionality with a delete button
- Responsive design that works on both mobile and desktop

## 2. Implementation in Garden Details Page

To implement the ImageCarousel in the garden details page, make the following changes to `/home/germanov/WebstormProje/KanbaNiwa/github/app/view/src/routes/(protected)/gardens/details/[id]/index.tsx`:

1. Import the ImageCarousel component at the top of the file:
```tsx
import { ImageCarousel } from "~/components/ImageCarousel";
```

2. Replace the current image gallery implementation (around line 166-197) with the ImageCarousel component:

```tsx
{/* Garden Images */}
<div class="lg:col-span-1">
  <div class="card bg-base-100 shadow-xl">
    <div class="p-4">
      <h3 class="font-bold text-lg mb-2">Снимки</h3>
      {gardenSignal.value.photos && gardenSignal.value.photos.length > 0 ? (
        <ImageCarousel
          images={gardenSignal.value.photos.map(
            (photo: string) => `${pb.baseURL}/api/files/${gardenSignal.value.collectionId}/${gardenSignal.value.id}/${photo}`
          )}
        />
      ) : (
        <div class="h-48 w-full bg-gray-200 flex items-center justify-center">
          <span class="text-gray-400">Няма снимки</span>
        </div>
      )}
    </div>
  </div>
</div>
```

## 3. Implementation in Task Form Component

To implement the ImageCarousel in the task form, make the following changes to `/home/germanov/WebstormProje/KanbaNiwa/github/app/view/src/components/TaskForm/TaskForm.tsx`:

1. Import the ImageCarousel component at the top of the file:
```tsx
import { ImageCarousel } from "~/components/ImageCarousel";
```

2. Replace the current image preview section (around line 122-161) with the ImageCarousel component:

```tsx
{/* Image Preview Section */}
{images && images.length > 0 && (
  <div class="form-control">
    <label class="label">
      <span class="label-text">Преглед</span>
    </label>
    <ImageCarousel
      images={images}
      onDelete={onImageDelete}
      showDeleteButton={deletable.value}
    />
  </div>
)}
```

## 4. Implementation in Garden Edit Page

To implement the ImageCarousel in the garden edit page, make the following changes to `/home/germanov/WebstormProje/KanbaNiwa/github/app/view/src/routes/(protected)/gardens/edit/[id]/index.tsx`:

1. Import the ImageCarousel component at the top of the file:
```tsx
import { ImageCarousel } from "~/components/ImageCarousel";
```

2. Replace the current image preview section (around line 222-259) with the ImageCarousel component:

```tsx
{/* Image previews */}
{imagesPreviewSignal.value && imagesPreviewSignal.value.length > 0 && (
  <div class="form-control">
    <label class="label">
      <span class="label-text">Преглед</span>
    </label>
    <ImageCarousel
      images={imagesPreviewSignal.value}
      onDelete={(index) => handleImageDelete(index, imagesSignal, imagesPreviewSignal)}
      showDeleteButton={true}
    />
  </div>
)}
```

## 5. Implementation in Task Edit Page

The task edit page uses the TaskForm component, so the changes to the TaskForm component will automatically apply to the task edit page.

## 6. Implementation in Task Details Modal

If there's a task details modal that displays images, you may want to implement the ImageCarousel there as well. Look for any components that display task images and replace the image display with the ImageCarousel component.

## 7. Testing

After implementing these changes, test the application to ensure that:

1. Images are displayed correctly in the carousel
2. Navigation between images works as expected
3. Thumbnails allow quick access to specific images
4. Clicking on an image opens it in a larger view
5. Delete functionality works correctly where applicable
6. The carousel is responsive and works well on both mobile and desktop

## 8. Additional Considerations

- The ImageCarousel component is designed to be flexible and can be customized further if needed.
- The height of the carousel can be adjusted by modifying the `h-64` class in the component.
- The thumbnail size can be adjusted by modifying the `w-16 h-16` classes in the component.
- The modal can be customized further if needed.
