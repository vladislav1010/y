import type { View } from "@prisma/client";

function makeView(
  overrides: Partial<Omit<View, "id" | "filterId" | "tableId">> &
    Pick<View, "filterId" | "tableId">
): Omit<View, "id"> {
  return {
    ...overrides,
  };
}

export { makeView };
