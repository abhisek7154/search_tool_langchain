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

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top : scrollRef.current.scrollHeight,
      behavior : "smooth",
    })
  } , [chat])

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


      // Success handle
    }catch(e){

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
    <div className="flex h-dvh flex-col bg-[#f9fafb] text-gray-900">
      <header className="border-b bg-white px-4 py-3 text-sm flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-medium text-gray-800">
            Search V1 (LCEL Web Agent)
          </span>
          <span className="text-[13px] text-gray-500">
            Answer with sources. Some queries will browse the web and some don't.
          </span>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {
          chat.length === 0 && (
            <div className="mx-auto max-w-2xl text-center text-sm text-gray-500">
              <div className="text-base font-semibold text-gray-800 mb-1">
                Ask anything
              </div>
              <div className="text-[14px] leading-relaxed">
                Examples:
                <code className="mt-3 block space-y-2">
                  <span className="block rounded bg-gray-100 px-3 py-2 text-[12px] text-gray-700">"How does quantum computing work?"</span>
                  <span className="block rounded bg-gray-100 px-3 py-2 text-[12px] text-gray-700">"What are the health benefits of green tea?"</span>
                  <span className="block rounded bg-gray-100 px-3 py-2 text-[12px] text-gray-700">"Top 10 highest-grossing movies of all time"</span>
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
                className="inline-block rounded-2xl bg-gray-900 px-4 py-3 text-sm text-white shadow-md max-w-full"
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
                  <div className="flex h-8 w-8 flex-none items-center justify-center rounded-md bg-gray-800 text-[11px] text-white font-semibold">
                    AI
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="inline-block rounded-2xl bg-white px-4 py-3 text-sm text-gray-900 shadow-sm ring-1 ring-gray-200 whitespace-pre-wrap wrap-break-word">
                      {turn.content}
                    </div>
                  </div>
                </div>
              )
            })
          }
        <footer className="border-t bg-white px-4 py-4">
          <form 
          className="mx-auto flex w-full max-w-2xl items-end gap-2"
          onSubmit={handleChatSubmit}
          >
            <div>
              <Input
              className="w-full resize-none"
              placeholder="Ask your query..."
              value={q}
              onChange={event => setQ(event.target.value)}
              disabled={loading}
              />
            </div>
            <Button
             className="shrink-0" 
             disabled={loading || q.trim().length < 5} 
             type="submit">
              {loading ? "..." : "Send"}
            </Button>
          </form>
        </footer>
      </main>
    </div>
  );
}
