import type { Filter } from "@prisma/client";
import { oneOf, build } from "@jackfranklin/test-data-bot";

const filterBuilder = build<Omit<Filter, "id" | "viewId">>("Filter", {
  fields: {
    conjunction: oneOf("OR", "AND"),
  },
});

function makeFilter({
  viewId,
  ...overrides
}: Partial<Omit<Filter, "id" | "viewId">> & Pick<Filter, "viewId">): Omit<
  Filter,
  "id"
> {
  return { ...filterBuilder({ overrides }), viewId };
}

export { makeFilter };
