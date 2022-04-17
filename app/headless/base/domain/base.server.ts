import type { Base } from "@prisma/client";
import { color } from "~/utils/random";

function makeBase(overrides: Partial<Omit<Base, "id">>, unnamedTitle: string) {
  return {
    title: unnamedTitle,
    color: color(),
    ...overrides,
  };
}

export { makeBase };
