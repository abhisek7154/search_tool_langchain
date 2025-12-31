import {z} from 'zod';

// Legal contract backend ->  AI models -> frontend
// Save cost  -> in a perticular quary

export const WebSearchResultSchema = z.object({
    title: z.string().min(1) ,
    url: z.url(),
    snippit: z.string().optional().default(""),
})

export const WebSearchResultsSchema = z.array(WebSearchResultSchema).max(10);

// Capping -> so that token used reseanable 