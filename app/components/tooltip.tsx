import type { TooltipProps as ReachTooltipProps } from "@reach/tooltip";
import { Tooltip as ReachTooltip } from "@reach/tooltip";
import stylesheetUrl from "@reach/tooltip/styles.css";
import clsx from "clsx";

interface TooltipProps extends ReachTooltipProps {
  color: "dark" | "light";
  className?: string;
}

const Tooltip = ({ color, ...rest }: TooltipProps) => (
  <ReachTooltip
    {...rest}
    className={clsx(
      {
        "layout-1_bg-color_black": color === "dark",
      },
      "rounded-sm",
      rest.className
    )}
  />
);

export default Tooltip;
export { stylesheetUrl as tooltipStylesheetUrl };
