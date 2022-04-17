import * as React from "react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import { getUserBaseAndPermissionListItems } from "../models/base.server";
import { Form, Link, useLoaderData, useTransition } from "@remix-run/react";
import { LinkButton, getButtonOrLinkClassName } from "../components/button";
import { toTitle } from "../utils/convert-case";
import clsx from "clsx";
import { createBase } from "~/headless/base/create.server";

type LoaderData = {
  baseAndPermissionListItems: Awaited<
    ReturnType<typeof getUserBaseAndPermissionListItems>
  >;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  // solidbook Naming Principle #3: Specificity recursive
  // Refactoring M. Fowler Mysterious Name
  const baseAndPermissionListItems = await getUserBaseAndPermissionListItems({
    userId,
  });
  return json<LoaderData>({ baseAndPermissionListItems });
};

export const action: ActionFunction = async function action({ request }) {
  const baseId = await createBase(request, "Безымянная");

  return redirect(`/bases/${baseId}`);
};

function Base({
  children,
  caption,
}: {
  children: React.ReactNode;
  caption: string;
}) {
  return (
    <div
      className={clsx("flex flex-col items-center", baseItemClassName.layout)}
    >
      {children}
      <div className="truncate-block mt-4 h-[4.5em] select-none break-words text-center leading-normal">
        {caption}
      </div>
    </div>
  );
}

// https://remix.run/docs/en/v1.4.2/api/remix#usefetcher

// Refactoring M. Fowler Mysterious Name
// solidbook
// "As humans, we rely a lot of patterns, past experiences, and conceptual models in order to equip ourselves with how we should act in future situations (knowledge in the head)."
// solidbook Make meaningful distinctions, Naming Principle #2: Understandability recursive, There’s a construct for everything
// "When we understand something, it means we understand what something is, and how we can use it."
const baseItemClassName = {
  layout: "w-24",
  card: {
    layout: "aspect-w-1 aspect-h-1 rounded-md w-24 h-24",
    content:
      "rounded-[inherit] animate hover:bg-darken-2 flex items-center justify-center",
  },
};

export default function BasesPage() {
  const transition = useTransition();
  const data = useLoaderData() as LoaderData;

  return (
    <div className="flex min-h-full">
      <div className="flex-[0_0_25%]"></div>
      <div className="flex-[0_0_75%]">
        <div className="flex flex-wrap space-x-4">
          {data.baseAndPermissionListItems.map((x) => (
            <Base key={x.id} caption={x.title}>
              <Link
                to={`/bases/${x.id}`}
                className={getButtonOrLinkClassName()}
              >
                <div
                  className={baseItemClassName.card.layout}
                  style={{
                    backgroundColor: x.color,
                  }}
                >
                  <div
                    className={clsx(
                      "text-2xl text-white",
                      baseItemClassName.card.content
                    )}
                  >
                    <span>{toTitle(x.title).replace(" ", "").slice(0, 2)}</span>
                  </div>
                </div>
              </Link>
            </Base>
          ))}
          {/* https://developer.mozilla.org/en-US/docs/Web/API/History_API/Working_with_the_History_API
         https://remix.run/docs/en/v1/api/remix#form-replace
        TODO: check `replace={false}` */}
          <Form method="post">
            <fieldset disabled={transition.state === "submitting"}>
              <Base
                key="new"
                caption={
                  transition.state === "submitting"
                    ? "Добавление базы…"
                    : "Добавить базу"
                }
              >
                <LinkButton aria-label="new">
                  <div className={baseItemClassName.card.layout}>
                    <div
                      className={clsx(
                        "bg-darken-1",
                        baseItemClassName.card.content
                      )}
                    >
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 16 16"
                        className="opacity-50"
                      >
                        <path
                          fillRule="evenodd"
                          fill="currentColor"
                          d="M9,7 L9,3.5 C9,3.224 8.776,3 8.5,3 L7.5,3 C7.224,3 7,3.224 7,3.5 L7,7 L3.5,7 C3.224,7 3,7.224 3,7.5 L3,8.5 C3,8.776 3.224,9 3.5,9 L7,9 L7,12.5 C7,12.776 7.224,13 7.5,13 L8.5,13 C8.776,13 9,12.776 9,12.5 L9,9 L12.5,9 C12.776,9 13,8.776 13,8.5 L13,7.5 C13,7.224 12.776,7 12.5,7 L9,7 Z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </LinkButton>
              </Base>
            </fieldset>
          </Form>
        </div>
      </div>
    </div>
  );
}
