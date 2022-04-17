import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { prisma } from "~/db.server";
import type { ActionDataSuccess } from "~/headless/view/api";

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.tableId, "tableId not found");

  const view = await prisma.view.create({
    data: { tableId: params.tableId },
  });

  return json<ActionDataSuccess>({ id: view.id });
};
