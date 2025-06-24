import { component$, useSignal, useVisibleTask$, Signal, useTask$ } from "@builder.io/qwik";
import { noSerialize, NoSerialize } from "@builder.io/qwik";

// This interface defines the props for the RichTextEditor component
export interface RichTextEditorProps {
  content: Signal<string>; // The content of the editor
  placeholder?: string; // Optional placeholder text
  height?: string; // Optional height of the editor
}

// The RichTextEditor component
export const RichTextEditor = component$<RichTextEditorProps>(
  ({ content, placeholder = "Enter content...", height = "h-64" }) => {
    // Signal to store the editor instance
    const editorRef = useSignal<NoSerialize<any>>();
    // Signal to track if the editor is ready
    const editorReady = useSignal(false);
    // Signal to store the editor element
    const editorElement = useSignal<HTMLDivElement>();

    // Initialize the editor when the component mounts
    useVisibleTask$(async ({ track, cleanup }) => {
      track(() => editorElement.value);

      if (!editorElement.value) return;

      // Dynamically import TipTap dependencies
      const [
        { Editor },
        { default: StarterKit },
        { default: Placeholder },
        { default: Link },
        { default: Image },
        { default: TextAlign },
        { default: Underline },
        { default: TextStyle },
        { default: Color },
      ] = await Promise.all([
        import("@tiptap/core"),
        import("@tiptap/starter-kit"),
        import("@tiptap/extension-placeholder"),
        import("@tiptap/extension-link"),
        import("@tiptap/extension-image"),
        import("@tiptap/extension-text-align"),
        import("@tiptap/extension-underline"),
        import("@tiptap/extension-text-style"),
        import("@tiptap/extension-color"),
      ]);

      // Create a new editor instance
      const editor = new Editor({
        element: editorElement.value,
        extensions: [
          StarterKit,
          Placeholder.configure({
            placeholder,
          }),
          Link.configure({
            openOnClick: false,
          }),
          Image,
          TextAlign.configure({
            types: ["heading", "paragraph"],
          }),
          Underline,
          TextStyle,
          Color,
        ],
        content: content.value,
        onUpdate: ({ editor }) => {
          content.value = editor.getHTML();
        },
      });

      // Store the editor instance
      editorRef.value = noSerialize(editor);
      editorReady.value = true;

      // Clean up the editor when the component unmounts
      cleanup(() => {
        if (editorRef.value) {
          editorRef.value.destroy();
        }
      });
    });

    // Update the editor content when the content signal changes
    useTask$(({ track }) => {
      const newContent = track(() => content.value);
      const editor = editorRef.value;

      if (editor && editor.getHTML() !== newContent) {
        editor.commands.setContent(newContent);
      }
    });

    // Render the toolbar and editor
    return (
      <div class="rich-text-editor border rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div class="toolbar bg-base-200 p-2 flex flex-wrap gap-2 border-b">
          {editorReady.value && (
            <>
              <button
                type="button"
                class={`btn btn-sm ${editorRef.value?.isActive("bold") ? "btn-active" : ""}`}
                onClick$={() => editorRef.value?.chain().focus().toggleBold().run()}
                title="Bold"
              >
                <strong>B</strong>
              </button>
              <button
                type="button"
                class={`btn btn-sm ${editorRef.value?.isActive("italic") ? "btn-active" : ""}`}
                onClick$={() => editorRef.value?.chain().focus().toggleItalic().run()}
                title="Italic"
              >
                <em>I</em>
              </button>
              <button
                type="button"
                class={`btn btn-sm ${editorRef.value?.isActive("underline") ? "btn-active" : ""}`}
                onClick$={() => editorRef.value?.chain().focus().toggleUnderline().run()}
                title="Underline"
              >
                <u>U</u>
              </button>
              <button
                type="button"
                class={`btn btn-sm ${editorRef.value?.isActive("strike") ? "btn-active" : ""}`}
                onClick$={() => editorRef.value?.chain().focus().toggleStrike().run()}
                title="Strike"
              >
                <s>S</s>
              </button>
              <div class="divider divider-horizontal"></div>
              <button
                type="button"
                class={`btn btn-sm ${editorRef.value?.isActive("heading", { level: 1 }) ? "btn-active" : ""}`}
                onClick$={() => editorRef.value?.chain().focus().toggleHeading({ level: 1 }).run()}
                title="Heading 1"
              >
                H1
              </button>
              <button
                type="button"
                class={`btn btn-sm ${editorRef.value?.isActive("heading", { level: 2 }) ? "btn-active" : ""}`}
                onClick$={() => editorRef.value?.chain().focus().toggleHeading({ level: 2 }).run()}
                title="Heading 2"
              >
                H2
              </button>
              <button
                type="button"
                class={`btn btn-sm ${editorRef.value?.isActive("heading", { level: 3 }) ? "btn-active" : ""}`}
                onClick$={() => editorRef.value?.chain().focus().toggleHeading({ level: 3 }).run()}
                title="Heading 3"
              >
                H3
              </button>
              <div class="divider divider-horizontal"></div>
              <button
                type="button"
                class={`btn btn-sm ${editorRef.value?.isActive("bulletList") ? "btn-active" : ""}`}
                onClick$={() => editorRef.value?.chain().focus().toggleBulletList().run()}
                title="Bullet List"
              >
                • List
              </button>
              <button
                type="button"
                class={`btn btn-sm ${editorRef.value?.isActive("orderedList") ? "btn-active" : ""}`}
                onClick$={() => editorRef.value?.chain().focus().toggleOrderedList().run()}
                title="Ordered List"
              >
                1. List
              </button>
              <div class="divider divider-horizontal"></div>
              <button
                type="button"
                class={`btn btn-sm ${editorRef.value?.isActive({ textAlign: "left" }) ? "btn-active" : ""}`}
                onClick$={() => editorRef.value?.chain().focus().setTextAlign("left").run()}
                title="Align Left"
              >
                ←
              </button>
              <button
                type="button"
                class={`btn btn-sm ${editorRef.value?.isActive({ textAlign: "center" }) ? "btn-active" : ""}`}
                onClick$={() => editorRef.value?.chain().focus().setTextAlign("center").run()}
                title="Align Center"
              >
                ↔
              </button>
              <button
                type="button"
                class={`btn btn-sm ${editorRef.value?.isActive({ textAlign: "right" }) ? "btn-active" : ""}`}
                onClick$={() => editorRef.value?.chain().focus().setTextAlign("right").run()}
                title="Align Right"
              >
                →
              </button>
            </>
          )}
        </div>

        {/* Editor */}
        <div ref={editorElement} class={`editor-content p-4 ${height} overflow-y-auto`} />
      </div>
    );
  }
);
