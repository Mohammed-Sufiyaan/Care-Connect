import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocation } from "@tanstack/react-router";
import { AdvisorLauncher } from "@/components/advisor-chat";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <div className="mt-6">
          <Link to="/" className="inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong. Try refreshing.</p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { title: "Canada CareConnect — UEC Case Competition" },
      { name: "description", content: "Canada's medical tourism strategy for post-weight-loss body contouring." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

const NAV = [
  { to: "/", label: "Home" },
  { to: "/network", label: "Network Map" },
  { to: "/careroute", label: "CareRoute" },
  { to: "/simulator", label: "Simulator" },
  { to: "/economics", label: "Economics" },
  { to: "/advisor", label: "AI Advisor" },
  { to: "/sources", label: "Sources" },
] as const;

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  return (
    <QueryClientProvider client={queryClient}>
      <HeadContent />
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
            <Link to="/" className="flex items-center gap-2 font-display font-bold">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-xs text-primary-foreground">CC</span>
              Canada CareConnect
            </Link>
            <nav className="hidden gap-0.5 lg:flex">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  className="rounded-md px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  activeProps={{ className: "bg-primary-soft !text-accent-foreground font-medium" }}
                  activeOptions={{ exact: true }}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
            <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
              {open ? <X /> : <Menu />}
            </button>
          </div>
          {open && (
            <nav className="flex flex-col border-t px-5 py-2 lg:hidden">
              {NAV.map((n) => (
                <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-2 text-sm">
                  {n.label}
                </Link>
              ))}
            </nav>
          )}
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
        <footer className="border-t py-6">
          <p className="mx-auto max-w-6xl px-5 text-xs text-muted-foreground">
            UEC Advanced Case Competition. All projections, scores and simulations are illustrative and for discussion only — not
            medical advice. Clinic and provider entities shown are hypothetical.
          </p>
        </footer>
      </div>
      {!pathname.endsWith("/advisor") && <AdvisorLauncher />}
    </QueryClientProvider>
  );
}
