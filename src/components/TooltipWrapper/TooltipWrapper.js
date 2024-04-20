import React from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { PlusIcon } from "@radix-ui/react-icons";
import "./styles.css";

const TooltipWrapper = ({
  children,
  message,
  side,
  sideOffset,
  arrowshiftY,
  arrowshiftX,
}) => {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="TooltipContent"
            sideOffset={sideOffset}
            side={side}
          >
            {message}
            <Tooltip.Arrow
              style={{ transform: `translate(${arrowshiftX}, ${arrowshiftY})` }}
              className="TooltipArrow"
            />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default TooltipWrapper;
