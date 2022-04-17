import type { Field, Table } from "@prisma/client";
import { oneOf, build } from "@jackfranklin/test-data-bot";
import { fieldType } from "../../app/headless/table/type";
import type { FieldDataType, FieldType } from "../../app/headless/table/types";

function makeTable(
  overrides: Partial<Omit<Table, "id" | "baseId">> & Pick<Table, "baseId">
): Omit<Table, "id"> {
  return {
    ...overrides,
  };
}

const fieldBuilder = build<Omit<Field, "id" | "tableId">>("Field", {
  fields: {
    isPrimary: false,
    order: null,
    type: oneOf(
      ...Object.values(fieldType).reduce(
        (r, x) => [...r, ...(Object.keys(x) as FieldType[FieldDataType][])],
        [] as FieldType[FieldDataType][]
      )
    ),
  },
});

function makeField({
  tableId,
  ...overrides
}: Partial<Omit<Field, "id" | "tableId">> & Pick<Field, "tableId">): Omit<
  Field,
  "id"
> {
  return { ...fieldBuilder({ overrides }), tableId };
}

export { makeTable, makeField };
