import {z} from 'zod';

// Legal contract backend ->  AI models -> frontend
// Save cost  -> in a perticular quary

export const WebSearchResultSchema = z.object({
    title: z.string().min(1) ,
    url: z.url(),
    snippit: z.string().optional().default(""),
})

export const WebSearchResultsSchema = z.array(WebSearchResultSchema).max(10);

export type WebSearchResult = z.infer<typeof WebSearchResultSchema>;

// Capping -> so that token used reseanable 


export const openUrlInputSchema = z.object({
    url: z.url()
})

export const openUrlOutputSchema = z.object({
    url : z.url(),
    content : z.string().min(1)
})