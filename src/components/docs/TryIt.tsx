import { useEffect, useMemo, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Play, Plus, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type KV = { key: string; value: string; enabled: boolean };

type TryItProps = {
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  path: string;
  baseUrl?: string;
  query?: { name: string; value?: string }[];
  headers?: { name: string; value?: string }[];
  body?: string;
};

const DEFAULT_BASE = "https://api.wundertreos.com/functions/v1";
const AUTH_KEY = "wundertreos.docs.apiKey";

const methodColors: Record<string, string> = {
  GET: "bg-[oklch(0.77_0.14_215_/_0.15)] text-[oklch(0.85_0.14_215)] border-[oklch(0.77_0.14_215_/_0.3)]",
  POST: "bg-[oklch(0.7_0.18_155_/_0.15)] text-[oklch(0.82_0.18_155)] border-[oklch(0.7_0.18_155_/_0.3)]",
  PATCH: "bg-[oklch(0.78_0.16_75_/_0.15)] text-[oklch(0.85_0.16_75)] border-[oklch(0.78_0.16_75_/_0.3)]",
  PUT: "bg-[oklch(0.78_0.16_75_/_0.15)] text-[oklch(0.85_0.16_75)] border-[oklch(0.78_0.16_75_/_0.3)]",
  DELETE: "bg-[oklch(0.62_0.22_25_/_0.15)] text-[oklch(0.78_0.2_25)] border-[oklch(0.62_0.22_25_/_0.3)]",
};

function toKV(items?: { name: string; value?: string }[]): KV[] {
  return (items ?? []).map((i) => ({ key: i.name, value: i.value ?? "", enabled: true }));
}

function extractPathParams(path: string): string[] {
  return Array.from(path.matchAll(/:([a-zA-Z_][a-zA-Z0-9_]*)/g)).map((m) => m[1]);
}

export function TryIt({ method, path, baseUrl = DEFAULT_BASE, query, headers, body }: TryItProps) {
  const pathParamNames = useMemo(() => extractPathParams(path), [path]);

  const [auth, setAuth] = useState("");
  const [pathParams, setPathParams] = useState<Record<string, string>>(() =>
    Object.fromEntries(pathParamNames.map((n) => [n, ""])),
  );
  const [queryKV, setQueryKV] = useState<KV[]>(() => toKV(query));
  const [headerKV, setHeaderKV] = useState<KV[]>(() =>
    toKV([{ name: "Content-Type", value: "application/json" }, ...(headers ?? [])]),
  );
  const [bodyText, setBodyText] = useState(body ?? (method === "GET" || method === "DELETE" ? "" : "{\n  \n}"));
  const [tab, setTab] = useState<"params" | "headers" | "body">(
    method === "GET" || method === "DELETE" ? "params" : "body",
  );
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{
    status: number;
    statusText: string;
    durationMs: number;
    headers: [string, string][];
    bodyText: string;
    contentType: string;
    error?: string;
  } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      if (stored) setAuth(stored);
    } catch {
      /* ignore */
    }
  }, []);

  const resolvedPath = useMemo(() => {
    let p = path;
    for (const [k, v] of Object.entries(pathParams)) {
      p = p.replace(new RegExp(`:${k}\\b`, "g"), v ? encodeURIComponent(v) : `:${k}`);
    }
    return p;
  }, [path, pathParams]);

  const finalUrl = useMemo(() => {
    const url = `${baseUrl.replace(/\/+$/, "")}${resolvedPath.startsWith("/") ? "" : "/"}${resolvedPath}`;
    const params = queryKV.filter((k) => k.enabled && k.key && k.value !== "");
    if (params.length === 0) return url;
    const qs = params.map((k) => `${encodeURIComponent(k.key)}=${encodeURIComponent(k.value)}`).join("&");
    return `${url}?${qs}`;
  }, [baseUrl, resolvedPath, queryKV]);

  const send = async () => {
    setLoading(true);
    setResponse(null);
    const start = performance.now();
    try {
      const hdrs: Record<string, string> = {};
      for (const h of headerKV) {
        if (h.enabled && h.key) hdrs[h.key] = h.value;
      }
      if (auth.trim()) hdrs["X-API-Key"] = auth.trim();
      try {
        localStorage.setItem(AUTH_KEY, auth);
      } catch {
        /* ignore */
      }

      const init: RequestInit = { method, headers: hdrs };
      if (method !== "GET" && method !== "DELETE" && bodyText.trim()) {
        init.body = bodyText;
      }

      const res = await fetch(finalUrl, init);
      const text = await res.text();
      const ct = res.headers.get("content-type") ?? "";
      setResponse({
        status: res.status,
        statusText: res.statusText,
        durationMs: Math.round(performance.now() - start),
        headers: Array.from(res.headers.entries()),
        bodyText: ct.includes("application/json")
          ? (() => {
              try {
                return JSON.stringify(JSON.parse(text), null, 2);
              } catch {
                return text;
              }
            })()
          : text,
        contentType: ct,
      });
    } catch (e) {
      setResponse({
        status: 0,
        statusText: "Network error",
        durationMs: Math.round(performance.now() - start),
        headers: [],
        bodyText: "",
        contentType: "",
        error: e instanceof Error ? e.message : String(e),
      });
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (s: number) =>
    s === 0
      ? "text-[oklch(0.78_0.2_25)]"
      : s < 300
        ? "text-[oklch(0.82_0.18_155)]"
        : s < 400
          ? "text-[oklch(0.85_0.14_215)]"
          : s < 500
            ? "text-[oklch(0.85_0.16_75)]"
            : "text-[oklch(0.78_0.2_25)]";

  const lang = response?.contentType.includes("json") ? "json" : "text";

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-[oklch(0.18_0.02_240)] px-4 py-2.5">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Play className="h-3.5 w-3.5 text-primary" /> Try it
        </div>
        <Button size="sm" onClick={send} disabled={loading} className="h-8">
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
          <span className="ml-1.5">{loading ? "Sending" : "Send"}</span>
        </Button>
      </div>

      {/* URL bar */}
      <div className="flex items-stretch gap-0 border-b border-border bg-[oklch(0.14_0.02_240)] p-3">
        <span
          className={cn(
            "inline-flex shrink-0 items-center rounded-l-md border border-r-0 px-2.5 font-mono text-xs font-bold",
            methodColors[method],
          )}
        >
          {method}
        </span>
        <input
          readOnly
          value={finalUrl}
          className="min-w-0 flex-1 rounded-r-md border border-border bg-background px-3 py-1.5 font-mono text-xs text-foreground"
        />
      </div>

      {/* Auth */}
      <div className="border-b border-border p-3">
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
          API Key (stored locally in your browser only)
        </label>
        <Input
          value={auth}
          onChange={(e) => setAuth(e.target.value)}
          placeholder="wt_your_api_key_here"
          className="h-9 font-mono text-xs"
        />
        <p className="mt-1.5 text-xs text-muted-foreground">
          Create an API key in your workspace under{" "}
          <a
            href="https://os.wundertre.com/settings/integrations"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline-offset-2 hover:underline"
          >
            Settings → Integrations & API
          </a>
          .
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border bg-[oklch(0.16_0.02_240)] px-2 text-xs">
        {(["params", "headers", "body"] as const).map((t) => {
          if (t === "body" && (method === "GET" || method === "DELETE")) return null;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "border-b-2 px-3 py-2 font-medium transition-colors",
                tab === t
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {t === "params" ? "Params" : t === "headers" ? "Headers" : "Body"}
            </button>
          );
        })}
      </div>

      <div className="p-3">
        {tab === "params" && (
          <ParamsEditor
            pathParamNames={pathParamNames}
            pathParams={pathParams}
            setPathParams={setPathParams}
            queryKV={queryKV}
            setQueryKV={setQueryKV}
          />
        )}
        {tab === "headers" && <KVEditor rows={headerKV} setRows={setHeaderKV} keyPlaceholder="Header" />}
        {tab === "body" && method !== "GET" && method !== "DELETE" && (
          <Textarea
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            spellCheck={false}
            className="min-h-[180px] font-mono text-xs"
            placeholder='{"first_name": "Jane"}'
          />
        )}
      </div>

      {/* Response */}
      {response && (
        <div className="border-t border-border">
          <div className="flex items-center gap-4 border-b border-border bg-[oklch(0.16_0.02_240)] px-4 py-2 text-xs">
            <span className={cn("font-bold", statusColor(response.status))}>
              {response.status === 0 ? "ERROR" : `${response.status} ${response.statusText}`}
            </span>
            <span className="text-muted-foreground">{response.durationMs} ms</span>
            {response.contentType && <span className="text-muted-foreground">{response.contentType}</span>}
          </div>
          {response.error && (
            <div className="border-b border-border bg-[oklch(0.62_0.22_25_/_0.08)] px-4 py-2 text-xs text-[oklch(0.78_0.2_25)]">
              {response.error} — this is often a CORS restriction when calling the API directly from the docs site.
              Try the request from your server or terminal with the same headers.
            </div>
          )}
          {response.bodyText && (
            <SyntaxHighlighter
              language={lang}
              style={oneDark}
              customStyle={{ margin: 0, background: "transparent", padding: "1rem", fontSize: "0.8rem" }}
            >
              {response.bodyText}
            </SyntaxHighlighter>
          )}
        </div>
      )}
    </div>
  );
}

