import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createRoot, Root } from "react-dom/client";
import { useRef, useState } from "react";
import { act } from "react";
import { useFocusTrap } from "../useFocusTrap";

let container: HTMLDivElement;
let root: Root;

function getByTestId(id: string): HTMLElement {
  const el = container.querySelector(`[data-testid="${id}"]`);
  if (!el) throw new Error(`Element with data-testid="${id}" not found`);
  return el as HTMLElement;
}

// Component with always-rendered content (like mobile menu)
function AlwaysRenderedDialog({
  defaultOpen = false,
  onEscapeOverride,
  restoreFocus,
}: {
  defaultOpen?: boolean;
  onEscapeOverride?: () => void;
  restoreFocus?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const closeRef = useRef<HTMLButtonElement>(null);

  const { containerRef } = useFocusTrap({
    isOpen,
    onEscape: onEscapeOverride ?? (() => setIsOpen(false)),
    initialFocusRef: closeRef,
    restoreFocus,
  });

  return (
    <div>
      <button data-testid="trigger" onClick={() => setIsOpen(true)}>
        Open
      </button>
      <div ref={containerRef} data-testid="dialog">
        <button ref={closeRef} data-testid="close" onClick={() => setIsOpen(false)}>
          Close
        </button>
        <button data-testid="action">Action</button>
        <a href="#" data-testid="link">
          Link
        </a>
      </div>
    </div>
  );
}

// Component without initialFocusRef
function NoInitialFocusDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const { containerRef } = useFocusTrap({
    isOpen,
    onEscape: () => setIsOpen(false),
  });

  return (
    <div>
      <button data-testid="trigger" onClick={() => setIsOpen(true)}>
        Open
      </button>
      <div ref={containerRef} data-testid="dialog">
        {isOpen && (
          <>
            <button data-testid="first">First</button>
            <button data-testid="second">Second</button>
          </>
        )}
      </div>
    </div>
  );
}

// Component without onEscape
function NoEscapeDialog() {
  const [isOpen] = useState(true);
  const { containerRef } = useFocusTrap({ isOpen });

  return (
    <div ref={containerRef} data-testid="dialog">
      <button data-testid="btn">Close</button>
    </div>
  );
}

describe("useFocusTrap", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    vi.useRealTimers();
  });

  it("should focus initialFocusRef when isOpen becomes true", () => {
    act(() => {
      root.render(<AlwaysRenderedDialog />);
    });

    const trigger = getByTestId("trigger");
    trigger.focus();
    act(() => {
      trigger.click();
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(document.activeElement).toBe(getByTestId("close"));
  });

  it("should focus first focusable element when no initialFocusRef", () => {
    act(() => {
      root.render(<NoInitialFocusDialog />);
    });

    const trigger = getByTestId("trigger");
    trigger.focus();
    act(() => {
      trigger.click();
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(document.activeElement).toBe(getByTestId("first"));
  });

  it("should trap Tab at the last element (wrap to first)", () => {
    act(() => {
      root.render(<AlwaysRenderedDialog defaultOpen />);
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    const last = getByTestId("link");
    last.focus();
    expect(document.activeElement).toBe(last);

    // Press Tab — should wrap to first
    act(() => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true })
      );
    });

    expect(document.activeElement).toBe(getByTestId("close"));
  });

  it("should trap Shift+Tab at the first element (wrap to last)", () => {
    act(() => {
      root.render(<AlwaysRenderedDialog defaultOpen />);
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    const first = getByTestId("close");
    first.focus();
    expect(document.activeElement).toBe(first);

    // Press Shift+Tab — should wrap to last
    act(() => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Tab",
          shiftKey: true,
          bubbles: true,
          cancelable: true,
        })
      );
    });

    expect(document.activeElement).toBe(getByTestId("link"));
  });

  it("should call onEscape when Escape is pressed", () => {
    const onEscape = vi.fn();

    act(() => {
      root.render(<AlwaysRenderedDialog defaultOpen onEscapeOverride={onEscape} />);
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true })
      );
    });

    expect(onEscape).toHaveBeenCalledTimes(1);
  });

  it("should not throw when Escape is pressed without onEscape", () => {
    act(() => {
      root.render(<NoEscapeDialog />);
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Should not throw
    act(() => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true })
      );
    });

    expect(getByTestId("dialog")).toBeTruthy();
  });

  it("should restore focus to trigger element on close", () => {
    act(() => {
      root.render(<AlwaysRenderedDialog />);
    });

    const trigger = getByTestId("trigger");
    trigger.focus();
    act(() => {
      trigger.click();
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(document.activeElement).toBe(getByTestId("close"));

    // Close via Escape
    act(() => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true })
      );
    });

    expect(document.activeElement).toBe(trigger);
  });

  it("should not restore focus when restoreFocus is false", () => {
    act(() => {
      root.render(<AlwaysRenderedDialog restoreFocus={false} />);
    });

    const trigger = getByTestId("trigger");
    trigger.focus();
    act(() => {
      trigger.click();
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Close via Escape
    act(() => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true })
      );
    });

    expect(document.activeElement).not.toBe(trigger);
  });

  it("should not trap focus when isOpen is false", () => {
    act(() => {
      root.render(<AlwaysRenderedDialog />);
    });

    // Focus a button inside the container while closed
    const close = getByTestId("close");
    close.focus();

    // Tab should NOT be intercepted (no preventDefault)
    const event = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
    });
    const prevented = !document.dispatchEvent(event);
    expect(prevented).toBe(false);
  });
});
