import type {
  ActionFunction,
  LinksFunction,
  LoaderFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import * as React from "react";
import { requireUserId } from "~/session.server";
import type { Automation } from "@prisma/client";
import { updateAutomation } from "~/models/automation.server";
import { prisma } from "~/db.server";
import invariant from "tiny-invariant";
import {
  Form,
  useLoaderData,
  useParams,
  useTransition,
} from "@remix-run/react";
import { requireUserGeReadOnlyBasePermission } from "~/headless/permission/base.server";
import automationIdStylesheetUrl from "./$automationId.edit.css";
import clsx from "clsx";
import { Button, LinkButton } from "~/components/button";
import { Menu, Popover } from "@headlessui/react";
import Tooltip, { tooltipStylesheetUrl } from "~/components/tooltip";

// https://github.com/kentcdodds/kentcdodds.com/blob/main/app/convertkit/form.tsx
// https://github.com/kentcdodds/kentcdodds.com/blob/main/app/routes/chats.tsx
// Here several types of layers. Minimum, data-access, ui / presentation, interaction
// https://github.com/kentcdodds/kentcdodds.com/blob/main/app/convertkit/form.tsx#L24-L37

// https://github.com/kentcdodds/kentcdodds.com/blob/main/app/routes/chats.tsx
// https://github.com/kentcdodds/kentcdodds.com/blob/436d01dad10aa9ea7c5bc1ad3d694f57e3d7a41f/app/utils/chats-with-kent.ts
// look for abstractions, incl. dependencies
// 2nd link - all abstractions are called at least 2 times

// https://github.com/kentcdodds/kentcdodds.com/blob/main/app/routes/workshops/%24slug.tsx#L128
// There is components in route files

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tooltipStylesheetUrl },
    { rel: "stylesheet", href: automationIdStylesheetUrl },
  ];
};

type LoaderData = {
  automation: Automation;
};

// solidbook 5. Human-Centered Design For Developers, solidbook 8.
// Exactly: The 7 Stages of Action, Unit Testing 5.2.1. Observable behavior is not the same as a public API, 5.2.3. Well-designed API and encapsulation, 3.1.4. How large should each section be?
// Elaboration: all related
export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);

  invariant(params.baseId, "baseId not found");
  invariant(params.automationId, "automationId not found");

  await requireUserGeReadOnlyBasePermission({ userId, baseId: params.baseId });

  // https://github.com/kentcdodds/kentcdodds.com/blob/4f81bc5cc58ac5f2ca36a63360e43a7a51493b7b/app/utils/simplecast.server.ts#L119
  // https://github.com/kentcdodds/kentcdodds.com/blob/4f81bc5cc58ac5f2ca36a63360e43a7a51493b7b/app/convertkit/convertkit.server.ts#L71
  // https://github.com/kentcdodds/kentcdodds.com/blob/4f81bc5cc58ac5f2ca36a63360e43a7a51493b7b/app/utils/session.server.ts#L133
  // https://github.com/kentcdodds/kentcdodds.com/blob/579fd40a7c4a3852ffd1b61f7d3a737bdcf2b6d1/app/routes/calls.record/%24callId.tsx#L24
  // solidbook Balancing structure vs. developer experience, Structure vs. Developer Experience
  // V.Khorikov Unit Testing 8.4. Using interfaces to abstract dependencies
  const automation = await prisma.automation.findFirst({
    where: {
      id: params.automationId,
      baseId: params.baseId,
    },
  });

  if (!automation) {
    throw new Response("Not Found", { status: 404 });
  }

  return json<LoaderData>({ automation });
};

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.automationId, "automationId not found");

  const formData = await request.formData();
  await updateAutomation(params.automationId, formData);
  return new Response("OK", { status: 200 });
};

function EditDescription({ automation }: { automation: Automation }) {
  const params = useParams();
  const transition = useTransition();

  return (
    <Tooltip label={automation.description} color="dark">
      <Popover>
        <Popover.Button as={React.Fragment}>
          <LinkButton>
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path
                fillRule="evenodd"
                fill="currentColor"
                d="M8,5.6667 C7.356,5.6667 6.833,5.1447 6.833,4.4997 C6.833,3.8557 7.356,3.3337 8,3.3337 C8.644,3.3337 9.167,3.8557 9.167,4.4997 C9.167,5.1447 8.644,5.6667 8,5.6667 L8,5.6667 Z M9,11.9997 C9,12.5527 8.552,12.9997 8,12.9997 C7.448,12.9997 7,12.5527 7,11.9997 L7,7.9997 C7,7.4477 7.448,6.9997 8,6.9997 C8.552,6.9997 9,7.4477 9,7.9997 L9,11.9997 Z M8,0.9997 C4.134,0.9997 1,4.1337 1,7.9997 C1,11.8657 4.134,14.9997 8,14.9997 C11.866,14.9997 15,11.8657 15,7.9997 C15,4.1337 11.866,0.9997 8,0.9997 L8,0.9997 Z"
              />
            </svg>
          </LinkButton>
        </Popover.Button>
        <Popover.Panel
          className={
            "shadow-[0_0_0_2px_rgb(0 0 0 / 10%)] w-60 rounded-sm bg-white p-2"
          }
        >
          <Form
            method="post"
            // TODO: check
            replace
          >
            <fieldset disabled={transition.state === "submitting"}>
              <div className="mb-2">
                <textarea
                  aria-label="описание"
                  name="description"
                  defaultValue={automation.description}
                ></textarea>
              </div>
              <div className="flex items-center justify-end">
                <Button type="submit" variant="primary" size="medium">
                  {transition.state === "submitting"
                    ? "Идет сохранение..."
                    : "Сохранить описание"}
                </Button>
              </div>
            </fieldset>
          </Form>
        </Popover.Panel>
      </Popover>
    </Tooltip>
  );
}

const panelClassName = "bg-white border-lightGray-4";

export default function EditAutomationPage() {
  const data = useLoaderData() as LoaderData;

  return (
    <main className="root">
      <div className={clsx(panelClassName, "flex items-center border-b-2")}>
        <div className="border-r-1 ml-4 flex-none border-darken-2 pr-4">
          <LinkButton>Back</LinkButton>
        </div>
        <div className="pl-4">
          <Menu>
            <Menu.Button as={React.Fragment}>
              <LinkButton className="truncate">
                {data.automation.title}
              </LinkButton>
            </Menu.Button>
          </Menu>
        </div>
        <EditDescription automation={data.automation} />
      </div>
    </main>
  );
}
