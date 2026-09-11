import { NextRequest, NextResponse } from "next/server";
import {GoogleGenAI, ThinkingLevel} from '@google/genai'
import { AgentConfigSystemPrompt } from "@/data/Prompt";
import { AgentConfigRespSchema } from "@/data/ResponseSchema";
import { db, tools } from "@/db";

export async function POST(req:NextRequest){
    const {prompt} = await req.json();
    if(!prompt.trim()){
        return NextResponse.json({error:'Prompt is required'},{status:400})
    }

    const apiKey = process.env.GOOGLE_CLOUD_GEMINI_API_KEY;
    try {

        const aiTools =  await db.select({
            slug:tools.slug
        }).from(tools)

        const ai = new GoogleGenAI({apiKey});
        const response  = await ai.models.generateContent({
            model:'gemini-3.5-flash',
            contents:AgentConfigSystemPrompt.replace('{USER_PROMPT}',prompt).replace('{AVAILABLE_TOOLS}',aiTools.toString()),
            config:{
                thinkingConfig:{thinkingLevel:ThinkingLevel.LOW},
                responseMimeType:'application/json',
                responseSchema:AgentConfigRespSchema
            }
        })
        return NextResponse.json(JSON.parse(response.text??'{}'));
    } catch (e) {
        console.error('Error',e);
        return NextResponse.json({error:e},{status:500})
    }
}