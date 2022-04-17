import { describe, it } from "vitest";
import addCondition from "./add-condition.server";
import { prisma } from "~/db.server";
import { makeBase } from "../../../../mocks/generate/bases";
import { makeView } from "../../../../mocks/generate/views";
import { makeField, makeTable } from "../../../../mocks/generate/tables";
import type { Field, View } from "@prisma/client";
import { makeFilter } from "../../../../mocks/generate/filters";

let view: View | undefined = undefined,
  firstPrimaryField: Field | undefined = undefined;

beforeEach(async () => {
  // https://github.com/kentcdodds/testing-react-apps/blob/main/src/__tests__/exercise/04.md
  const base = await prisma.base.create({ data: makeBase() });
  const table = await prisma.table.create({
    data: makeTable({ baseId: base.id }),
  });
  firstPrimaryField = await prisma.field.create({
    data: makeField({ tableId: table.id, isPrimary: true }),
  });
  view = await prisma.view.create({
    data: makeView({ tableId: table.id, filterId: null }),
  });
});

// solidbook Acceptance tests BDD (behavior-driven development), Format #1: Single-line tests

describe("success", () => {
  it("adds condition with first primary field", async () => {
    // Arrange
    await prisma.filter.create({
      data: makeFilter({ viewId: view!.id }),
    });

    // Act
    const result = await addCondition({
      viewId: view!.id,
    });

    // Assert
    expect(result.status).toBe("success");
    const filter = await prisma.filter.findFirst({
      where: { viewId: view!.id },
      include: { conditions: true },
    });

    expect(filter).not.toBe(null);
    expect(filter!.conditions.length).toBe(1);
    expect(filter!.conditions[0].fieldId).toBe(firstPrimaryField!.id);
  });

  it(`when no filter exists, then creates filter with "AND" conjunction, adds condition`, async () => {
    // Act
    const result = await addCondition({ viewId: view!.id });

    // Assert
    expect(result.status).toBe("success");

    const filter = await prisma.filter.findFirst({
      where: { viewId: view!.id },
      include: { conditions: true },
    });

    expect(filter).not.toBe(null);
    expect(filter!.conditions.length).toBe(1);
    expect(filter!.conditions[0].fieldId).toBe(firstPrimaryField!.id);
    expect(filter!.conjunction).toBe("AND");
  });
});
