import { redirect } from "@remix-run/server-runtime";
import { routes } from "~/dashboard.server";
import type { BasePermissions } from "@prisma/client";
import { prisma } from "~/db.server";

// Move Statements into Function Motivation Refactoring M. Fowler
// https://khalilstemmler.com/articles/client-side-architecture/architecture/
// solidbook 5. Constraints
export async function requireUserGeReadOnlyBasePermission({
  userId,
  baseId,
}: Pick<BasePermissions, "userId" | "baseId">) {
  const basePermission = await prisma.basePermissions.findFirst({
    where: { userId, baseId },
  });

  if (!basePermission) {
    throw redirect(routes.bases);
  }
}
