import { db, tools } from "@/db";
import { composio } from "@/lib/composio";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){

    const user = await currentUser();
    
    //get all tools from db
    const toolsResult = await db.select().from(tools)
    .where(eq(tools.status,'active'));

    const slugs = toolsResult.map((tool)=>tool.slug)

    //get user connected tools list using composio
    const accounts = await composio.connectedAccounts.list({
        userIds:[user?.primaryEmailAddress?.emailAddress??''],
        toolkitSlugs:slugs
    })

    const integrations = toolsResult.map((tool)=>{
        const toolAccount = accounts.items.find((account)=>
            account.toolkit.slug.toLowerCase()==tool.slug
        )

        return{
            ...tool,
            account:toolAccount??null,
            connected:toolAccount?.status=='ACTIVE' ? 'Connected' : 'Not Connected'
        }
    })

return NextResponse.json(integrations);

}