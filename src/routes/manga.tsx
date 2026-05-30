import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { StubPage } from "@/components/StubPage";
export const Route = createFileRoute("/manga")({
  head: () => ({ meta: [{ title: "Manga — YORUKAI.TV" }] }),
  component: () => <AppShell><StubPage kicker="Manga library" title="Manga" gradient="violet" copy="Browse, trending, latest chapters, reading lists." /></AppShell>,
});
