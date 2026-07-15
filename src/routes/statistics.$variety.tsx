import { createFileRoute, redirect } from "@tanstack/react-router";

// Legacy detail route — new statistics screen holds all state at /statistics.
export const Route = createFileRoute("/statistics/$variety")({
  beforeLoad: () => {
    throw redirect({ to: "/statistics" });
  },
  component: () => null,
});
