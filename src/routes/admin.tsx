import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { StubPage } from "@/components/StubPage";
export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — YORUKAI.TV" }] }),
  component: () => <AppShell><StubPage kicker="こんにちは admin" title="Konnichiwa" gradient="fire" copy="Cyberpunk control center — KPIs, DAU charts, moderation, CDN & server health, reports. Builds next pass." /></AppShell>,
});
