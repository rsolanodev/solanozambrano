import type { ReactNode } from "react";
import { UnderlineDoodle } from "./CrayonDoodles";
import classes from "./Marker.module.css";

export function Marker({ children }: { children: ReactNode }) {
  return (
    <span className={classes.marker}>
      {children}
      <UnderlineDoodle className={classes.stroke} />
    </span>
  );
}