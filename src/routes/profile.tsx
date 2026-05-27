import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { StubPage } from "@/components/StubPage";
export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — YORUKAI.TV" }] }),
  component: () => <AppShell><StubPage kicker="You" title="Profile" gradient="violet" copy="Avatar, level, XP, badges, watch stats, premium status." /></AppShell>,
});
