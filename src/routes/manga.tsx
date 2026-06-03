import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/manga")({
  component: () => <Outlet />,
});
