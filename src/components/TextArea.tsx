import React, { TextareaHTMLAttributes } from "react";

const TextArea = React.forwardRef(
  (
    { children, style, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>,
    ref: React.ForwardedRef<HTMLTextAreaElement>
  ) => {
    return (
      <textarea
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
      </textarea>
    );
  }
);

export default TextArea;
