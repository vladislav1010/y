import type { FieldType } from "../types";

const fieldType: { [K in keyof FieldType]: Record<FieldType[K], true> } = {
  number: { currency: true },
  string: { longText: true, singleLineText: true },
};

export { fieldType };
