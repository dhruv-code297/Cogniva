'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { composio } from '@/lib/composio'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

type ToolsType ={
    connected:string,
    name:string,
    icon:string,
    description:string,
    enabled:boolean,
    slug:string,
    account:any
}


export default function Integrations() {

    const {user} = useUser()

    const [toolList,setToolList] = useState<ToolsType[]>()
    const [loading,setLoading] = useState(false)

    useEffect(()=>{
        GetAllTools()
    },[])

const GetAllTools = async ()=>{
    const result = await axios.get('/api/integrations')
    setToolList(result.data)
}

const connectTool= async (slug:string)=>{
    setLoading(true)
   const result = await axios.post('/api/integrations/tool-connection',{
    slug:slug
   })
   window.open(result?.data?.redirectUrl,"_blank")
   setLoading(false)
}

const disconnectTool = async (connectedAccountId:string)=>{
    setLoading(true)
 const result = await axios.delete('/api/integrations/tool-connection',{
   data:{
    connectedAccountId
   }
   })
   GetAllTools()
   setLoading(false)
}

  return (
    <div className='p-10 md:px-10 lg:px-28'> 
      <h2 className='font-bold text-3xl'>Integrations</h2>
      <p className='mt-1 text-muted-foreground'>Connect the tools your agents need to get the work done.</p>

      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5'>
        {toolList?.map((tool,index)=>(
            <div key={index} className='p-3 border rounded-2xl'>
                <div>
                    <div className='flex items-center justify-between'>
                    <img src={tool.icon} width={35} height={35} />
                    <Badge className={`text-xs ${tool.connected=='Connected' ? 'text-green-700 bg-green-100' : 'text-gray-700 bg-gray-100'}`}>{tool.connected}</Badge>
                    </div>
                    <div className='p-3 border rounded-2xl'>
                        <h2 className='text-lg font-medium'>{tool.name}</h2>
                        <p className='line-clamp-2 text-muted-foreground'>{tool.description}</p>
                    </div>
                </div>
                <div className='mt-4'>
                    {tool.connected=='Connected' ?
                    <Button className={'w-full'} variant={'outline'} onClick={()=>disconnectTool(tool?.account?.id)}
                    disabled={loading}
                    >Disconnect</Button> : 
                    <Button className={'w-full'}  disabled={loading} onClick={()=>connectTool(tool.slug)}>Connect</Button>  }
                    </div>
            </div>
        ))}
      </div>
    </div>
  )
}
