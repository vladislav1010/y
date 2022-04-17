import type { View } from "@prisma/client";
import * as React from "react";

type PropsWeControl = "onClick";

interface AddFilterConditionButtonProps {
  viewId: View["id"];
  /** Any ReactNode elements. */
  children: React.ReactNode;
  /** The text that is announced by the screen reader when the filter condition is being added. Used for accessibility purposes only and not displayed on the page. */
  accessibleAddingFilterConditionLabel?: string;
}

export default function AddFilterConditionButton(
  props: Omit<JSX.IntrinsicElements["button"], PropsWeControl> &
    AddFilterConditionButtonProps
) {
  const {} = props;
  return <div></div>;
}
