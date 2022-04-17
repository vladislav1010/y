import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { i18n } from "~/infra/i18n.server";
import addCondition from "~/headless/edit-filter/add-condition";
import type { ActionDataError, ActionDataSuccess } from "~/infra/rest/types";
import { requireUserId } from "~/session.server";
import { requireUserGeReadOnlyBasePermission } from "~/headless/permission/base.server";
import { prisma } from "~/db.server";
import type {
  FilterActionFieldsByType,
  FilterActionInput,
  FilterLoaderData,
} from "~/headless/edit-filter/api";
import Filter from "~/components/explicit-view/filter";
import { useParams } from "@remix-run/react";

export let handle = {
  // In the handle export, we could add a i18n key with namespaces our route
  // will need to load. This key can be a single string or an array of strings.
  i18n: ["filter", "common"],
};

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.viewId, "viewId not found");

  const t = await i18n.getFixedT(request);

  try {
    const requestText = await request.text();
    const form = new URLSearchParams(requestText);

    const type = form.get("type") as FilterActionInput["type"];

    if (type === "addCondition") {
      const result = await addCondition({
        viewId: params.viewId,
      });

      if (result.status === "success") {
        return json<ActionDataSuccess>(result);
      } else if (result.status === "error") {
        if (result.generalError.subType === "tableHasNotFields") {
          return json<
            ActionDataError<FilterActionFieldsByType["addCondition"]>
          >({
            errors: {
              generalError: t("errors.tableHasNotFields", "filter"),
              fields: {},
            },
            httpStatus: 400,
            status: "error",
          });
        }
      }
    }

    // TODO: other `type`s
  } catch (error: unknown) {
    return json<ActionDataError<Record<string, never>>>({
      errors: { generalError: t("errors.unexpected", "common"), fields: {} },
      status: "error",
      httpStatus: 500,
    });
  }

  throw new Error();
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);

  invariant(params.viewId, "viewId not found");
  invariant(params.baseId, "baseId not found");

  await requireUserGeReadOnlyBasePermission({ userId, baseId: params.baseId });

  const filter = await prisma.filter.findFirst({
    where: { viewId: params.viewId },
    include: { conditions: true },
  });

  return json<FilterLoaderData>({ filter });
};

function FilterScreen() {
  const { viewId, baseId, tableId } = useParams<
    "viewId" | "baseId" | "tableId"
  >();

  invariant(viewId, "viewId not found");
  invariant(baseId, "viewId not found");
  invariant(tableId, "tableId not found");

  return (
      <Filter />
  );
}

export default FilterScreen;
