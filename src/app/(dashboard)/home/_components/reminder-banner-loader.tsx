"use client";

import dynamic from "next/dynamic";

export const ReminderBanner = dynamic(
  () => import("./reminder-banner").then((mod) => mod.ReminderBanner),
  { ssr: false },
);
