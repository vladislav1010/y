// solidbook 26. Use Page Objects to write declarative E2E tests

const editAutomation = {
  clickAddTriggerButton: () =>
    cy
      .findByRole("button", {
        name: /add trigger/i,
      })
      .click(),
  getFlowDiagram: () => cy.findByTestId("flow_diagram"),
  createAndOpenBlankAutomation: () =>
    cy
      .findByRole("button", { name: /create automation/i })
      .click()
      .waitForLoadingToFinish(),
  selectInstalledAppAndTriggerType: (
    appTitle: string,
    triggerTypeTitle: string
  ) =>
    cy
      .findByRole("button", { name: appTitle })
      .click()
      .findByLabelText(new RegExp(appTitle + " description"))
      .within(() =>
        cy.findByRole("button", { name: triggerTypeTitle }).click()
      ),
};

export default editAutomation;
