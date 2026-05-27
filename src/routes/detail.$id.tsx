import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { StubPage } from "@/components/StubPage";

export const Route = createFileRoute("/detail/$id")({
  head: () => ({ meta: [{ title: "Detail — YORUKAI.TV" }, { name: "description", content: "Series detail." }] }),
  component: () => <AppShell><StubPage kicker="Series page" title="Detail" gradient="fire" copy="Hero, synopsis, season picker, episode list, related works, comments." /></AppShell>,
});
