import type { Operator } from "../domain/types";

const operators: Operator = {
  string: ["is empty", "contains", "="],
  number: [">", "=", "is empty"],
};

export { operators };
