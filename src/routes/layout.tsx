import { component$, Slot } from "@builder.io/qwik";
import { Navigation } from "~/components/Navigation";

export default component$(() => {
  return (
    <>
      <Navigation />
      <main>
        <Slot />
      </main>
    </>
  );
});
