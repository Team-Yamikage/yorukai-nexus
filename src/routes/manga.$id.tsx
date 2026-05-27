import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { StubPage } from "@/components/StubPage";
export const Route = createFileRoute("/manga/$id")({
  head: () => ({ meta: [{ title: "Manga Detail — YORUKAI.TV" }] }),
  component: () => <AppShell><StubPage kicker="Series" title="Manga Detail" gradient="fire" copy="Cover, synopsis, chapter list, bookmark, reading progress." /></AppShell>,
});
