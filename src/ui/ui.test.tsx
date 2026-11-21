import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { AnimatedList } from "./AnimatedList";
import { cn } from "./cn";
import { Popover } from "./Popover";
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
