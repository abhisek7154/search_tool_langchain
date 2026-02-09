import { RunnableLambda } from "@langchain/core/runnables";
import { webSearch } from "../utils/webSeach";
import { openUrl } from "../utils/openUrl";
import { summerize } from "../utils/summarize";
import { title } from 'node:process';

// top 10 collges in india 2025 ?
// Search the web ->
// it will visit each and every result page ->
// summarize 

const setTopResults = 5;

export const webSearchStep = RunnableLambda.from(
    async (input: {q: string , mode: 'web' | 'direct'}) => {
        const results = await webSearch(input.q)

        return{
            ...input,
            results,
        };
    }
);

export const openAndSummerizeStep = RunnableLambda.from(
    async(input: {q: string ; mode: 'web' | 'direct'; results: any[]}) => {
        if(!Array.isArray(input.results) || input.results.length === 0){
            return {
                ...input,
                pageSummaries: [],
                fallback: 'No results' as const
            }
        }

        const extractTopResults = input.results.slice(0 , setTopResults)

        const settledResults = await Promise.allSettled(
            extractTopResults.map(async (result : any) => {
                const opened = await openUrl(result.url)
                const summarizeContent = await summerize(opened.content)

                return {
                    url : opened.url,
                    summery : summarizeContent.summary,

                }
            })
        )

        // Status -> fullfilled

        const settledResultsPageSummaries = settledResults.filter(
        settledResult => settledResult.status === 'fulfilled'
        ).map(s => s.value);
        
        // If all the cases above failes 

        if (settledResultsPageSummaries.length === 0 ){
            const fallbackSnippetSummaries = extractTopResults.map((result: any) => ({
                url : result.url,
                summary : String(result.snippet || result.title || "").trim()
            })).filter((x:any) => x.summary.length > 0)

            return{
                ...input,
                pageSummaries : settledResultsPageSummaries,
                fallback : 'none' as const

            }
        }

    }
)

// Compose step
// {q, pageSummaries: [{url , summary}], mode , fallback}
// Candidate -> answer , sources , mode