function ParamsEditor({
  pathParamNames,
  pathParams,
  setPathParams,
  queryKV,
  setQueryKV,
}: {
  pathParamNames: string[];
  pathParams: Record<string, string>;
  setPathParams: (v: Record<string, string>) => void;
  queryKV: KV[];
  setQueryKV: (v: KV[]) => void;
}) {
  return (
    <div className="space-y-4">
      {pathParamNames.length > 0 && (
        <div>
          <div className="mb-2 text-xs font-medium text-muted-foreground">Path</div>
          <div className="space-y-1.5">
            {pathParamNames.map((name) => (
              <div key={name} className="flex items-center gap-2">
                <code className="w-32 shrink-0 rounded border border-border bg-muted px-2 py-1 font-mono text-xs">
                  :{name}
                </code>
                <Input
                  value={pathParams[name] ?? ""}
                  onChange={(e) => setPathParams({ ...pathParams, [name]: e.target.value })}
                  placeholder={`value for :${name}`}
                  className="h-8 font-mono text-xs"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      <div>
        <div className="mb-2 text-xs font-medium text-muted-foreground">Query</div>
        <KVEditor rows={queryKV} setRows={setQueryKV} keyPlaceholder="param" />
      </div>
    </div>
  );
}

function KVEditor({
  rows,
  setRows,
  keyPlaceholder,
}: {
  rows: KV[];
  setRows: (v: KV[]) => void;
  keyPlaceholder: string;
}) {
  const update = (i: number, patch: Partial<KV>) =>
    setRows(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const remove = (i: number) => setRows(rows.filter((_, idx) => idx !== i));
  const add = () => setRows([...rows, { key: "", value: "", enabled: true }]);

  return (
    <div className="space-y-1.5">
      {rows.length === 0 && <div className="text-xs text-muted-foreground">None.</div>}
      {rows.map((r, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={r.enabled}
            onChange={(e) => update(i, { enabled: e.target.checked })}
            className="h-3.5 w-3.5 accent-primary"
          />
          <Input
            value={r.key}
            onChange={(e) => update(i, { key: e.target.value })}
            placeholder={keyPlaceholder}
            className="h-8 flex-1 font-mono text-xs"
          />
          <Input
            value={r.value}
            onChange={(e) => update(i, { value: e.target.value })}
            placeholder="value"
            className="h-8 flex-1 font-mono text-xs"
          />
          <button
            onClick={() => remove(i)}
            className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Remove"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <button
        onClick={add}
        className="mt-1 inline-flex items-center gap-1 rounded border border-dashed border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <Plus className="h-3 w-3" /> Add row
      </button>
    </div>
  );
}
