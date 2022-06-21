import React, { InputHTMLAttributes } from "react";

const Input = React.forwardRef(
  (
    { children, style, ...props }: InputHTMLAttributes<HTMLInputElement>,
    ref: React.ForwardedRef<HTMLInputElement>
  ) => {
    return (
      <input
        {...props}
        style={{
          ...style,
          borderRadius: 6,
          padding: "12px 24px",
          border: "1px solid lightgrey",
          fontFamily: "inherit",
        }}
        ref={ref}
      >
        {children}
      </input>
    );
  }
);

export default Input;
