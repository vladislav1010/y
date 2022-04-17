import type { User } from "@prisma/client";
import _ from "lodash";
import { prisma } from "~/db.server";

export async function getUserBaseAndPermissionListItems({
  userId,
}: {
  userId: User["id"];
}) {
  const result = await prisma.basePermissions.findMany({
    where: { userId },
    include: { base: true },
  });

  return result.map((x) => ({ ..._.pick(x, "level"), ...x.base }));
}
