import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider, q as queryOptions } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { S as notFound } from "../_libs/tanstack__router-core.mjs";
import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-CSmeRDtX.mjs";
import { c as createServerFn, T as TSS_SERVER_FUNCTION, g as getServerFnById } from "./server-DKFzjMa8.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
const appCss = "/assets/styles-CO6K2Q97.css";
const AuthCtx = reactExports.createContext({ user: null, session: null, loading: true, isAdmin: false, signOut: async () => {
} });
function AuthProvider({ children }) {
  const [session, setSession] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [isAdmin, setIsAdmin] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  reactExports.useEffect(() => {
    const uid = session?.user?.id;
    if (!uid) {
      setIsAdmin(false);
      return;
    }
    let active = true;
    supabase.from("user_roles").select("role").eq("user_id", uid).eq("role", "admin").maybeSingle().then(({ data }) => {
      if (active) setIsAdmin(!!data);
    });
    return () => {
      active = false;
    };
  }, [session?.user?.id]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AuthCtx.Provider,
    {
      value: {
        user: session?.user ?? null,
        session,
        loading,
        isAdmin,
        signOut: async () => {
          await supabase.auth.signOut();
        }
      },
      children
    }
  );
}
const useAuth = () => reactExports.useContext(AuthCtx);
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$i = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#07060a" },
      { title: "YORUKAI.TV — Stream Beyond" },
      { name: "description", content: "Cinematic anime, movies, live TV, and manga. Stream beyond on YORUKAI.TV." },
      { property: "og:title", content: "YORUKAI.TV — Stream Beyond" },
      { property: "og:description", content: "Cinematic anime, movies, live TV, and manga. Stream beyond on YORUKAI.TV." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "YORUKAI.TV — Stream Beyond" },
      { name: "twitter:description", content: "Cinematic anime, movies, live TV, and manga. Stream beyond on YORUKAI.TV." },
      { property: "og:image", content: "https://anisti.vercel.app/og-image.png" },
      { name: "twitter:image", content: "https://anisti.vercel.app/og-image.png" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", type: "image/png", href: "/icon-192.png", sizes: "192x192" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Anton&family=Archivo+Black&family=Bebas+Neue&family=Bowlby+One&family=Caveat:wght@400;700&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&family=Noto+Sans+JP:wght@400;700;900&family=Space+Grotesk:wght@400;500;600;700&display=swap"
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$i.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuthProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }) });
}
const BASE_URL = "https://anisti.vercel.app";
const paths = ["/", "/browse", "/genres", "/manga", "/live-tv", "/search", "/auth"];
const Route$h = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const urls = paths.map(
          (p) => `  <url>
    <loc>${BASE_URL}${p}</loc>
    <changefreq>weekly</changefreq>
    <priority>${p === "/" ? "1.0" : "0.7"}</priority>
  </url>`
        );
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`
        ].join("\n");
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" }
        });
      }
    }
  }
});
const $$splitComponentImporter$g = () => import("./settings-6cbV_Jb4.mjs");
const Route$g = createFileRoute("/settings")({
  head: () => ({
    meta: [{
      title: "Settings — YORUKAI.TV"
    }, {
      name: "description",
      content: "Playback, language and accessibility preferences for YORUKAI.TV."
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./search-DxhuVD7l.mjs");
const Route$f = createFileRoute("/search")({
  head: () => ({
    meta: [{
      title: "Search — YORUKAI.TV"
    }, {
      name: "description",
      content: "Search the YORUKAI.TV catalogue of anime series and movies."
    }, {
      property: "og:title",
      content: "Search — YORUKAI.TV"
    }, {
      property: "og:description",
      content: "Find anime series and movies on YORUKAI.TV."
    }],
    links: [{
      rel: "canonical",
      href: "https://anisti.vercel.app/search"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./profile-ors1Wi1m.mjs");
const Route$e = createFileRoute("/profile")({
  head: () => ({
    meta: [{
      title: "Profile — YORUKAI.TV"
    }, {
      name: "description",
      content: "Your YORUKAI.TV profile, level and premium status."
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./manga-BFsOu0JM.mjs");
const Route$d = createFileRoute("/manga")({
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const liveChannelsFn = createServerFn({
  method: "GET"
}).handler(createSsrRpc("8d75d4082cfa9203ed80219df9a77029cf555e19ce6e084d0ad48294f770ea95"));
const liveChannelsQuery = queryOptions({
  queryKey: ["live-channels-in"],
  queryFn: () => liveChannelsFn(),
  staleTime: 1e3 * 60 * 30
});
const $$splitErrorComponentImporter$5 = () => import("./live-tv-xJZAQOAR.mjs");
const $$splitComponentImporter$c = () => import("./live-tv-DcEMzCOt.mjs");
const Route$c = createFileRoute("/live-tv")({
  head: () => ({
    meta: [{
      title: "Live TV — Indian Channels | YORUKAI.TV"
    }, {
      name: "description",
      content: "Stream live Indian TV channels — news, sports, entertainment, movies, music and more."
    }]
  }),
  loader: ({
    context
  }) => context.queryClient.ensureQueryData(liveChannelsQuery),
  component: lazyRouteComponent($$splitComponentImporter$c, "component"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$5, "errorComponent")
});
const $$splitComponentImporter$b = () => import("./library-Uei6PbvF.mjs");
const Route$b = createFileRoute("/library")({
  head: () => ({
    meta: [{
      title: "Library — YORUKAI.TV"
    }, {
      name: "description",
      content: "Your continue-watching list and watchlist on YORUKAI.TV."
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./genres-DAF7hr7J.mjs");
const Route$a = createFileRoute("/genres")({
  head: () => ({
    meta: [{
      title: "Genres — YORUKAI.TV"
    }, {
      name: "description",
      content: "Browse anime by genre — action, sci-fi, romance, mecha, horror, slice of life and more."
    }, {
      property: "og:title",
      content: "Genres — YORUKAI.TV"
    }, {
      property: "og:description",
      content: "Browse anime by genre on YORUKAI.TV."
    }],
    links: [{
      rel: "canonical",
      href: "https://anisti.vercel.app/genres"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const FALLBACK_POSTER = (seed) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/600/900`;
