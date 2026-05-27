import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { StubPage } from "@/components/StubPage";
export const Route = createFileRoute("/library")({
  head: () => ({ meta: [{ title: "Library — YORUKAI.TV" }] }),
  component: () => <AppShell><StubPage kicker="Your shelves" title="Library" gradient="fire" copy="Continue watching, watchlist, finished, favorites, history." /></AppShell>,
});
