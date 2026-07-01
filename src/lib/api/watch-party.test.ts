import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

describe("watch-party authorization migration", () => {
  const migration = readdirSync("supabase/migrations").find((name) =>
    name.startsWith("20260701012807_"),
  );
  const sql = readFileSync(join("supabase/migrations", migration!), "utf8");

  it("gates messages and events through can_access_watch_party", () => {
    expect(sql).toContain("CREATE OR REPLACE FUNCTION public.can_access_watch_party");
    expect(sql).toContain("Authorized users can send party messages");
    expect(sql).toContain("public.can_access_watch_party(party_id, auth.uid())");
    expect(sql).toContain("CREATE TABLE IF NOT EXISTS public.watch_party_events");
  });
});