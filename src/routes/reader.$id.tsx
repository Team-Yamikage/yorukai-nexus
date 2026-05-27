import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { StubPage } from "@/components/StubPage";
export const Route = createFileRoute("/reader/$id")({
  head: () => ({ meta: [{ title: "Reader — YORUKAI.TV" }] }),
  component: () => <AppShell><StubPage kicker="Manga reader" title="Reader" gradient="cyber" copy="Vertical & horizontal modes, smooth preload, bookmarks, gestures." /></AppShell>,
});
