import type { BasePermissions, User } from "@prisma/client";
import { Given, And, When, Then } from "cypress-cucumber-preprocessor/steps";
import { makeBase } from "~/headless/base/domain/base.server";
import editAutomation from "../../accessibility/edit-automation";
import automations from "../../accessibility/automations";

Given("automation environment", async () => {});

async function createBaseWithPermissionCreator(
  input: Pick<BasePermissions, "userId">
) {
  cy.exec(
    `npx ts-node --require tsconfig-paths/register ./cypress/support/create-base.ts '${JSON.stringify(
      makeBase({}, "Безымянная")
    )}'`
  )
    .then(({ stdout }) => {
      return Number(stdout);
    })
    .then((baseId) => {
      cy.exec(
        `npx ts-node --require tsconfig-paths/register ./cypress/support/create-base-permission.ts '${JSON.stringify(
          { ...input, baseId, level: "creator" }
        )}'`
      );

      return baseId;
    })
    .as("@baseId");
}

And("user is capable of editing automation", () => {
  cy.login()
    .then(() => cy.get("@user"))
    .then((user) =>
      createBaseWithPermissionCreator({ userId: (user as any as User).id })
    );
});

And("blank automation", function (this: any) {
  cy.visit(`/bases/${this["@baseId"]}`).then(() =>
    automations.open().then(editAutomation.createAndOpenBlankAutomation)
  );
});

When("the user clicks button of adding trigger on the flow diagram", () => {
  editAutomation.getFlowDiagram().within(editAutomation.clickAddTriggerButton);
});

And("the user selects a installed app and trigger type", () => {
  // #
});

Then("the trigger with empty configuration is added", () => {
  // #
});
