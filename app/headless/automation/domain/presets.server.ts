import type {
  AutomationFormField,
  AutomationTriggerType,
} from "@prisma/client";

const automationTriggerTypes: (Omit<AutomationTriggerType, "id"> & {
  formFields: Omit<AutomationFormField, "id" | "triggerTypeId">[];
})[] = [
  {
    title: "When a record is created",
    formFields: [
      {
        name: "table",
        label: "Table",
        required: true,
        type: "TABLE",
        error: {
          required: "The input is required",
          conditionIncompleteOrInvalid:
            "The condition is incomplete or invalid",
        },
        accessibilityDescription: "",
      },
    ],
  },
];

export { automationTriggerTypes };
