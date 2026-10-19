import { describe, it, expect } from "vitest";
import tokens from "../packages/tokens/src/tokens.json";
describe("theme export cascade", () => {
  it("retains base dark colors when extension tokens share the same selector", () => {
    const dark = tokens.modes['[data-theme="dark"]'];
    expect(dark.brand.$value).toBe("#f5f5f5");
    expect(dark["brand-subtle"].$value).toBe("#303030");
    expect(dark.text.$value).toBe("#e5e5e5");
  });
  it("retains customer foregrounds alongside surface extensions", () => {
    const ocean = tokens.modes['[data-customer="ocean"]'];
    expect(ocean.brand.$value).toBe("#1857b6");
    expect(ocean["on-brand"].$value).toBe("#fff");
    expect(ocean["brand-subtle"].$value).toBe("#edf3ff");
  });
});
