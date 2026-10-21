"use client";
import { forwardRef } from "react";
import { Input, type InputProps } from "./index";
import { cx } from "./utils";

export interface NumberInputProps extends Omit<InputProps, "type" | "value" | "defaultValue" | "min" | "max" | "step"> {
  /** A string value lets controlled fields remain empty while editing. */
  value?: number | string;
  defaultValue?: number | string;
  min?: number;
  max?: number;
  step?: number | "any";
}

/** Native number-field semantics with the shared label, validation and focus treatment. */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  { className, step = 1, ...props }, ref,
) {
  return <Input {...props} ref={ref} type="number" step={step} className={cx("cs-number-input", className)} />;
});
