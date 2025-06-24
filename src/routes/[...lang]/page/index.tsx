import { inlineTranslate } from "qwik-speak";
import { component$ } from "@builder.io/qwik";

export default component$(() => {
  const t = inlineTranslate();

  const key = "dynamic";

  return (
    <>
      <h1>{t("app.title", { name: "Qwik Speak" })}</h1>

      <p>{t(`runtime.${key}`)}</p>
    </>
  );
});
