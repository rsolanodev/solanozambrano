"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@mantine/core";
import { ChevronLeftIcon } from "@/app/alaia/icons";
import classes from "./BackButton.module.css";

type BackButtonProps = {
  href: string;
  label: string;
  children?: ReactNode;
};

export function BackButton({
  href,
  label,
  children = "Volver",
}: BackButtonProps) {
  return (
    <Button
      component={Link}
      href={href}
      aria-label={label}
      leftSection={<ChevronLeftIcon size={18} />}
      className={classes.back}
    >
      {children}
    </Button>
  );
}