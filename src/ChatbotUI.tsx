import React, { useEffect, useMemo, useRef, useState } from 'react'

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

function Bubble({ role, content, time, onCopy, onRegenerate, isStreaming }: any) {
  const isUser = role === 'user';
  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="shrink-0 h-8 w-8 rounded-full bg-indigo-600 text-white grid place-items-center text-xs font-semibold">
          AI
        </div>
      )}
      <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-3 shadow-sm ${isUser ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-white dark:bg-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-bl-sm'}`}>
        <div className="whitespace-pre-wrap leading-relaxed">{content}</div>
        <div className="mt-2 flex items-center gap-2 text-xs opacity-70">
          <span>{time}</span>
          {!isUser && (
            <>
              <button onClick={onCopy} className="px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700">Copy</button>
              <button onClick={onRegenerate} className="px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700">Regenerate</button>
              {isStreaming && (
                <span className="inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:.2s]"></span>
                </span>
              )}
            </>
          )}
        </div>
      </div>
      {isUser && (
        <div className="shrink-0 h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-100 grid place-items-center text-xs font-semibold">
          U
        </div>
      )}
    </div>
  );
}

function Chip({ label, onClick }: any) {
  return (
    <button onClick={onClick} className="text-sm px-3 py-1.5 rounded-full border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700">
      {label}
    </button>
  );
}

export default function ChatbotUI() {
  const [dark, setDark] = useState(true);
  const [query, setQuery] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [model, setModel] = useState('gpt-neo-demo');
  const [temperature, setTemperature] = useState(0.7);
  const [conversations, setConversations] = useState<any[]>([
    { id: uid(), title: 'Welcome', updatedAt: new Date(), messages: [
      { id: uid(), role: 'assistant', content: 'Hey there 👋 I’m your CatGPT bot. Ask me about SFWE classes, clubs, scholarships, or anything else!', time: 'now' }
    ] }
  ]);
  const [activeId, setActiveId] = useState(conversations[0].id);
  const active = useMemo(() => conversations.find(c => c.id === activeId)!, [conversations, activeId]);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [dark]);

  useEffect(() => {
    if (listRef.current) {
      const el = listRef.current;
      el.scrollTop = el.scrollHeight;
    }
  }, [active]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    setQuery('');
    setConversations(prev => prev.map(c => c.id === activeId ? ({
      ...c,
      updatedAt: new Date(),
      messages: [...c.messages, { id: uid(), role: 'user', content: text, time: new Date().toLocaleTimeString() }]
    }) : c));

    setStreaming(true);
    const draft = { id: uid(), role: 'assistant', content: '', time: new Date().toLocaleTimeString() };
    setConversations(prev => prev.map(c => c.id === activeId ? ({ ...c, messages: [...c.messages, draft] }) : c));

    const simulated = "Here’s a sample response. This UI is ready for your backend – just replace the demo handlers with API calls. It supports multi-turn chat, quick suggestions, and a settings panel for model and temperature.";

    for (let i = 0; i < simulated.length; i++) {
      await new Promise(r => setTimeout(r, 6));
      setConversations(prev => prev.map(c => {
        if (c.id !== activeId) return c;
        const msgs = [...c.messages];
        msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], content: msgs[msgs.length - 1].content + simulated[i] };
        return { ...c, messages: msgs };
      }));
    }
    setStreaming(false);
  };

  const newChat = () => {
    const id = uid();
    setConversations(prev => ([{ id, title: 'New chat', updatedAt: new Date(), messages: [{ id: uid(), role: 'assistant', content: 'New conversation started. How can I help?', time: new Date().toLocaleTimeString() }] }, ...prev]));
    setActiveId(id);
  };

  const renameChat = (id: string, title: string) => setConversations(prev => prev.map(c => c.id === id ? ({ ...c, title }) : c));
  const deleteChat = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
  };

  const copyLast = () => navigator.clipboard?.writeText(active.messages[active.messages.length-1]?.content || '');

  return (
    <div className="h-screen w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex">
      <aside className="hidden md:flex w-72 shrink-0 border-r border-zinc-200 dark:border-zinc-800 flex-col">
        <div className="p-4 flex items-center justify-between">
          <button onClick={newChat} className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500">+ New Chat</button>
          <button onClick={() => setDark(d => !d)} className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800" aria-label="Toggle theme">{dark ? '🌙' : '☀️'}</button>
        </div>
        <div className="px-3 pb-3 text-xs uppercase tracking-wide opacity-60">Conversations</div>
        <nav className="flex-1 overflow-y-auto space-y-1 px-2 pb-4">
          {conversations.map(c => (
            <button key={c.id} onClick={() => setActiveId(c.id)} className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between hover:bg-zinc-100 dark:hover:bg-zinc-800 ${activeId===c.id?'bg-zinc-100 dark:bg-zinc-800': ''}`}>
              <span className="truncate">{c.title}</span>
              <div className="flex items-center gap-2 opacity-70">
                <button onClick={(e)=>{e.stopPropagation(); const t = prompt('Rename chat', c.title); if (t) renameChat(c.id, t);}} className="hover:opacity-100">✏️</button>
                <button onClick={(e)=>{e.stopPropagation(); if (confirm('Delete chat?')) deleteChat(c.id);}} className="hover:opacity-100">🗑️</button>
              </div>
            </button>
          ))}
        </nav>
        <div className="p-4 text-xs opacity-70">Model: MODEL_NAME</div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-indigo-600 text-white grid place-items-center text-xs font-semibold">AI</div>
            <div>
              <div className="font-semibold">CatGPT</div>
              <div className="text-xs opacity-70">Ask about SFWE classes, clubs, scholarships…</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={copyLast} className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800">Copy last</button>
          </div>
        </header>

        <section ref={listRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {active.messages.map((m: any) => (
            <Bubble key={m.id} role={m.role} content={m.content} time={m.time} onCopy={()=> navigator.clipboard?.writeText(m.content)} onRegenerate={()=> sendMessage('Please regenerate your last response but be concise.')} isStreaming={streaming && m.role === 'assistant' && !m.content.endsWith('.')} />
          ))}
          <div className="mt-2 flex flex-wrap gap-2">
            {['What scholarships are open now?', 'Show SE clubs.', 'How to meet an advisor?', 'Internship tips'].map((s) => (
              <Chip key={s} label={s} onClick={() => sendMessage(s)} />
            ))}
          </div>
        </section>

        <footer className="border-t border-zinc-200 dark:border-zinc-800 p-3 md:p-4">
          <div className="max-w-4xl mx-auto flex items-end gap-2">
            <textarea
              value={query}
              onChange={e=>setQuery(e.target.value)}
              placeholder="Send a message…"
              rows={1}
              onKeyDown={e=>{ if(e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); sendMessage(query);} }}
              className="flex-1 resize-none rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button onClick={()=>sendMessage(query)} className="h-10 px-4 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50" disabled={!query.trim() || streaming}>Send</button>
          </div>
          <div className="max-w-4xl mx-auto mt-2 text-xs opacity-70 flex items-center justify-between">
            <span>Press Enter to send • Shift+Enter for new line</span>
          </div>
        </footer>
      </main>
    </div>
  );
}