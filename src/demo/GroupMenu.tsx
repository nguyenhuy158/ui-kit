import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/Button";
import { cn } from "../ui/cn";
import { MENU, type Route } from "./menu";

const INDENT_BASE_REM = 0.75;
const INDENT_STEP_REM = 1.25;

type RowProps = {
  depth: number;
  label: string;
  current: boolean;
  expanded?: boolean;
  onClick: () => void;
};

function Row({ depth, label, current, expanded, onClick }: RowProps) {
  return (
    <Button
      variant={current ? "outline" : "ghost"}
      block
      className="justify-start gap-2"
      style={{ paddingLeft: `${INDENT_BASE_REM + depth * INDENT_STEP_REM}rem` }}
      aria-expanded={expanded}
      aria-current={current && expanded === undefined ? "page" : undefined}
      onClick={onClick}
    >
      {expanded !== undefined && (
        <ChevronRight
          size={16}
          className={cn(
            "shrink-0 transition-transform",
            expanded && "rotate-90",
          )}
        />
      )}
      {label}
    </Button>
  );
}

export function GroupMenu({
  route,
  onSelect,
}: {
  route: Route;
  onSelect: (group: string, anchor: string) => void;
}) {
  const [open, setOpen] = useState<ReadonlySet<string>>(new Set());

  const toggle = (key: string) =>
    setOpen((previous) => {
      const next = new Set(previous);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <nav aria-label="Nhóm component">
      <ul className="flex flex-col gap-1">
        {MENU.map((group) => (
          <li key={group.id}>
            <Row
              depth={0}
              label={group.label}
              current={route.group === group.id}
              expanded={open.has(group.id)}
              onClick={() => toggle(group.id)}
            />
            {open.has(group.id) && (
              <ul className="mt-1 flex flex-col gap-1">
                {group.sections.map((section) => (
                  <li key={section.id}>
                    {section.items ? (
                      <>
                        <Row
                          depth={1}
                          label={section.label}
                          current={false}
                          expanded={open.has(section.id)}
                          onClick={() => toggle(section.id)}
                        />
                        {open.has(section.id) && (
                          <ul className="mt-1 flex flex-col gap-1">
                            {section.items.map((item) => (
                              <li key={item.id}>
                                <Row
                                  depth={2}
                                  label={item.label}
                                  current={route.anchor === item.id}
                                  onClick={() => onSelect(group.id, item.id)}
                                />
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      <Row
                        depth={1}
                        label={section.label}
                        current={route.anchor === section.id}
                        onClick={() => onSelect(group.id, section.id)}
                      />
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
