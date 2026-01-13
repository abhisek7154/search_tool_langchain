// @ts-ignore
import { convert } from 'html-to-text';


// Fetch each and every page
// The LLM itself cannot directly access / browse the web 
// act as a browser tool -> decide exactly what content is safe and what we want the model to show
// We fetch the url  , strip all the unnessery info and keep exact article like content we need

import { safeParse } from "zod";
import { openUrlOutputSchema } from './schemas';

export async function openUrl(url: string){
    // Step 1
    const normalized = validateUrl(url)
    //Step 2 - Fetch the page by ourselfs
    // LLM can't browse
    // Avoid instant 403 on strict webside

    const res = await fetch(normalized, {
    headers : {
        'User-Agent' : 'agent-core/1.0 (+course-demo)' // Avoid instnt 403 error
    }
})
    if(!res.ok){
        const body = await safeText(res);
        throw new Error(`openUrl failed ${res.status} - ${body.slice(0 , 200)}`)
    }

    // Step 3
    const contentType = res.headers.get('content-type') ?? '';
    const raw = await res.text()
    
    //Step 4  HTML -> plan text 
     
    const text = contentType?.includes('text/html')
    ? convert(raw, {
        wordwrap : false ,
        selectors : [
            {
                selector : 'nav' , format : 'skip'
            },
            {
                selector : 'header' , format : 'skip'
            },
            {
                selector : 'footer' , format : 'skip'
            },
            {
                selector : 'script' , format : 'skip'
            },
            {
                selector : 'style' , format : 'skip'
            }
        ]
    }) : raw

    // Step 5

    const cleaned = collapseWhitespace(text)
    const capped = cleaned.slice(0 , 8000)
    return openUrlOutputSchema.parse(
        {
            url : normalized,
            content : capped
        }
    )
    
}

function validateUrl(url: string)
{
    try{
        const parsed = new URL(url);
        // https:
        if(!/^https?:$/.test(parsed.protocol)){
            throw new Error('Only http / https are supported')
        }
        return parsed.toString()
    }catch{
        throw new Error('Invalid URL')
    }
}

async function safeText(res: Response){
    try{

        return await res.json();

    }catch{
        return "<no body>"
    }
}

function collapseWhitespace(s:string)
{
    return s.replace(/\s+/g, " ").trim();
}