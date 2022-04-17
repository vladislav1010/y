import type { PropGetterV2 } from "@chakra-ui/react-utils";
import { createContext } from "@chakra-ui/react-utils";
import type { Transition } from "@remix-run/react/transition";
import type { FormProps } from "@remix-run/react";
import { useActionData, useSubmit, useTransition } from "@remix-run/react";
import type * as React from "react";

export const [FilterProvider, useFilterContext] = createContext<{
  transition: Transition;
}>({
  strict: true,
  name: "FilterContext",
});

export function useFilter() {
  const submit = useSubmit();
  const actionData = useActionData();
  const transition = useTransition();

  const getFieldsetProps: PropGetterV2<"fieldset"> = (props, ref) => ({
    ref,
    ...props,
    disabled: transition.state === "submitting",
  });

  const getFormProps = (props: Omit<FormProps, "replace">): FormProps => ({
    ...props,
    replace: true,
    onSubmit: (event) => {
      event.preventDefault();
    },
  });

  const handleSubmitClick = (event: React.MouseEvent, type: string) => {
    const formData = new FormData(event.currentTarget.closest("form")!);
    formData.set("type", type);

    submit(formData);
  };

  const getAddConditionButtonProps: PropGetterV2<"button"> = (props, ref) => ({
    ref,
    ...props,
    type: "button",
    onClick: (event) => handleSubmitClick(event, "addCondition"),
  });

  return {
    submit,
    actionData,
    transition,
    getFieldsetProps,
    getFormProps,
    getAddConditionButtonProps,
  };
}

export interface UseFilterReturn extends ReturnType<typeof useFilter> {}
