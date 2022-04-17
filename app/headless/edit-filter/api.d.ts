export type FilterActionFieldsByType = {
  addCondition: Record<string, never>;
  change: Partial<Omit<Filter, "id">> &
    Pick<Filter, "id"> & {
      conditions: (Partial<Omit<FilterCondition, "id">> &
        Pick<FilterCondition, "id">)[];
    };
};

export type FilterActionInput =
  | {
      type: "addCondition";
    }
  | ({
      type: "change";
    } & FilterActionFieldsByType["change"]);

export type FilterLoaderData = {
  filter:
    | (Filter & {
        conditions: FilterCondition[];
      })
    | null;
};
