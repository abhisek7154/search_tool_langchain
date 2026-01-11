
// Search the  internet tool
// u give a natural language query (The user's query )
// It going to call Tavely under the hood
// its going to return a clean array of  search hit -> WebSearchResultSchema

import { error } from 'node:console';
import {env} from '../shared/env'
import { WebSearchResultSchema, WebSearchResultsSchema } from './schemas';
import { title } from 'node:process';
import { url } from 'node:inspector';

export async function webSearch(q: string){
    const query = (q?? '').trim()
    if(!query) return []


    return await searchTavilyUtil(query)
}

async function searchTavilyUtil(queary: string){
    if(!env.TAVILY_API_KEY)
    {
        throw new Error('Tavily api key missing!!!');
    }

    const response = await fetch('https://api.tavily.com/search' , {
    method: 'POST',
    headers : {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.TAVILY_API_KEY}`,
    },
    body : JSON.stringify({
        queary , 
        search_depth : 'basic',
        max_results : 5,
        include_answer : false,
        include_images : false
    }),
});

if (!response.ok){
    // Production lesson    
    const text = await safeText(response)
    throw new Error(`Tavily error , ${response.status}- ${text}`)
    }

    const data = await response.json();
    const results = Array.isArray(data?.results) ? data.results : [];

    const normailzed = results.slice(0,5).map((r: any)=> WebSearchResultSchema.parse({
        title : String(r?.title ?? "").trim() || 'Untitled',
        url :  String(r?.url ?? "").trim(),
        snippet : String(r?.content ?? "").trim().slice(0,220)
    }))

    return WebSearchResultsSchema.parse(normailzed)
}

async function safeText(res: Response){
    try{

        return await res.json();

    }catch{
        return "<no body>"
    }
}
