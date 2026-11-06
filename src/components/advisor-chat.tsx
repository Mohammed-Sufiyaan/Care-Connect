import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, KeyRound, Loader2, Send, Sparkles, X } from "lucide-react";
import { SUGGESTIONS, answerFromKnowledge, askClaude, getKey, setKey, type ChatMsg } from "@/lib/advisor";
import { Robot } from "@/components/robot";

type Msg = ChatMsg & { links?: { to: string; label: string }[]; note?: string };

const WELCOME: Msg = {
  role: "assistant",
  content: "Hi, I'm the CareConnect Advisor. Ask me about the strategy, the three policies, the numbers, risks, or planning a patient trip.",
};

export function AdvisorChat({ compact = false, onBusy }: { compact?: boolean; onBusy?: (busy: boolean) => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [key, setKeyState] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [draftKey, setDraftKey] = useState("");
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setKeyState(getKey());
  }, []);
  useEffect(() => {
    onBusy?.(busy);
  }, [busy, onBusy]);
  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [msgs, busy]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content: q }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    try {
      if (key) {
        const history = next.filter((m) => m !== WELCOME).map(({ role, content }) => ({ role, content }));
        const text = await askClaude(history, key);
        setMsgs([...next, { role: "assistant", content: text || "I couldn't come up with an answer. Try rephrasing." }]);
      } else {
        await new Promise((r) => setTimeout(r, 350));
        const a = answerFromKnowledge(q);
        setMsgs([...next, { role: "assistant", content: a.text, links: a.links }]);
      }
    } catch (e) {
      const a = answerFromKnowledge(q);
      setMsgs([...next, { role: "assistant", content: a.text, links: a.links, note: e instanceof Error ? e.message : "Claude is unavailable." }]);
    } finally {
      setBusy(false);
    }
  }

  const saveKey = () => {
    const k = draftKey.trim();
    setKey(k);
    setKeyState(k);
    setDraftKey("");
    setShowKey(false);
  };
  const clearKey = () => {
    setKey("");
    setKeyState("");
    setShowKey(false);
  };

  return (
    <div className={`flex h-full flex-col ${compact ? "" : "rounded-xl border bg-card shadow-soft"}`}>
      <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-soft"><Robot size={30} thinking={busy} wave={false} /></span>
          <div>
            <p className="text-sm font-semibold leading-tight">CareConnect Advisor</p>
            <p className="text-xs text-muted-foreground">{key ? "Powered by Claude" : "Answers from our strategy"}</p>
          </div>
        </div>
        <button onClick={() => setShowKey(!showKey)} className="inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs text-muted-foreground hover:text-foreground">
          {key ? <Sparkles className="h-3.5 w-3.5 text-primary" /> : <KeyRound className="h-3.5 w-3.5" />} AI settings
        </button>
      </div>

      {showKey && (
        <div className="space-y-2 border-b bg-muted/50 px-4 py-3 text-xs">
          <p className="text-muted-foreground">
            Optional: paste your own Anthropic API key to get live Claude answers. It's saved only in this browser and sent only to Anthropic.
          </p>
          <div className="flex gap-2">
            <input type="password" value={draftKey} onChange={(e) => setDraftKey(e.target.value)} placeholder={key ? "Key saved on this device" : "sk-ant-…"}
              className="min-w-0 flex-1 rounded-md border bg-card px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-ring" />
            <button onClick={saveKey} disabled={!draftKey.trim()} className="rounded-md bg-primary px-3 py-1.5 font-medium text-primary-foreground disabled:opacity-50">Save</button>
            {key && <button onClick={clearKey} className="rounded-md border px-3 py-1.5">Remove</button>}
          </div>
        </div>
      )}

      <div className={`flex-1 space-y-3 overflow-y-auto px-4 py-4 ${compact ? "" : "min-h-[360px]"}`}>
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[88%] whitespace-pre-wrap rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm bg-muted"}`}>
              {m.note && <p className="mb-1.5 text-xs text-warning">{m.note}</p>}
              {m.content}
              {!!m.links?.length && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {m.links.map((l) => (
                    <Link key={l.to} to={l.to} className="inline-flex items-center gap-1 rounded-md bg-card px-2 py-1 text-xs font-medium text-primary shadow-soft">
                      {l.label} <ArrowRight className="h-3 w-3" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {busy && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><Loader2 className="h-3.5 w-3.5 animate-spin" /> The Advisor is thinking…</div>
        )}
        <div ref={end} />
      </div>

      {msgs.length <= 1 && (
        <div className="flex flex-wrap gap-1.5 px-4 pb-3">
          {SUGGESTIONS.slice(0, compact ? 3 : 5).map((s) => (
            <button key={s} onClick={() => send(s)} className="rounded-full border bg-card px-3 py-1 text-xs hover:border-primary hover:text-primary">{s}</button>
          ))}
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2 border-t p-3">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask the Advisor…" aria-label="Message"
          className="min-w-0 flex-1 rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
        <button disabled={busy || !input.trim()} aria-label="Send" className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground disabled:opacity-50">
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

export function AdvisorLauncher() {
  const [open, setOpen] = useState(false);
  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[min(560px,calc(100vh-8rem))] w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border bg-card shadow-[0_20px_50px_-12px_oklch(0.2_0.02_220/30%)]">
          <AdvisorChat compact />
        </div>
      )}
      <button onClick={() => setOpen(!open)} aria-label={open ? "Close the Advisor" : "Open the Advisor"}
        className="fixed bottom-5 right-5 z-50 inline-flex h-14 items-center gap-2 rounded-full bg-primary px-5 font-medium text-primary-foreground shadow-[0_10px_30px_-8px_oklch(0.55_0.1_190/60%)] transition hover:brightness-105">
        {open ? <X className="h-5 w-5" /> : <span className="-my-2 -ml-2 grid h-10 w-10 place-items-center rounded-full bg-card"><Robot size={34} wave={false} /></span>}
        <span className="hidden sm:inline">{open ? "Close" : "Ask the Advisor"}</span>
      </button>
    </>
  );
}
