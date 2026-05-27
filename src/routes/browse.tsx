import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { StubPage } from "@/components/StubPage";

export const Route = createFileRoute("/browse")({
  head: () => ({ meta: [{ title: "Browse — YORUKAI.TV" }, { name: "description", content: "Browse anime, movies, and series." }] }),
  component: () => <AppShell><StubPage kicker="Discover" title="Browse" gradient="cyber" copy="Filter by genre, year, studio, rating. The full catalog of YORUKAI lives here." /></AppShell>,
});
