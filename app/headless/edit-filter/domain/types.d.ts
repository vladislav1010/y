import type { Field } from "@prisma/client";
import type { FieldDataType } from "~/headless/table/types";

// TODO: What is also for client here?

export interface Filter {
  conjunction: "OR" | "AND";
}

export interface Operator {
  string: ["is empty", "contains", "="];
  number: [">", "=", "is empty"];
}

export interface FilterCondition<TFieldDataType extends FieldDataType> {
  value: TFieldDataType | null;
  operator: Operator[TFieldDataType];
  fieldId: Field["id"];
}
