import { installGlobals } from "@remix-run/node/globals";
import "@testing-library/jest-dom/extend-expect";
import { prisma } from "~/db.server";

installGlobals();

// # but it's for server only
// https://github.com/kentcdodds/bookshelf/blob/exercises/13-integration-testing/INSTRUCTIONS.md#4--move-test-utilities-to-global-utils
afterEach(async () => {
  // # maps over your models and performs a truncate on them. The deletion script must remove all regular data but none of the reference data. Reference data, along with the rest of the database schema, should be controlled solely by migrations.
  const truncate = prisma.$executeRaw`TRUNCATE "FilterCondition", "Filter", "View", "Field", "Table", "Base" CASCADE`;
  // # in schema, custom records should start from id 100
  // TODO: # Will it difficult to keep "where the reference data?" consistent across the code base?
  // const deleteAutomationTriggerType = prisma.$executeRaw`DELETE FROM "AutomationTriggerType" WHERE id >= 100`;
  // # etc.

  await prisma.$transaction([truncate]);
});
