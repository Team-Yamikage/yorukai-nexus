import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { StubPage } from "@/components/StubPage";

export const Route = createFileRoute("/search")({
  head: () => ({ meta: [{ title: "Search — YORUKAI.TV" }, { name: "description", content: "Search anime, manga, channels." }] }),
  component: () => <AppShell><StubPage kicker="Find anything" title="Search" gradient="cyber" copy="AI-powered fuzzy search across anime, manga, channels, and characters." /></AppShell>,
});
