import React from "react";
import { afterEach, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { Avatar, AvatarGroup } from "../packages/ui/src/index";

afterEach(cleanup);

it("uses a single uppercase or Unicode initial, supports explicit initials, and names empty identities", () => {
  render(<><Avatar name=" alice chen " /><Avatar name="𠮷野" /><Avatar name="陈言" initials="cy" /><Avatar name=" " /></>);
  expect(screen.getByRole("img", { name: "alice chen" })).toHaveTextContent("A");
  expect(screen.getByRole("img", { name: "𠮷野" })).toHaveTextContent("𠮷");
  expect(screen.getByRole("img", { name: "陈言" })).toHaveTextContent("CY");
  expect(screen.getByRole("img", { name: "未知用户" })).toHaveTextContent("?");
});

it("retains the fallback while an image loads and after it fails", () => {
  const { container } = render(<Avatar name="林晨" src="/user.png" />);
  const image = container.querySelector("img")!;
  expect(image).toHaveAttribute("alt", "");
  expect(screen.getByRole("img", { name: "林晨" })).toHaveTextContent("林");
  expect(container.querySelector(".cs-avatar-face")).toHaveAttribute("data-state", "pending");
  fireEvent.load(image);
  expect(container.querySelector(".cs-avatar-face")).toHaveAttribute("data-state", "loaded");
  fireEvent.error(image);
  expect(container.querySelector("img")).toBeNull();
  expect(screen.getByRole("img", { name: "林晨" })).toHaveTextContent("林");
});

it("resets each source and isolates events from the previous image", () => {
  const { container, rerender } = render(<Avatar name="林晨" src="/old.png" />);
  const old = container.querySelector("img")!;
  fireEvent.error(old);
  rerender(<Avatar name="林晨" src="/new.png" />);
  const next = container.querySelector("img")!;
  expect(next).toHaveAttribute("src", "/new.png");
  fireEvent.load(next);
  fireEvent.error(old);
  expect(container.querySelector(".cs-avatar-face")).toHaveAttribute("data-state", "loaded");
  rerender(<Avatar name="林晨" src="/old.png" />);
  expect(container.querySelector("img")).toHaveAttribute("src", "/old.png");
  expect(container.querySelector(".cs-avatar-face")).toHaveAttribute("data-state", "pending");
});

it("uses the company mark as a logo fallback and exposes presence without extra image announcements", () => {
  const { container, rerender } = render(<Avatar name="CRYSOUND" variant="logo" shape="rounded" status="online" className="company" />);
  expect(screen.getByRole("img", { name: "CRYSOUND，在线" })).toHaveClass("company");
  expect(container.querySelector(".cs-avatar-logo")).toHaveAttribute("aria-hidden", "true");
  expect(container.querySelector('[data-part="center"]')).not.toBeNull();
  expect(container.querySelector(".cs-avatar-status")).toHaveAttribute("data-status", "online");
  expect(screen.getAllByRole("img")).toHaveLength(1);
  rerender(<Avatar name="CRYSOUND" variant="logo" src="/company.png" status="away" statusLabel="暂时离开" />);
  fireEvent.error(container.querySelector("img")!);
  expect(screen.getByRole("img", { name: "CRYSOUND，暂时离开" })).toBeInTheDocument();
  expect(container.querySelector(".cs-avatar-logo")).not.toBeNull();
});

it("keeps an explicit loading state until the caller finishes, even when the image is ready", () => {
  const { container, rerender } = render(<Avatar name="林晨" src="/user.png" loading />);
  expect(screen.getByRole("img", { name: "林晨，头像加载中" })).toHaveAttribute("aria-busy", "true");
  fireEvent.load(container.querySelector("img")!);
  expect(container.querySelector(".cs-avatar-face")).toHaveAttribute("data-state", "loading");
  rerender(<Avatar name="林晨" src="/user.png" />);
  expect(container.querySelector(".cs-avatar-face")).toHaveAttribute("data-state", "loaded");
  expect(screen.getByRole("img", { name: "林晨" })).not.toHaveAttribute("aria-busy");
});

it("normalizes group sizes and reports the actual number of hidden members", () => {
  const { rerender } = render(<AvatarGroup label="测量团队" size="sm" max={2}><Avatar name="林晨" size="lg" /><Avatar name="周宁" /><Avatar name="李娜" /></AvatarGroup>);
  const group = screen.getByRole("group", { name: "测量团队" });
  expect(within(group).getByRole("img", { name: "林晨" })).toHaveClass("cs-avatar--sm");
  expect(within(group).queryByRole("img", { name: "李娜" })).toBeNull();
  expect(within(group).getByRole("img", { name: "另有 1 位成员" })).toHaveTextContent("+1");
  rerender(<AvatarGroup max={0}><Avatar name="林晨" /><Avatar name="周宁" /></AvatarGroup>);
  expect(screen.getByRole("img", { name: "林晨" })).toBeInTheDocument();
  expect(screen.getByRole("img", { name: "另有 1 位成员" })).toBeInTheDocument();
  rerender(<AvatarGroup max={1}>{Array.from({ length: 102 }, (_, i) => <Avatar key={i} name={`成员 ${i}`} />)}</AvatarGroup>);
  expect(screen.getByRole("img", { name: "另有 101 位成员" })).toHaveTextContent("99+");
  rerender(<AvatarGroup>{[]}</AvatarGroup>);
  expect(screen.getByText("暂无成员")).toBeInTheDocument();
  expect(screen.queryAllByRole("img")).toHaveLength(0);
});
