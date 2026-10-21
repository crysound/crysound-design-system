import React, { createRef, useState } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NumberInput } from "../packages/ui/src/index";

afterEach(cleanup);

it("keeps controlled empty, zero and decimal values distinct", async () => {
  const user = userEvent.setup();
  const changed = vi.fn();
  function Example() {
    const [draft, setDraft] = useState("64");
    return <NumberInput label="阈值" step={0.1} value={draft} onChange={event => {
      setDraft(event.target.value);
      changed(event.target.value, event.target.valueAsNumber);
    }} />;
  }
  render(<Example />);
  const input = screen.getByRole("spinbutton", { name: "阈值" });
  await user.clear(input);
  expect(input).toHaveValue(null);
  expect(changed).toHaveBeenLastCalledWith("", NaN);
  await user.type(input, "0");
  expect(input).toHaveValue(0);
  expect(changed).toHaveBeenLastCalledWith("0", 0);
  await user.clear(input);
  await user.type(input, "-1.5");
  expect(input).toHaveValue(-1.5);
  expect(changed).toHaveBeenLastCalledWith("-1.5", -1.5);
});

it("preserves native range, step, required validation and uncontrolled form reset", async () => {
  const user = userEvent.setup();
  const view = render(<form><NumberInput label="增益" name="gain" min={-2} max={2} step={0.5} defaultValue={0.5} required /><button type="reset">重置</button></form>);
  const input = screen.getByRole("spinbutton", { name: "增益" }) as HTMLInputElement;
  const form = view.container.querySelector("form")!;
  fireEvent.change(input, { target: { value: "3" } });
  expect(input.value).toBe("3");
  expect(input.validity.rangeOverflow).toBe(true);
  expect(form.checkValidity()).toBe(false);
  fireEvent.change(input, { target: { value: "0.3" } });
  expect(input.validity.stepMismatch).toBe(true);
  await user.clear(input);
  expect(input.validity.valueMissing).toBe(true);
  await user.click(screen.getByRole("button", { name: "重置" }));
  expect(input).toHaveValue(0.5);
  expect(form.checkValidity()).toBe(true);
  expect(new FormData(form).get("gain")).toBe("0.5");
});

it("shares label, error associations and the actual input ref", () => {
  const ref = createRef<HTMLInputElement>();
  render(<><span id="range-note">范围30至90</span><NumberInput ref={ref} id="threshold" label="演示阈值 / dB(A)" aria-describedby="range-note" hint="普通说明" error="请输入范围内的数值" defaultValue={95} /></>);
  const input = screen.getByRole("spinbutton", { name: "演示阈值 / dB(A)" });
  expect(ref.current).toBe(input);
  expect(input).toHaveAccessibleDescription("范围30至90 请输入范围内的数值");
  expect(input).toHaveAttribute("aria-invalid", "true");
  expect(screen.queryByText("普通说明")).not.toBeInTheDocument();
  ref.current?.focus();
  expect(input).toHaveFocus();
});

it("keeps disabled fields out of tab order and submission while readonly values remain available", async () => {
  const user = userEvent.setup();
  const changed = vi.fn();
  const view = render(<form><NumberInput label="禁用" name="disabled" defaultValue={4} disabled onChange={changed} /><NumberInput label="只读" name="readonly" value={1000} readOnly onChange={changed} /></form>);
  const disabled = screen.getByRole("spinbutton", { name: "禁用" });
  const readonly = screen.getByRole("spinbutton", { name: "只读" });
  await user.tab();
  expect(readonly).toHaveFocus();
  await user.type(disabled, "9");
  await user.type(readonly, "9");
  expect(disabled).toHaveValue(4);
  expect(readonly).toHaveValue(1000);
  expect(changed).not.toHaveBeenCalled();
  const values = new FormData(view.container.querySelector("form")!);
  expect(values.has("disabled")).toBe(false);
  expect(values.get("readonly")).toBe("1000");
});
