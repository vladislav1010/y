import { prisma } from "~/db.server";
import type { Field, Filter, View } from "@prisma/client";
import { operators } from "../operators";
import { fieldType } from "~/headless/table/type";
import type { FieldDataType } from "~/headless/table/types";
import { defaultFilter } from "../domain/index.server";
import type { ActionDataSuccess, FieldsError } from "~/infra/rest/types";
import type { FilterActionFieldsByType } from "../api";

export interface AddConditionErrorResult
  extends FieldsError<
    FilterActionFieldsByType["addCondition"],
    {
      type: "BUSINESS_RULE";
      subType: string;
    }
  > {
  status: "error";
  fields: {};
  generalError: { type: "BUSINESS_RULE"; subType: "tableHasNotFields" };
}

async function addCondition({
  viewId,
}: {
  viewId: View["id"];
}): Promise<AddConditionErrorResult | ActionDataSuccess> {
  // TODO: Potential SQL injection risk
  const firstPrimaryField =
    (
      await prisma.$queryRawUnsafe<(Field | undefined)[]>(
        'SELECT "Field".* FROM "View" JOIN "Field" ON "View"."tableId" = "Field"."tableId" WHERE "View"."id" = $1 AND "Field"."isPrimary" ORDER BY COALESCE("Field"."order", 0) ASC LIMIT 1',
        viewId
      )
    )[0] ?? null;

  if (!firstPrimaryField) {
    return {
      fields: {},
      generalError: {
        subType: "tableHasNotFields",
        type: "BUSINESS_RULE",
      },
      status: "error",
    };
  }

  const filter = await prisma.filter.findFirst({ where: { viewId } });

  let filterId_: Filter["id"] | undefined = filter?.id;
  if (!filterId_) {
    const filter = await prisma.filter.create({
      data: { viewId: viewId, ...defaultFilter },
    });

    filterId_ = filter.id;
  }

  await prisma.filterCondition.create({
    data: {
      filterId: filterId_,
      fieldId: firstPrimaryField.id,
      operator:
        operators[
          Object.entries(fieldType).find(([, types]: any) =>
            Object.keys(types as Record<string, true>).includes(
              firstPrimaryField.type
            )
          )![0] as FieldDataType
        ][0],
      value: null,
    },
  });

  return { status: "success" };
}

export default addCondition;
