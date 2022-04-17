// Use this to create a new base permission
// Simply call this with:
// npx ts-node --require tsconfig-paths/register ./cypress/support/create-base-permission.ts '{"userId": 0, "baseId": 0, "level": "creator"}'

import type { BasePermissions } from "@prisma/client";
import { installGlobals } from "@remix-run/node/globals";
import { prisma } from "~/db.server";

installGlobals();

async function create(input_: string) {
  const input: Pick<BasePermissions, "userId" | "baseId" | "level"> =
    JSON.parse(input_) as any;

  await prisma.basePermissions.create({
    data: input,
  });
}

// for base: create(input: Omit<Base, 'id'>); makeBase

create(process.argv[2]);
