import { type ComponentType, lazy } from "react";
import type { GroupProps } from "./types";

export const GROUP_VIEWS: Record<string, ComponentType<GroupProps>> = {
  basics: lazy(() =>
    import("./basics").then((m) => ({ default: m.BasicsGroup })),
  ),
  form: lazy(() => import("./form").then((m) => ({ default: m.FormGroup }))),
  data: lazy(() => import("./data").then((m) => ({ default: m.DataGroup }))),
  nav: lazy(() => import("./nav").then((m) => ({ default: m.NavGroup }))),
  feedback: lazy(() =>
    import("./feedback").then((m) => ({ default: m.FeedbackGroup })),
  ),
  extras: lazy(() =>
    import("./extras").then((m) => ({ default: m.ExtrasGroup })),
  ),
  interact: lazy(() =>
    import("./interact").then((m) => ({ default: m.InteractGroup })),
  ),
};
