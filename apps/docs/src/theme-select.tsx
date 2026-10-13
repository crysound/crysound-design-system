import { useId } from "react";
import * as Menu from "@radix-ui/react-dropdown-menu";

export function ThemeSelect({ label, value, onValueChange, options }: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  const id = useId();
  return <div className="theme-select-field">
    <span id={id}>{label}</span>
    <Menu.Root>
      <Menu.Trigger className="theme-select-trigger" aria-labelledby={id}>
        <span>{options.find(option => option.value === value)?.label}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Content className="theme-select-menu" sideOffset={8} align="start" collisionPadding={12}>
          <Menu.RadioGroup value={value} onValueChange={onValueChange} aria-label={label}>
            {options.map(option => <Menu.RadioItem key={option.value} value={option.value} className="theme-select-option">
              <span>{option.label}</span>
              <Menu.ItemIndicator aria-hidden="true">✓</Menu.ItemIndicator>
            </Menu.RadioItem>)}
          </Menu.RadioGroup>
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  </div>;
}
