import React, { useState } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Rating } from "../packages/ui/src/index";

afterEach(cleanup);
const filled = (group: HTMLElement) => group.querySelectorAll('[data-filled="true"]').length;

it("previews hovered stars without committing and restores the selected score on pointer leave", async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  render(<Rating label="体验评分" defaultValue={2} onValueChange={change} />);
  const group = screen.getByRole("radiogroup", { name: "体验评分" });
  const fifth = within(group).getByRole("radio", { name: "5 星，共 5 星" });
  await user.hover(fifth);
  expect(filled(group)).toBe(5);
  expect(within(group).getByRole("radio", { name: "2 星，共 5 星" })).toBeChecked();
  expect(change).not.toHaveBeenCalled();
  await user.unhover(fifth);
  expect(filled(group)).toBe(2);
  await user.click(within(group).getByRole("radio", { name: "4 星，共 5 星" }));
  expect(change).toHaveBeenCalledExactlyOnceWith(4);
  expect(filled(group)).toBe(4);
  expect(within(group).getByRole("radio", { name: "4 星，共 5 星" })).toBeChecked();
});

it("supports one tab stop, arrow-key selection and RTL navigation", async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const view = render(<><Rating label="评分" defaultValue={2} onValueChange={change} /><button>下一项</button></>);
  await user.tab();
  expect(screen.getByRole("radio", { name: "2 星，共 5 星" })).toHaveFocus();
  await user.keyboard("{ArrowRight>}");
  await waitFor(() => expect(screen.getByRole("radio", { name: "3 星，共 5 星" })).toBeChecked());
  await user.keyboard("{/ArrowRight}");
  expect(change).toHaveBeenLastCalledWith(3);
  await user.tab();
  expect(screen.getByRole("button", { name: "下一项" })).toHaveFocus();
  view.rerender(<><Rating label="评分" defaultValue={2} dir="rtl" /><button>下一项</button></>);
  screen.getByRole("radio", { name: "3 星，共 5 星" }).focus();
  await user.keyboard("{ArrowLeft>}");
  await waitFor(() => expect(screen.getByRole("radio", { name: "4 星，共 5 星" })).toBeChecked());
  await user.keyboard("{/ArrowLeft}");
});

it("preserves parent control and can be reset to an unrated value", async () => {
  const user = userEvent.setup();
  function Example() {
    const [score, setScore] = useState(2);
    return <><Rating label="受控评分" value={score} onValueChange={setScore} /><button onClick={() => setScore(0)}>清空</button></>;
  }
  const view = render(<Example />);
  await user.click(screen.getByRole("radio", { name: "5 星，共 5 星" }));
  expect(screen.getByRole("radio", { name: "5 星，共 5 星" })).toBeChecked();
  await user.click(screen.getByRole("button", { name: "清空" }));
  expect(screen.queryByRole("radio", { checked: true })).not.toBeInTheDocument();
  expect(filled(screen.getByRole("radiogroup"))).toBe(0);
  const change = vi.fn();
  view.rerender(<Rating label="固定评分" value={2} onValueChange={change} />);
  await user.click(screen.getByRole("radio", { name: "4 星，共 5 星" }));
  expect(change).toHaveBeenCalledWith(4);
  expect(screen.getByRole("radio", { name: "2 星，共 5 星" })).toBeChecked();
  expect(filled(screen.getByRole("radiogroup"))).toBe(2);
});

it("participates in native form validation, submission and reset", async () => {
  const user = userEvent.setup();
  const view = render(<form><Rating label="必选评分" name="score" required /><button type="reset">重置</button></form>);
  const form = view.container.querySelector("form")!;
  expect(form.checkValidity()).toBe(false);
  expect(new FormData(form).has("score")).toBe(false);
  await user.click(screen.getByRole("radio", { name: "3 星，共 5 星" }));
  expect(form.checkValidity()).toBe(true);
  expect(new FormData(form).get("score")).toBe("3");
  await user.click(screen.getByRole("button", { name: "重置" }));
  await waitFor(() => expect(screen.queryByRole("radio", { checked: true })).not.toBeInTheDocument());
  expect(filled(screen.getByRole("radiogroup"))).toBe(0);
  expect(form.checkValidity()).toBe(false);
});

it("makes read-only ratings descriptive and prevents disabled ratings from changing or receiving focus", async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const view = render(<form><Rating label="历史评分" value={4} name="history" readOnly onValueChange={change} /><Rating label="禁用评分" defaultValue={2} name="disabled" disabled onValueChange={change} /><button>下一项</button></form>);
  expect(screen.getByRole("img", { name: "历史评分：4 星，共 5 星" })).toBeInTheDocument();
  const group = screen.getByRole("radiogroup", { name: "禁用评分" });
  for (const radio of within(group).getAllByRole("radio")) expect(radio).toBeDisabled();
  await user.hover(within(group).getByRole("radio", { name: "5 星，共 5 星" }));
  await user.click(within(group).getByRole("radio", { name: "5 星，共 5 星" }));
  expect(filled(group)).toBe(2);
  expect(change).not.toHaveBeenCalled();
  await user.tab();
  expect(screen.getByRole("button", { name: "下一项" })).toHaveFocus();
  const data = new FormData(view.container.querySelector("form")!);
  expect(data.get("history")).toBe("4");
  expect(data.has("disabled")).toBe(false);
});

it("associates validation text and supports a custom integer scale and accessible labels", () => {
  render(<><span id="context">产品体验</span><Rating label="推荐指数" max={7} value={6} hideLabel error="请确认评分" hint="普通说明" aria-describedby="context" getValueLabel={(score, max) => `${score} / ${max}`} /></>);
  const group = screen.getByRole("radiogroup", { name: "推荐指数" });
  expect(within(group).getAllByRole("radio")).toHaveLength(7);
  expect(within(group).getByRole("radio", { name: "6 / 7" })).toBeChecked();
  expect(group).toHaveAccessibleDescription("产品体验 请确认评分");
  expect(group).toHaveAttribute("aria-invalid", "true");
  expect(screen.queryByText("普通说明")).not.toBeInTheDocument();
});

it('preserves an opt-in read-only fractional value in its accessible name and form data', () => {
  const {container} = render(<form><Rating label="Average" value={4.75} precision="fractional" readOnly name="average" /></form>);
  const image = screen.getByRole('img', {name:'Average：4.75 星，共 5 星'});
  expect(filled(image)).toBe(4);
  expect(image.querySelector('.cs-rating-fill')).toHaveStyle({width:'75%'});
  expect(new FormData(container.querySelector('form')!).get('average')).toBe('4.75');
  expect(screen.queryByRole('radio')).not.toBeInTheDocument();
});

it('keeps integer keyboard input when fractional precision is requested on an interactive rating', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  render(<Rating label="Input" defaultValue={2.6} precision="fractional" onValueChange={change} />);
  const third = screen.getByRole('radio', {name:'3 星，共 5 星'});
  expect(third).toBeChecked();
  third.focus();
  await user.keyboard('{ArrowRight>}');
  await waitFor(() => expect(change).toHaveBeenLastCalledWith(4));
  await user.keyboard('{/ArrowRight}');
  expect(screen.getByRole('radio', {name:'4 星，共 5 星'})).toBeChecked();
});
