const automations = {
  open: () => cy.findByRole("button", { name: /automations/i }).click(),
};

export default automations;
