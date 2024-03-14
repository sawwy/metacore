import { HTMLAttributes, forwardRef } from "react";

type ItemProps = HTMLAttributes<HTMLDivElement> & {
  value: string;
};

export const Item = forwardRef<HTMLDivElement, ItemProps>(
  ({ value, ...props }, ref) => {
    return (
      <div {...props} ref={ref}>
        {value}
      </div>
    );
  }
);

Item.displayName = "Item";
