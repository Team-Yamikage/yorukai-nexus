import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { StubPage } from "@/components/StubPage";
export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — YORUKAI.TV" }] }),
  component: () => <AppShell><StubPage kicker="Preferences" title="Settings" gradient="cyber" copy="Playback, subtitles, language, accessibility, account." /></AppShell>,
});
