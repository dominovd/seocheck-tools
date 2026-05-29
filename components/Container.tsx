import { type HTMLAttributes } from "react";

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  as?: "div" | "section" | "main" | "article" | "header" | "footer";
};

/**
 * Centered, max-width container used across the site for consistent gutter.
 */
export function Container({
  as: Tag = "div",
  className = "",
  children,
  ...rest
}: ContainerProps) {
  return (
    <Tag
      className={`mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8 ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
