import type { Filter } from "@prisma/client";

const defaultFilter: Pick<Filter, "conjunction"> = {
  conjunction: "AND",
};

export { defaultFilter };
