"use client";
import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import * as T from "@radix-ui/react-toast";
import { Button } from "./index";
export interface ToastMessage {
  title: string;
  description?: string;
  duration?: number;
  action?: { label: string; altText: string; onClick: () => void };
}
const ToastContext = createContext<((message: ToastMessage) => void) | null>(
  null,
);
export function ToastProvider({ children }: { children: ReactNode }) {
  const nextId = useRef(0);
  const [messages, setMessages] = useState<(ToastMessage & { id: number })[]>(
    [],
  );
  return (
    <ToastContext.Provider
      value={(message) => {
        const id = nextId.current++;
        setMessages((current) => [...current.slice(-4), { ...message, id }]);
      }}
    >
      <T.Provider swipeDirection="right">
        {children}
        {messages.map((message) => (
          <T.Root
            key={message.id}
            className="cs-toast"
            duration={message.duration ?? 5000}
            onOpenChange={(open) => {
              if (!open)
                setMessages((current) =>
                  current.filter((m) => m.id !== message.id),
                );
            }}
          >
            <div>
              <T.Title className="cs-label">{message.title}</T.Title>
              {message.description && (
                <T.Description className="cs-help">
                  {message.description}
                </T.Description>
              )}
            </div>
            {message.action && (
              <T.Action altText={message.action.altText} asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={message.action.onClick}
                >
                  {message.action.label}
                </Button>
              </T.Action>
            )}
            <T.Close asChild>
              <Button variant="ghost" size="sm" aria-label="关闭通知">
                ×
              </Button>
            </T.Close>
          </T.Root>
        ))}
        <T.Viewport className="cs-toast-viewport" label="通知（F8）" />
      </T.Provider>
    </ToastContext.Provider>
  );
}
export function useToast() {
  const toast = useContext(ToastContext);
  if (!toast) throw new Error("useToast 必须位于 ToastProvider 中");
  return toast;
}
