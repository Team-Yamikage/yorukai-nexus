import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { StubPage } from "@/components/StubPage";
export const Route = createFileRoute("/genres")({
  head: () => ({ meta: [{ title: "Genres — YORUKAI.TV" }] }),
  component: () => <AppShell><StubPage kicker="Mood index" title="Genres" gradient="violet" copy="Browse by Action, Sci-Fi, Romance, Mecha, Horror, Slice — neon gradients per mood." /></AppShell>,
});
