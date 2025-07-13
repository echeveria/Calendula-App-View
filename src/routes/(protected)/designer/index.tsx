import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import Konva from "konva";

export default component$(() => {
  const parentRef = useSignal<HTMLDivElement>();
  // const width = useSignal(0);
  // const height = useSignal(0);

  useVisibleTask$(() => {
    const container = parentRef.value;
    if (!container) return;

    const { width, height } = container.getBoundingClientRect();

    const stage = new Konva.Stage({
      container: container,
      width: width - 20,
      height,
    });
    const layer = new Konva.Layer();
    stage.add(layer);

    const rect = new Konva.Rect({
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      fill: "green",
      draggable: true,
    });

    layer.add(rect);
    layer.draw();
  });
  return (
    <div ref={parentRef} class="h-[calc(100vh-6rem)] bg-base-200 p-4">
      <div id="garden-canvas" />
    </div>
  );
});
