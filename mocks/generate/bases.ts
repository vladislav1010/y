import type { Base } from "@prisma/client";
import faker from "@faker-js/faker";

function makeBase(overrides: Partial<Omit<Base, "id">> = {}): Omit<Base, "id"> {
  return {
    title: faker.lorem.words(),
    color: faker.internet.color(),
    ...overrides,
  };
}

export { makeBase };
