import { RunnableLambda, RunnableSequence } from "@langchain/core/runnables";
import { webSearch } from "../utils/webSeach";
import { openUrl } from "../utils/openUrl";
import { summerize } from "../utils/summarize";
import { candidate } from "./types";
import { getChatModel } from "../shared/model";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

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
                fallback : 'snippets' as const

            }
        }
        return{
                ...input,
                pageSummaries : settledResultsPageSummaries,
                fallback : 'none' as const

            }

    }
)

// Compose step
// {q, pageSummaries: [{url , summary}], mode , fallback}
// Candidate -> answer , sources , mode

export const composeStep = RunnableLambda.from(
    async(input: {
        q: string;
        pageSummaries : Array<{url: string ; summary: string}>;
        mode: 'web'|'direct';
        fallback : 'No results' | 'snippets' | 'none'
    }): Promise<candidate>=> {
        const model = getChatModel({temperature : 0.2});

        if(!input.pageSummaries || input.pageSummaries.length === 0){
            const directResponseFromModel = await model.invoke([
                new SystemMessage(
                    [
                        "You ans briefly and clearly  for biggners",
                        "If unsure , say so"
                    ].join('\n')
                ),
                new HumanMessage(input.q)
            ]);

            const directAns = (
                typeof directResponseFromModel.content === 'string' ?
                directResponseFromModel.content : String(directResponseFromModel.content)
            ).trim()

            return{
                answer: directAns,
                sources: [],
                mode : 'direct'
            }
        }

        const res = await model.invoke(
            [
                new SystemMessage([
                    "You consisely ans questions using provided page summerises",
                    "Rules:",
                    "- Be accurate and nuetral",
                    "- 5-8 sentences max",
                    "- Use only the provided summaries",
                    "- Do not invent new facts",
                ].join("\n")
            ),
            new HumanMessage(
                [
                    `Question: ${input.q}`,
                    "summaries:",
                    JSON.stringify(input.pageSummaries , null , 2)
                ].join("\n")
            )
            ]
        )

        const finalAns = (
            typeof res.content === 'string' ? res.content : String(res.content)
        )

        const extractSources = input.pageSummaries.map(x => x.url)

        return {
            answer: finalAns,
            sources : extractSources,
            mode : 'web'
        }
    }
);

// LCEL
// WebSearchStep
// OpenAndSummarizeStep
// compose step

export const webBasedPath = RunnableSequence.from([
    webSearchStep,
    openAndSummerizeStep,
    composeStep
]);