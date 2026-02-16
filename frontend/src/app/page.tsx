'use client'

import { FormEvent, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/lib/config";

type SearchResponse = {
  answer: string;
  sources: string[];
};

type CurrentChatTurn =
  | {
      role: "user";
      content: string;
    }
  | {
      role: "assistant";
      content: string;
      sources: string[];
      time: number;
      error?: string;
    };

export default function Home() {

  const[q , setQ] = useState('');
  const[loading , setLoading] = useState(false);
  const[chat , setChat] = useState<CurrentChatTurn[]>([]);
  
  // ADDED: Dark mode state
  const [isDark, setIsDark] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  // ADDED: Dark mode toggle effect
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top : scrollRef.current.scrollHeight,
      behavior : "smooth",
    })
  } , [chat])

  // Helper to format milliseconds into minutes/seconds
  const formatTime = (ms: number) => {
    const totalSeconds = ms / 1000;
    if (totalSeconds < 60) {
      return `${totalSeconds.toFixed(1)}s`;
    }
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}m ${seconds}s`;
  };

async function runSearch(prompt: string){
    setLoading(true)
    setChat((old) => [...old , {role : 'user' , content : prompt}])
    const oldTime = performance.now()

    try{
      const res = await fetch(`${API_URL}/search`, {
        method : 'POST',
        headers : {
          "Content-Type" : 'application/json'
        },
        body :JSON.stringify({q: prompt})
      })
      const json = await res.json();
      const timeDiff = Math.round(performance.now() - oldTime)

      // Error handle

      if(!res.ok)
      {
        const errorMsg = 'Request failed'
        setChat(old => [
          ...old,
          {
            role : 'assistant',
            content : 'I tried to ans , but something went wrong. Pls try again.',
            sources : [],
            time : timeDiff,
            error : errorMsg
          }
        ])

        // Success

      } else {
        const data = json as SearchResponse
        setChat(old => [
          ...old,
          {
            role: 'assistant',
            content: data.answer,
            sources: data.sources,
            time : timeDiff
          }
        ])
      }


      // Success handle
    }catch(e){

      const timeDiff = Math.round(performance.now() - oldTime)
      const errorMsg = 'Request failed'
        setChat(old => [
          ...old,
          {
            role : 'assistant',
            content : 'I tried to ans , but something went wrong. Pls try again.',
            sources : [],
            time : timeDiff,
            error : errorMsg
          }
        ])

    }finally{
      setLoading(false)
    }
  }

  async function handleChatSubmit(e : FormEvent){
    e.preventDefault()
    const prompt = q.trim()
    if(!prompt || loading) return
    setQ('')
    await runSearch(prompt)
  }

  return (
    // ADDED: dark:bg-gray-950 dark:text-gray-100 transition-colors
    <div className="flex h-dvh flex-col bg-[#f9fafb] dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      
      {/* ADDED: dark:bg-gray-900 dark:border-gray-800 */}
      <header className="border-b dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3 text-sm flex items-center justify-between">
        <div className="flex flex-col">
          {/* ADDED: dark:text-gray-200 */}
          <span className="font-medium text-gray-800 dark:text-gray-200">
            Search V1 (LCEL Web Agent)
          </span>
          {/* ADDED: dark:text-gray-400 */}
          <span className="text-[13px] text-gray-500 dark:text-gray-400">
            Answer with sources. Some queries will browse the web and some don't.
          </span>
        </div>
        {/* ADDED: The Toggle Button */}
        <button 
          onClick={() => setIsDark(!isDark)}
          className="rounded-lg px-3 py-1.5 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {isDark ? '☀️ Light' : '🌙 Dark'}
        </button>
      </header>
      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {
          chat.length === 0 && (
            // ADDED: dark:text-gray-400
            <div className="mx-auto max-w-2xl text-center text-sm text-gray-500 dark:text-gray-400">
              {/* ADDED: dark:text-gray-200 */}
              <div className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">
                Ask anything
              </div>
              <div className="text-[14px] leading-relaxed">
                Examples:
                <code className="mt-3 block space-y-2">
                  {/* ADDED: dark:bg-gray-800 dark:text-gray-300 */}
                  <span className="block rounded bg-gray-100 dark:bg-gray-800 px-3 py-2 text-[12px] text-gray-700 dark:text-gray-300">"How does quantum computing work?"</span>
                  <span className="block rounded bg-gray-100 dark:bg-gray-800 px-3 py-2 text-[12px] text-gray-700 dark:text-gray-300">"What are the health benefits of green tea?"</span>
                  <span className="block rounded bg-gray-100 dark:bg-gray-800 px-3 py-2 text-[12px] text-gray-700 dark:text-gray-300">"Top 10 highest-grossing movies of all time"</span>
                </code>
              </div>
            </div>
          )}
          {
            chat.map((turn , idx) => {
              // User role
              if(turn.role === 'user'){
                return<div 
                key={idx}
                className="mx-auto max-w-2xl flex justify-end text-right"
                >
                  <div 
                // ADDED: dark:bg-gray-700
                className="inline-block rounded-2xl bg-gray-900 dark:bg-gray-700 px-4 py-3 text-sm text-white shadow-md max-w-full"
                >
                  <div className="whitespace-pre-wrap wrap-break-word">
                    {turn.content}
                  </div>
                </div>
                </div>
              }

              // Assitant role
              return (
                <div 
                key={idx}
                className="mx-auto max-w-2xl flex items-start gap-3 text-left"
                >
                  {/* ADDED: dark:bg-gray-700 */}
                  <div className="flex h-8 w-8 flex-none items-center justify-center rounded-md bg-gray-800 dark:bg-gray-700 text-[11px] text-white font-semibold">
                    AI
                  </div>
                  <div className="flex-1 space-y-3">
                    {/* ADDED: dark:bg-gray-900 dark:text-gray-100 dark:ring-gray-800 */}
                    <div className="inline-block rounded-2xl bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-gray-200 dark:ring-gray-800 whitespace-pre-wrap wrap-break-word">
                      {turn.content}
                    </div>
                    {/* ADDED: dark:text-gray-400 */}
                    <div className="text-[11px] text-gray-500 dark:text-gray-400 flex flex-wrap items-center gap-x-2">
                    {
                      typeof turn.time === 'number' && (
                        <span>
                          Answered in {
                            turn.time < 60000 
                              ? `${(turn.time / 1000).toFixed(1)}s` 
                              : `${Math.floor(turn.time / 60000)}m ${Math.floor((turn.time % 60000) / 1000)}s`
                          }
                        </span>
                      )
                    }
                    {
                      // ADDED: dark:text-red-400
                      turn?.error && <span className="text-red-500 dark:text-red-400">{turn.error}</span>
                    }
                  </div>  
                  {/* 2. Sources Block */}
                      {turn.sources && turn.sources.length > 0 && (
                        // ADDED: dark:bg-gray-900 dark:ring-gray-800
                        <div className="rounded-lg bg-white dark:bg-gray-900 px-3 py-2 text-[12px] shadow-sm ring-1 ring-gray-200 dark:ring-gray-800 w-fit max-w-full">
                          {/* ADDED: dark:text-gray-300 */}
                          <div className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Sources
                          </div>
                          <ul className="flex flex-col gap-2">
                            {turn.sources.map((src, i) => {
                              // Safely extract the domain (e.g., "www.youtube.com") from the URL
                              let hostname = '';
                              try {
                                hostname = new URL(src).hostname;
                              } catch (e) {}

                              return (
                                <li key={i} className="flex items-center gap-2 truncate max-w-md">
                                  {/* Render the website's favicon via Google's free icon API */}
                                  {hostname && (
                                    <img 
                                      src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=32`} 
                                      alt="icon" 
                                      className="w-4 h-4 rounded-full flex-shrink-0"
                                    />
                                  )}
                                  {/* ADDED: dark:text-blue-400 */}
                                  <a href={src} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline truncate">
                                    {src}
                                  </a>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}

                      {/* 3. Metadata (Time and Error) */}
                      {/* ADDED: dark:text-gray-400 */}
                      <div className="text-[11px] text-gray-500 dark:text-gray-400 flex flex-wrap items-center gap-x-2">
                        {typeof turn.time === 'number' && (
                          <span>Answered in {formatTime(turn.time)}</span>
                        )}
                        {/* ADDED: dark:text-red-400 */}
                        {turn?.error && <span className="text-red-500 dark:text-red-400">{turn.error}</span>}
                      </div>
                  </div>
                </div>
              )
            })
          }
          {loading && (
            <div className="mx-auto max-w-2xl flex items-start gap-3 text-left animate-pulse">
              {/* ADDED: dark:bg-gray-700 */}
              <div className="flex h-8 w-8 flex-none items-center justify-center rounded-md bg-gray-800 dark:bg-gray-700 text-[11px] text-white font-semibold">
                AI
              </div>
              <div className="flex-1 space-y-3">
                {/* ADDED: dark:bg-gray-900 dark:text-gray-400 dark:ring-gray-800 */}
                <div className="inline-block rounded-2xl bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-500 dark:text-gray-400 shadow-sm ring-1 ring-gray-200 dark:ring-gray-800">
                  Searching the web...
                </div>
              </div>
            </div>
          )}
        {/* ADDED: dark:bg-gray-900 dark:border-gray-800 */}
        <footer className="border-t dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-4">
          <form 
            className="mx-auto flex w-full max-w-2xl items-end gap-2"
            onSubmit={handleChatSubmit}
          >
            <div className="flex-1"> {/* <-- Added flex-1 here so the input stretches */}
              {/* ADDED: dark:bg-gray-800 dark:text-white dark:border-gray-700 */}
              <Input
                className="w-full resize-none dark:bg-gray-800 dark:text-white dark:border-gray-700"
                placeholder="Ask your query..."
                value={q}
                onChange={event => setQ(event.target.value)}
                disabled={loading}
              />
            </div>
            {/* ADDED: dark:bg-gray-100 dark:text-gray-900 */}
            <Button
              className="shrink-0 dark:bg-gray-100 dark:text-gray-900" 
              disabled={loading || q.trim().length < 5} 
              type="submit"
            >
              {loading ? "..." : "Send"}
            </Button>
          </form>
        </footer>
      </main>
    </div>
  );
}