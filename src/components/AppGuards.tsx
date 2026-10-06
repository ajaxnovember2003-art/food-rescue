import { Component, useEffect, type ReactNode } from "react";
import { useLocation } from "react-router";

/** Fallback shown while a lazily loaded route chunk downloads. */
export function RouteLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory">
      <p className="label-xs text-forest/40">FoodRescue</p>
    </div>
  );
}

/**
 * Silent error boundary — if VlyToolbar crashes it renders nothing instead of
 * crashing the whole app (e.g. hook errors in the browser runtime).
 */
export class ToolbarErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn("[VlyToolbar] Caught error, toolbar disabled:", error.message);
  }

  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

/** Hard guard so runtime errors never leave the preview as a blank page. */
export class RootErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; message: string; stack: string }
> {
  state = { hasError: false, message: "", stack: "" };

  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      message: error.message || "Unknown runtime error",
      stack: error.stack || "",
    };
  }

  componentDidCatch(error: Error) {
    console.error("[Preview] Root crash:", error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
        <div className="max-w-lg text-center">
          <p className="text-sm font-semibold">Preview runtime error</p>
          <p className="mt-2 text-xs text-muted-foreground break-words">
            {this.state.message}
          </p>
          {this.state.stack ? (
            <pre className="mt-3 text-left text-[10px] leading-4 text-muted-foreground/80 max-h-40 overflow-auto rounded border border-border/60 p-2">
              {this.state.stack}
            </pre>
          ) : null}
        </div>
      </div>
    );
  }
}

/** Keeps the hosting shell in sync with the client-side route. */
export function RouteSyncer() {
  const location = useLocation();

  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}
