import { RemixServer } from "@remix-run/react";
import type { EntryContext } from "@remix-run/node";
import { CacheProvider } from "@emotion/react";
import createEmotionServer from "@emotion/server/create-instance";
import { createInstance } from "i18next";
import Backend from "i18next-fs-backend";
import { resolve } from "node:path";
import { renderToString } from "react-dom/server";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { i18n } from "~/infra/i18n.server";

import { ServerStyleContext } from "./context";
import createEmotionCache from "./createEmotionCache";

export default async function handleRequest(
  request: Request,
  statusCode: number,
  headers: Headers,
  context: EntryContext
) {
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  // First, we create a new instance of i18next so every request will have a
  // completely unique instance and not share any state
  let instance = createInstance();

  // Then we could detect locale from the request
  let lng = await i18n.getLocale(request);
  // And here we detect what namespaces the routes about to render want to use
  let ns = i18n.getRouteNamespaces(context);

  await instance
    .use(initReactI18next) // Tell our instance to use react-i18next
    .use(Backend) // Setup our backend
    .init({
      // And configure i18next as usual
      supportedLngs: ["es", "en"],
      defaultNS: "common",
      fallbackLng: "en",
      // Disable suspense again here
      react: { useSuspense: false },
      lng, // The locale we detected above
      ns, // The namespaces the routes about to render want to use
      backend: {
        loadPath: resolve("./public/locales/{{lng}}/{{ns}}.json"),
      },
    });

  // Then you can render your app wrapped in the I18nextProvider as in the
  // entry.client file
  let html = renderToString(
    <ServerStyleContext.Provider value={null}>
      <CacheProvider value={cache}>
        <I18nextProvider i18n={instance}>
          <RemixServer context={context} url={request.url} />
        </I18nextProvider>
      </CacheProvider>
    </ServerStyleContext.Provider>
  );

  const chunks = extractCriticalToChunks(html);

  const markup = renderToString(
    <ServerStyleContext.Provider value={chunks.styles}>
      <CacheProvider value={cache}>
        <I18nextProvider i18n={instance}>
          <RemixServer context={context} url={request.url} />
        </I18nextProvider>
      </CacheProvider>
    </ServerStyleContext.Provider>
  );

  headers.set("Content-Type", "text/html");

  return new Response("<!DOCTYPE html>" + markup, {
    status: statusCode,
    headers: headers,
  });
}
