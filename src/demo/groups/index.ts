import type { ComponentType } from "react";
import { BasicsGroup } from "./basics";
import { DataGroup } from "./data";
import { FeedbackGroup } from "./feedback";
import { FormGroup } from "./form";
import { InteractGroup } from "./interact";
import { NavGroup } from "./nav";
import type { GroupProps } from "./types";

export const GROUP_VIEWS: Record<string, ComponentType<GroupProps>> = {
  basics: BasicsGroup,
  form: FormGroup,
  data: DataGroup,
  nav: NavGroup,
  feedback: FeedbackGroup,
  interact: InteractGroup,
};
