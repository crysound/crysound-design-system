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
  expect(screen.getByRole("button", { name: "增加禁用" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "减少只读" })).toBeDisabled();
});

it("steps a controlled decimal field through onChange once per click and keeps input focus", async () => {
  const user = userEvent.setup();
  const changed = vi.fn();
  function Example() {
    const [draft, setDraft] = useState("0.2");
    return <form onSubmit={event => { event.preventDefault(); throw new Error("Stepper submitted the form"); }}>
      <NumberInput label="增益" value={draft} step={0.1} onChange={event => {
        changed(event.target.valueAsNumber);
        setDraft(event.target.value);
      }} />
      <button>保存</button>
    </form>;
  }
  render(<Example />);
  const input = screen.getByRole("spinbutton", { name: "增益" });
  await user.click(screen.getByRole("button", { name: "增加增益" }));
  expect(input).toHaveValue(0.3);
  expect(input).toHaveFocus();
  expect(changed).toHaveBeenCalledExactlyOnceWith(0.3);
  await user.click(screen.getByRole("button", { name: "减少增益" }));
  expect(input).toHaveValue(0.2);
  expect(changed).toHaveBeenCalledTimes(2);
  expect(changed).toHaveBeenLastCalledWith(0.2);
  await user.tab();
  expect(screen.getByRole("button", { name: "保存" })).toHaveFocus();
});

it("uses native bounds, step alignment and empty-value stepping without emitting no-op changes", async () => {
  const user = userEvent.setup();
  const changed = vi.fn();
  render(<NumberInput label="范围" min={-0.5} max={0.5} step={0.5} defaultValue={0} onChange={changed} />);
  const input = screen.getByRole("spinbutton", { name: "范围" });
  const increase = screen.getByRole("button", { name: "增加范围" });
  const decrease = screen.getByRole("button", { name: "减少范围" });
  await user.click(increase);
  expect(input).toHaveValue(0.5);
  await user.click(increase);
  expect(input).toHaveValue(0.5);
  expect(changed).toHaveBeenCalledTimes(1);
  await user.click(decrease);
  await user.click(decrease);
  await user.click(decrease);
  expect(input).toHaveValue(-0.5);
  expect(changed).toHaveBeenCalledTimes(3);
  await user.clear(input);
  await user.click(increase);
  expect(input).toHaveValue(0.5);
  fireEvent.change(input, { target: { value: "0.2" } });
  await user.click(decrease);
  expect(input).toHaveValue(0);
});

it("leaves the value unchanged when a controlled parent rejects a step", async () => {
  const user = userEvent.setup();
  const changed = vi.fn();
  render(<NumberInput label="锁定值" value={4} onChange={changed} />);
  await user.click(screen.getByRole("button", { name: "增加锁定值" }));
  expect(changed).toHaveBeenCalledOnce();
  expect(screen.getByRole("spinbutton", { name: "锁定值" })).toHaveValue(4);
});

it("allows arbitrary decimals without unusable step controls for step=any", async () => {
  const user = userEvent.setup();
  render(<NumberInput label="自由小数" step="any" />);
  const input = screen.getByRole("spinbutton", { name: "自由小数" }) as HTMLInputElement;
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
  await user.type(input, "0.12345");
  expect(input).toHaveValue(0.12345);
  expect(input.validity.stepMismatch).toBe(false);
});
