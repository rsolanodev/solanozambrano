import {
  LoopDoodle,
  SparkleDoodle,
  SquiggleDoodle,
  SunDoodle,
  ZigzagDoodle,
} from "./CrayonDoodles";
import classes from "./PageDoodles.module.css";

type DoodleVariant = "home" | "app" | "animals" | "credits";

export function PageDoodles({ variant = "home" }: { variant?: DoodleVariant }) {
  return (
    <div
      className={`${classes.field} ${classes[variant]}`}
      aria-hidden="true"
    >
      <SquiggleDoodle className={`${classes.doodle} ${classes.squiggle}`} />
      <SunDoodle className={`${classes.doodle} ${classes.sun}`} />
      <SparkleDoodle className={`${classes.doodle} ${classes.sparkle}`} />
      <LoopDoodle className={`${classes.doodle} ${classes.loop}`} />
      <ZigzagDoodle className={`${classes.doodle} ${classes.zigzag}`} />
    </div>
  );
}