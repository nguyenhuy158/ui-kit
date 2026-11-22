import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { AnimatedList } from "./AnimatedList";
import { CodeInput, type CodeInputProps, normalizeCode } from "./CodeInput";
import { cn } from "./cn";
import { ERROR_PAGE_STATUSES, ErrorPage } from "./ErrorPage";
import { Field } from "./Field";
import { PagedList } from "./PagedList";
import { Popover } from "./Popover";
import { PageLoading } from "./states";
import { type ToastPosition, ToastProvider, useToast } from "./Toast";
import { Tooltip } from "./Tooltip";

describe("cn", () => {
  it("drops falsy values", () => {
    expect(cn("a", false, null, undefined, 0, "", "b")).toBe("a b");
  });
});

describe("Popover", () => {
  it("opens on click and closes on Escape", async () => {
    const user = userEvent.setup();
    render(
      <Popover
        trigger={(props) => (
          <button type="button" {...props}>
            Mở
          </button>
        )}
      >
        Nội dung
      </Popover>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Mở" }));
    expect(await screen.findByRole("dialog")).toHaveTextContent("Nội dung");
    await user.keyboard("{Escape}");
    expect(screen.getByRole("button", { name: "Mở" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
});

describe("Tooltip", () => {
  it("shows on focus and links the hint to the trigger", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip label="Gợi ý">
        <button type="button">Nút</button>
      </Tooltip>,
    );
    await user.tab();
    const tip = await screen.findByRole("tooltip");
    expect(tip).toHaveTextContent("Gợi ý");
    expect(
      screen.getByRole("button", { name: "Nút" }).parentElement,
    ).toHaveAttribute("aria-describedby", tip.id);
  });
});

describe("AnimatedList", () => {
  it("renders its children inside the chosen tag", () => {
    render(
      <AnimatedList as="ul">
        <li>Một</li>
        <li>Hai</li>
      </AnimatedList>,
    );
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });
});

describe("PagedList", () => {
  it("preserves keyed rows and its animation container across list updates", () => {
    const props = {
      getKey: (item: string) => item,
      renderItem: (item: string) => <span>{item}</span>,
      rowHeight: 48,
      empty: <span>Trống</span>,
    };
    const { rerender } = render(<PagedList {...props} items={[]} />);
    const container = screen.getByText("Trống").parentElement;
    rerender(<PagedList {...props} items={["Một", "Hai"]} />);
    const firstRow = screen.getByText("Một").parentElement;
    expect(firstRow?.parentElement).toBe(container);
    rerender(<PagedList {...props} items={["Hai", "Một", "Ba"]} />);
    expect(screen.getByText("Một").parentElement).toBe(firstRow);
    expect(container?.textContent).toBe("HaiMộtBa");
    rerender(<PagedList {...props} items={[]} />);
    expect(screen.getByText("Trống").parentElement).toBe(container);
  });
});

describe("PageLoading", () => {
  it("announces the default and a custom label as a status", () => {
    const { rerender } = render(<PageLoading />);
    expect(
      screen.getByRole("status", { name: "Đang tải..." }),
    ).toBeInTheDocument();
    rerender(<PageLoading label="Đang mở" />);
    expect(screen.getByRole("status", { name: "Đang mở" })).toBeInTheDocument();
  });
});

describe("ErrorPage", () => {
  it.each(ERROR_PAGE_STATUSES)(
    "shows the code and a message for %i",
    (status) => {
      render(<ErrorPage status={status} />);
      expect(screen.getByRole("alert")).toHaveTextContent(String(status));
      expect(screen.getByRole("heading")).not.toBeEmptyDOMElement();
    },
  );

  it("uses a custom title and action", () => {
    render(
      <ErrorPage
        status={404}
        title="Hết rồi"
        action={<button type="button">Về</button>}
      />,
    );
    expect(
      screen.getByRole("heading", { name: "Hết rồi" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Về" })).toBeInTheDocument();
  });
});

function ShowToast() {
  const toast = useToast();
  return (
    <button type="button" onClick={() => toast.success("Đã lưu")}>
      show
    </button>
  );
}

describe("ToastProvider position", () => {
  const stackAt = async (position?: ToastPosition) => {
    render(
      <ToastProvider position={position}>
        <ShowToast />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByText("show"));
    return screen.getByRole("region", { name: "Thông báo" });
  };

  it("defaults to bottom-end", async () => {
    const stack = await stackAt();
    expect(stack.className).toContain("bottom-0");
    expect(stack.className).toContain("sm:items-end");
  });

  it("places the stack at the top", async () => {
    const stack = await stackAt("top-end");
    expect(stack.className).toContain("top-0");
    expect(stack.className).not.toContain("bottom-0");
  });
});

describe("CodeInput", () => {
  function Harness({
    initial = "",
    ...props
  }: { initial?: string } & Partial<
    Omit<CodeInputProps, "value" | "onChange">
  >) {
    const [value, setValue] = useState(initial);
    return (
      <>
        <Field label="Mã trên máy">
          <CodeInput value={value} onChange={setValue} {...props} />
        </Field>
        <output data-testid="value">{value}</output>
      </>
    );
  }

  it("is labelled by its Field and keeps the typed code upper case", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const input = screen.getByLabelText("Mã trên máy");
    await user.type(input, "abcd2345");
    expect(screen.getByTestId("value").textContent).toBe("ABCD2345");
    expect((input as HTMLInputElement).value).toBe("ABCD2345");
  });

  it("draws one box per character with a dash between groups", async () => {
    const user = userEvent.setup();
    const { container } = render(<Harness />);
    await user.type(screen.getByLabelText("Mã trên máy"), "abcd2345");
    expect(container.textContent).toContain("ABCD-2345");
    expect(container.querySelectorAll("span[aria-hidden='true']")).toHaveLength(
      9,
    );
  });

  it("takes a pasted code with or without the dash, in any case", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const input = screen.getByLabelText("Mã trên máy");
    await user.click(input);
    await user.paste("abcd-2345");
    expect(screen.getByTestId("value").textContent).toBe("ABCD2345");
    await user.clear(input);
    await user.paste(" wx yz 98!76 extra");
    expect(screen.getByTestId("value").textContent).toBe("WXYZ9876");
  });

  it("supports another length, group size and character set", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Harness length={6} groupSize={3} allowed={/[0-9]/} />,
    );
    await user.type(screen.getByLabelText("Mã trên máy"), "12a3456789");
    expect(screen.getByTestId("value").textContent).toBe("123456");
    expect(container.textContent).toContain("123-456");
  });

  it("marks itself invalid and can be disabled", () => {
    render(
      <CodeInput
        value="AB"
        onChange={() => {}}
        invalid
        disabled
        aria-label="Mã"
      />,
    );
    const input = screen.getByLabelText("Mã") as HTMLInputElement;
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.disabled).toBe(true);
  });

  it("turns invalid and reads the message when its Field has an error", () => {
    render(
      <Field label="Mã trên máy" error="Mã không đúng">
        <CodeInput value="AB" onChange={() => {}} />
      </Field>,
    );
    const input = screen.getByLabelText("Mã trên máy");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")).toBeTruthy();
  });

  it("asks the phone for a one-time code and forwards focus events", async () => {
    const user = userEvent.setup();
    const events: string[] = [];
    render(
      <Harness
        onFocus={() => events.push("focus")}
        onBlur={() => events.push("blur")}
      />,
    );
    const input = screen.getByLabelText("Mã trên máy");
    expect(input.getAttribute("autocomplete")).toBe("one-time-code");
    expect(input.getAttribute("autocapitalize")).toBe("characters");
    await user.click(input);
    await user.tab();
    expect(events).toEqual(["focus", "blur"]);
  });

  it("normalizeCode strips, upper-cases and trims to the length", () => {
    expect(normalizeCode("ab-cd 23 45xyz")).toBe("ABCD2345");
    expect(normalizeCode("12-34", 3, /[0-9]/)).toBe("123");
  });
});
