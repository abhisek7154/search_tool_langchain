

// web -> webPath
// directPath

import { RunnableBranch, RunnableSequence } from "@langchain/core/runnables";
import { webBasedPath } from "./webPipeline";
import { directBasedPath } from "./directPipeline";
import { routerStep } from "./routeStrategy";
import { finalValidateAndPolish } from "./finalValidate";
import { SearchInput } from "../utils/schemas";

// final validation
// JSON

// LCEL ->
// A , B , C

const branch = RunnableBranch.from<{q: string; mode: 'web' | 'direct'} , any>(
    [
        [(input) => input.mode === 'web' , webBasedPath],
        directBasedPath
    ]
)

export const searchChain = RunnableSequence.from([
    routerStep,
    branch,
    finalValidateAndPolish
])

export async function runSearch(input: SearchInput){
    return await searchChain.invoke(input)
}