const FALLBACK_BANNER = (seed) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/1800/1000`;
const homeFeedQuery = queryOptions({
  queryKey: ["home-feed"],
  queryFn: async () => {
    const [featured, trending, recent, genres] = await Promise.all([
      supabase.from("content").select("*").eq("featured", true).not("banner_url", "is", null).order("rating", { ascending: false, nullsFirst: false }).limit(6),
      supabase.from("content").select("*").not("poster_url", "is", null).order("rating", { ascending: false, nullsFirst: false }).limit(18),
      supabase.from("content").select("*").not("poster_url", "is", null).order("release_year", { ascending: false, nullsFirst: false }).order("created_at", { ascending: false }).limit(18),
      supabase.from("genres").select("id,name,slug").order("name").limit(24)
    ]);
    return {
      featured: featured.data ?? [],
      trending: trending.data ?? [],
      recent: recent.data ?? [],
      genres: genres.data ?? []
    };
  },
  staleTime: 6e4
});
function browseQuery(opts) {
  return queryOptions({
    queryKey: ["browse", opts],
    queryFn: async () => {
      let query = supabase.from("content").select("*, content_genres!inner(genre_id, genres(slug,name))", {
        count: "exact"
      }).not("poster_url", "is", null).order("rating", { ascending: false, nullsFirst: false }).limit(opts.limit ?? 60);
      if (opts.q) query = query.ilike("title", `%${opts.q}%`);
      if (opts.type) query = query.eq("type", opts.type);
      if (opts.year) query = query.eq("release_year", opts.year);
      if (opts.genre) {
        query = query.eq("content_genres.genres.slug", opts.genre);
      }
      const { data, error } = await query;
      if (error) throw error;
      const seen = /* @__PURE__ */ new Set();
      const rows = [];
      for (const row of data ?? []) {
        if (seen.has(row.id)) continue;
        seen.add(row.id);
        rows.push(row);
      }
      return rows;
    },
    staleTime: 3e4
  });
}
function detailQuery(id) {
  return queryOptions({
    queryKey: ["detail", id],
    queryFn: async () => {
      const [content, episodes, genres] = await Promise.all([
        supabase.from("content").select("*").eq("id", id).maybeSingle(),
        supabase.from("episodes").select("*").eq("content_id", id).order("season_number").order("episode_number"),
        supabase.from("content_genres").select("genres(id,name,slug)").eq("content_id", id)
      ]);
      return {
        content: content.data,
        episodes: episodes.data ?? [],
        genres: (genres.data ?? []).map((g) => g.genres).filter(Boolean)
      };
    },
    staleTime: 3e4
  });
}
function episodeQuery(episodeId) {
  return queryOptions({
    queryKey: ["episode", episodeId],
    queryFn: async () => {
      const { data: ep } = await supabase.from("episodes").select("*").eq("id", episodeId).maybeSingle();
      if (!ep) return { episode: null, content: null, siblings: [] };
      const [content, siblings] = await Promise.all([
        supabase.from("content").select("*").eq("id", ep.content_id).maybeSingle(),
        supabase.from("episodes").select("*").eq("content_id", ep.content_id).order("season_number").order("episode_number")
      ]);
      return {
        episode: ep,
        content: content.data,
        siblings: siblings.data ?? []
      };
    },
    staleTime: 15e3
  });
}
function episodeServersQuery(episodeId, deviceId) {
  return queryOptions({
    queryKey: ["episode-servers", episodeId],
    queryFn: async () => {
      const { getEpisodeServersGuarded } = await import("./stream.functions-DzwzyVGX.mjs");
      const res = await getEpisodeServersGuarded({
        data: { episodeId, deviceId }
      });
      return res;
    },
    staleTime: 15e3,
    retry: 1
  });
}
const $$splitNotFoundComponentImporter$4 = () => import("./browse-C_k0LzX4.mjs");
const $$splitErrorComponentImporter$4 = () => import("./browse-CrOJEGnC.mjs");
const $$splitComponentImporter$9 = () => import("./browse-NpW_xXmw.mjs");
const Route$9 = createFileRoute("/browse")({
  head: () => ({
    meta: [{
      title: "Browse — YORUKAI.TV"
    }, {
      name: "description",
      content: "Browse anime, movies, and series."
    }]
  }),
  validateSearch: (s) => ({
    q: s.q ? String(s.q) : void 0,
    genre: s.genre ? String(s.genre) : void 0,
    year: s.year ? Number(s.year) || void 0 : void 0,
    type: s.type ? String(s.type) : void 0
  }),
  loaderDeps: ({
    search
  }) => search,
  loader: async ({
    context,
    deps
  }) => {
    await Promise.all([context.queryClient.ensureQueryData(browseQuery(deps)), context.queryClient.ensureQueryData(homeFeedQuery)]);
  },
  component: lazyRouteComponent($$splitComponentImporter$9, "component"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$4, "errorComponent"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$4, "notFoundComponent")
});
const $$splitComponentImporter$8 = () => import("./auth-BBB7ZGe2.mjs");
const Route$8 = createFileRoute("/auth")({
  head: () => ({
    meta: [{
      title: "Sign In — YORUKAI.TV"
    }, {
      name: "description",
      content: "Stream beyond. Sign in or join YORUKAI.TV."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./admin-BRqsLm9v.mjs");
const Route$7 = createFileRoute("/admin")({
  head: () => ({
    meta: [{
      title: "Admin — YORUKAI.TV"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitNotFoundComponentImporter$3 = () => import("./index-3vGUyL5C.mjs");
const $$splitErrorComponentImporter$3 = () => import("./index-gdQVD_70.mjs");
const $$splitComponentImporter$6 = () => import("./index-C3fHGhdU.mjs");
const Route$6 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "YORUKAI.TV — Stream Beyond"
    }, {
      name: "description",
      content: "The cinematic home of anime, movies, live TV, and manga."
    }]
  }),
  loader: ({
    context
  }) => context.queryClient.ensureQueryData(homeFeedQuery),
  component: lazyRouteComponent($$splitComponentImporter$6, "component"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$3, "errorComponent"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$3, "notFoundComponent")
});
const mangaListFn = createServerFn({
  method: "GET"
}).inputValidator((input) => input ?? {}).handler(createSsrRpc("cf163a37ce6862c7e2d0d008db2160c7b923e641268540dd49c2c85d2ba88753"));
const mangaDetailFn = createServerFn({
  method: "GET"
}).inputValidator((input) => input).handler(createSsrRpc("34d622c6f35c0a43d629b4a0cbd4bab5a00fe61dff33a3527bf78bd6bf2367a1"));
const mangaChaptersFn = createServerFn({
  method: "GET"
}).inputValidator((input) => input).handler(createSsrRpc("327e71ee482e4be5fd4a435a9ca43e5a742f48dff583421f3673ae71823e89fa"));
const chapterPagesFn = createServerFn({
  method: "GET"
}).inputValidator((input) => input).handler(createSsrRpc("22326cdd89e837e282249dd5f4dc9752a5c1ae32a62a853d07097aea31ed8054"));
const mangaListQuery = (kind, q) => queryOptions({
  queryKey: ["manga-list", kind, q ?? ""],
  queryFn: () => mangaListFn({
    data: {
      kind,
      q
    }
  }),
  staleTime: 1e3 * 60 * 10
});
const mangaDetailQuery = (id) => queryOptions({
  queryKey: ["manga-detail", id],
  queryFn: () => mangaDetailFn({
    data: {
      id
    }
  }),
  staleTime: 1e3 * 60 * 10
});
const mangaChaptersQuery = (id) => queryOptions({
  queryKey: ["manga-chapters", id],
  queryFn: () => mangaChaptersFn({
    data: {
      id
    }
  }),
  staleTime: 1e3 * 60 * 10
});
const chapterPagesQuery = (chapterId) => queryOptions({
  queryKey: ["chapter-pages", chapterId],
  queryFn: () => chapterPagesFn({
    data: {
      chapterId
    }
  }),
  staleTime: 1e3 * 60 * 30
});
const $$splitComponentImporter$5 = () => import("./manga.index-h2tyVvA_.mjs");
const Route$5 = createFileRoute("/manga/")({
  head: () => ({
    meta: [{
      title: "Manga — YORUKAI.TV"
    }, {
      name: "description",
      content: "Read trending, popular and latest manga in high quality."
    }, {
      property: "og:title",
      content: "Manga — YORUKAI.TV"
    }, {
      property: "og:description",
      content: "Read trending, popular and latest manga in high quality."
    }, {
      property: "og:url",
      content: "https://anisti.vercel.app/manga"
    }],
    links: [{
      rel: "canonical",
      href: "https://anisti.vercel.app/manga"
    }]
  }),
  loader: ({
    context
  }) => {
    context.queryClient.prefetchQuery(mangaListQuery("popular"));
  },
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitNotFoundComponentImporter$2 = () => import("./watch._id-H0LBJhdl.mjs");
const $$splitErrorComponentImporter$2 = () => import("./watch._id-CPNZnUL5.mjs");
const $$splitComponentImporter$4 = () => import("./watch._id-DmB91XyU.mjs");
const Route$4 = createFileRoute("/watch/$id")({
  head: () => ({
    meta: [{
      title: "Watch — YORUKAI.TV"
    }]
  }),
  loader: async ({
    context,
    params
  }) => {
    const data = await context.queryClient.ensureQueryData(episodeQuery(params.id));
    if (!data.episode) throw notFound();
    return data;
  },
  component: lazyRouteComponent($$splitComponentImporter$4, "component"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$2, "errorComponent"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$2, "notFoundComponent")
});
const $$splitComponentImporter$3 = () => import("./reader._id-C_x8GZGV.mjs");
const Route$3 = createFileRoute("/reader/$id")({
  head: () => ({
    meta: [{
      title: "Reader — YORUKAI.TV"
    }]
  }),
  validateSearch: (search) => ({
    manga: typeof search.manga === "string" ? search.manga : void 0
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitNotFoundComponentImporter$1 = () => import("./manga._id-BNiaEMl5.mjs");
const $$splitErrorComponentImporter$1 = () => import("./manga._id-_Uupw18x.mjs");
const $$splitComponentImporter$2 = () => import("./manga._id-CS7iRRE-.mjs");
const Route$2 = createFileRoute("/manga/$id")({
  head: ({
    params
  }) => ({
    meta: [{
      title: "Manga Detail — YORUKAI.TV"
    }, {
      property: "og:type",
      content: "article"
    }, {
      property: "og:url",
      content: `https://anisti.vercel.app/manga/${params.id}`
    }],
    links: [{
      rel: "canonical",
      href: `https://anisti.vercel.app/manga/${params.id}`
    }]
  }),
  loader: ({
    context,
    params
  }) => {
    context.queryClient.ensureQueryData(mangaDetailQuery(params.id));
    context.queryClient.prefetchQuery(mangaChaptersQuery(params.id));
  },
  component: lazyRouteComponent($$splitComponentImporter$2, "component"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$1, "errorComponent"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$1, "notFoundComponent")
});
const $$splitComponentImporter$1 = () => import("./live-watch._id-DpbcRIoq.mjs");
const Route$1 = createFileRoute("/live-watch/$id")({
  head: () => ({
    meta: [{
      title: "Live — YORUKAI.TV"
    }]
  }),
  loader: ({
    context
  }) => context.queryClient.ensureQueryData(liveChannelsQuery),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitNotFoundComponentImporter = () => import("./detail._id-vuWCoUEC.mjs");
const $$splitErrorComponentImporter = () => import("./detail._id-DnRJlJT2.mjs");
const $$splitComponentImporter = () => import("./detail._id-DpBfCX2-.mjs");
const Route = createFileRoute("/detail/$id")({
  head: ({
    loaderData,
    params
  }) => {
    const c = loaderData?.content;
    const url = `https://anisti.vercel.app/detail/${params.id}`;
    const title = c ? `${c.title} — YORUKAI.TV` : "Detail — YORUKAI.TV";
    const desc = c?.description?.slice(0, 160) ?? "Series detail on YORUKAI.TV";
    return {
      meta: [{
        title
      }, {
        name: "description",
        content: desc
      }, {
        property: "og:title",
        content: title
      }, {
        property: "og:description",
        content: desc
      }, {
        property: "og:type",
        content: "video.other"
      }, {
        property: "og:url",
        content: url
      }, ...c?.banner_url ? [{
        property: "og:image",
        content: c.banner_url
      }, {
        name: "twitter:image",
        content: c.banner_url
      }] : []],
      links: [{
        rel: "canonical",
        href: url
      }],
      scripts: c ? [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": c.type === "movie" ? "Movie" : "TVSeries",
          name: c.title,
          description: desc,
          image: c.banner_url ?? void 0,
          datePublished: c.release_year ? String(c.release_year) : void 0,
          ...c.rating ? {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: c.rating,
              bestRating: 10,
              ratingCount: 1
            }
          } : {},
          url
        })
      }] : []
    };
  },
  loader: async ({
    context,
    params
  }) => {
    const data = await context.queryClient.ensureQueryData(detailQuery(params.id));
    if (!data.content) throw notFound();
    return data;
  },
  component: lazyRouteComponent($$splitComponentImporter, "component"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent")
});
const SitemapDotxmlRoute = Route$h.update({
  id: "/sitemap.xml",
  path: "/sitemap.xml",
  getParentRoute: () => Route$i
});
const SettingsRoute = Route$g.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => Route$i
});
const SearchRoute = Route$f.update({
  id: "/search",
  path: "/search",
  getParentRoute: () => Route$i
});
const ProfileRoute = Route$e.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => Route$i
});
const MangaRoute = Route$d.update({
  id: "/manga",
  path: "/manga",
  getParentRoute: () => Route$i
});
const LiveTvRoute = Route$c.update({
  id: "/live-tv",
  path: "/live-tv",
  getParentRoute: () => Route$i
});
const LibraryRoute = Route$b.update({
  id: "/library",
  path: "/library",
  getParentRoute: () => Route$i
});
const GenresRoute = Route$a.update({
  id: "/genres",
  path: "/genres",
  getParentRoute: () => Route$i
});
const BrowseRoute = Route$9.update({
  id: "/browse",
  path: "/browse",
  getParentRoute: () => Route$i
});
const AuthRoute = Route$8.update({
  id: "/auth",
  path: "/auth",
  getParentRoute: () => Route$i
});
const AdminRoute = Route$7.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$i
});
const IndexRoute = Route$6.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$i
});
const MangaIndexRoute = Route$5.update({
  id: "/",
  path: "/",
  getParentRoute: () => MangaRoute
});
const WatchIdRoute = Route$4.update({
  id: "/watch/$id",
  path: "/watch/$id",
  getParentRoute: () => Route$i
});
const ReaderIdRoute = Route$3.update({
  id: "/reader/$id",
  path: "/reader/$id",
  getParentRoute: () => Route$i
});
const MangaIdRoute = Route$2.update({
  id: "/$id",
  path: "/$id",
  getParentRoute: () => MangaRoute
});
const LiveWatchIdRoute = Route$1.update({
  id: "/live-watch/$id",
  path: "/live-watch/$id",
  getParentRoute: () => Route$i
});
const DetailIdRoute = Route.update({
  id: "/detail/$id",
  path: "/detail/$id",
  getParentRoute: () => Route$i
});
const MangaRouteChildren = {
  MangaIdRoute,
  MangaIndexRoute
};
const MangaRouteWithChildren = MangaRoute._addFileChildren(MangaRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AdminRoute,
  AuthRoute,
  BrowseRoute,
  GenresRoute,
  LibraryRoute,
  LiveTvRoute,
  MangaRoute: MangaRouteWithChildren,
  ProfileRoute,
  SearchRoute,
  SettingsRoute,
  SitemapDotxmlRoute,
  DetailIdRoute,
  LiveWatchIdRoute,
  ReaderIdRoute,
  WatchIdRoute
};
const routeTree = Route$i._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 2,
        retryDelay: (attempt) => Math.min(1e3 * 2 ** attempt, 5e3),
        staleTime: 1e3 * 60
      }
    }
  });
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  FALLBACK_POSTER as F,
  Route$9 as R,
  FALLBACK_BANNER as a,
  browseQuery as b,
  createSsrRpc as c,
  Route$4 as d,
  episodeQuery as e,
  episodeServersQuery as f,
  Route$3 as g,
  homeFeedQuery as h,
  chapterPagesQuery as i,
  Route$2 as j,
  mangaDetailQuery as k,
  liveChannelsQuery as l,
  mangaListQuery as m,
  mangaChaptersQuery as n,
  Route$1 as o,
  Route as p,
  detailQuery as q,
  router as r,
  useAuth as u
};
