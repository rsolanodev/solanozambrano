import Link from "next/link";
import { SquiggleDoodle } from "./CrayonDoodles";
import classes from "./BrandMark.module.css";

export function BrandMark() {
  return (
    <Link
      href="/"
      className={classes.brand}
      aria-label="Materna, ir al inicio"
    >
      <span className={classes.word}>materna</span>
      <SquiggleDoodle className={classes.curve} />
    </Link>
  );
}