import type { Automation } from "@prisma/client";
// TODO: perf tree shaking
import _ from "lodash";
import { prisma } from "~/db.server";

export function updateAutomation(id: Automation["id"], formData: FormData) {
  const data = _.omitBy(
    {
      title: formData.get("title"),
      description: formData.get("description"),
    } as const,
    _.isUndefined
  );

  return prisma.automation.update({
    where: { id },
    data,
  });
}
