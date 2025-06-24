# Rich Text Editor Dependencies

To use the Rich Text Editor component, you need to install the following dependencies:

```bash
pnpm add @tiptap/core @tiptap/starter-kit @tiptap/extension-placeholder @tiptap/extension-link @tiptap/extension-image @tiptap/extension-text-align @tiptap/extension-underline @tiptap/extension-text-style @tiptap/extension-color
```

After installing the dependencies, you can use the RichTextEditor component in your forms.

## Usage

The RichTextEditor component has been integrated into the following forms:

1. TaskForm - for the "info" field
2. Garden Edit Form - for the "description" field
3. ReportForm - for the "content" field

The component provides a rich text editing experience with the following features:

- Text formatting (bold, italic, underline, strike)
- Headings (H1, H2, H3)
- Lists (bullet and ordered)
- Text alignment (left, center, right)
- Links
- Images
- Text color

## Example

```tsx
import { RichTextEditor } from "~/components/RichTextEditor";

// In your component
const contentSignal = useSignal("");

// In your JSX
<RichTextEditor
  content={contentSignal}
  placeholder="Enter content..."
  height="h-64"
/>
```

## Customization

You can customize the height of the editor by changing the `height` prop. The default is "h-64".

You can also customize the placeholder text by changing the `placeholder` prop. The default is "Enter content...".
