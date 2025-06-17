// layout.tsx (без routeLoader$)
import { component$, Slot, useVisibleTask$ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { isLoggedIn as checkIsLoggedIn } from "~/utils/pocketbase";

export default component$(() => {
  const nav = useNavigate();

  useVisibleTask$(() => {
    const isLoggedIn = checkIsLoggedIn();
    if (!isLoggedIn) {
      nav("/login");
    }
  });

  return <Slot />;
});
