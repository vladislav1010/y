import { prisma } from "~/db.server";
import { makeBase } from "~/headless/base/domain/base.server";
import { requireUserId } from "~/session.server";

async function createBase(request: Request, unnamedTitle: string) {
  const userId = await requireUserId(request);

  const base = await prisma.base.create({
    data: makeBase({}, unnamedTitle),
  });

  await prisma.basePermissions.create({
    data: {
      baseId: base.id,
      userId: userId,
      level: "creator",
    },
  });

  return base.id;
}

export { createBase };
