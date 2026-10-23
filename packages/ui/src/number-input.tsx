"use client";
import { forwardRef, useId, useImperativeHandle, useRef } from "react";
import type { InputFieldProps } from "./input";
import { cx } from "./utils";

export interface NumberInputProps extends Omit<InputFieldProps, "type" | "value" | "defaultValue" | "min" | "max" | "step"> {
  /** A string value lets controlled fields remain empty while editing. */
  value?: number | string;
  defaultValue?: number | string;
  min?: number;
  max?: number;
  step?: number | "any";
  orientation?: "vertical" | "horizontal";
}

/** Native number-field semantics with consistently styled step controls. */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  { label, hint, error, id, className, orientation = "vertical", step = 1, placeholderReveal = false, "aria-describedby": description, ...props }, ref,
) {
  const generated = useId();
  const inputId = id ?? generated;
  const helpId = `${inputId}-help`;
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current!, []);
  const canStep = step !== "any";

  function adjust(direction: "up" | "down") {
    const input = inputRef.current;
    if (!input || input.disabled || input.readOnly || !canStep) return;
    input.focus({ preventScroll: true });
    const previous = input.value;
    // Native stepping handles decimal precision, empty values and min/max alignment.
    if (direction === "up") input.stepUp();
    else input.stepDown();
    // stepUp/stepDown do not emit an input event themselves. React's onChange
    // receives the real input as its target, including in controlled fields.
    if (input.value !== previous) input.dispatchEvent(new Event("input", { bubbles: true }));
  }

  return <div className="cs-field">
    <label htmlFor={inputId}>{label}</label>
    <div data-orientation={orientation} className={cx("cs-number-control", placeholderReveal && "cs-input-reveal")}>
      <input
        {...props}
        ref={inputRef}
        id={inputId}
        type="number"
        step={step}
        data-steppers={canStep || undefined}
        aria-invalid={error ? true : props["aria-invalid"]}
        aria-describedby={[description, error || hint ? helpId : undefined].filter(Boolean).join(" ") || undefined}
        className={cx("cs-input", "cs-number-input", className)}
      />
      {placeholderReveal && props.placeholder && <span className="cs-input-placeholder-reveal" aria-hidden="true">{Array.from(props.placeholder).map((char, index) => <span key={index} style={{ animationDelay: `${index * 90}ms` }}>{char}</span>)}</span>}
      {canStep && <span className="cs-number-steppers">
        {(orientation === "horizontal" ? ["down", "up"] as const : ["up", "down"] as const).map(direction => <button
          key={direction}
          type="button"
          className="cs-number-step"
          aria-label={`${direction === "up" ? "增加" : "减少"}${label}`}
          aria-controls={inputId}
          tabIndex={-1}
          disabled={props.disabled || props.readOnly}
          onPointerDown={event => event.preventDefault()}
          onClick={() => adjust(direction)}
        ><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={orientation === "horizontal" ? direction === "up" ? "M5 12h14M12 5v14" : "M5 12h14" : direction === "up" ? "m6 15 6-6 6 6" : "m6 9 6 6 6-6"} /></svg></button>)}
      </span>}
    </div>
    {(error || hint) && <span id={helpId} className={cx("cs-help", !!error && "cs-error")}>{error || hint}</span>}
  </div>;
});
