// cheap mode
// call tavily , fetch , sumarize -> we will not do these
// Simpley ask the model directly. 
// Get a short helpful ans.

import { RunnableLambda } from "@langchain/core/runnables";
import { candidate } from "./types";
import { getChatModel } from "../shared/model";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export const directBasedPath = RunnableLambda.from(
    async (input: {q: string ; mode : 'web'|'direct'}) : Promise<candidate>=> {
        const model = getChatModel({temperature : 0.2})

        const res = await model.invoke(
            [
                new SystemMessage(
                    [
                        "you ans briefly and clearly for biggners",
                        "If you are unsure say so"
                    ].join('\n')
                ),
                new HumanMessage(input.q),
            ]
        )
        const directAns = (
                typeof res.content === 'string' ?
                res.content : String(res.content)
            ).trim();

        return{
            answer: directAns,
            sources : [],
            mode: 'direct'
        }
    }
)