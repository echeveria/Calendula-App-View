import type { SpeakConfig } from "qwik-speak";

export const config: SpeakConfig = {
  defaultLocale: { lang: "en-US", currency: "USD", timeZone: "America/Los_Angeles" },
  supportedLocales: [
    { lang: "bg-BG", currency: "BGN", timeZone: "Europe/Sofia" },
    { lang: "en-US", currency: "USD", timeZone: "America/Los_Angeles" },
  ],
  // Translations available in the whole app
  assets: ["app"],
  // Translations with dynamic keys available in the whole app
  runtimeAssets: ["runtime"],
};
