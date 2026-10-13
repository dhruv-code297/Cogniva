"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { CreatedAgentType } from './CreateAgent'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import {  CalendarClockIcon, Ellipsis, MessageCircle, Pause, Pencil, Play, PlaySquareIcon, Trash } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import AgentEditSheet from './AgentEditSheet'
import AgentChatDrawer from './AgentChatDrawer'
import DeleteAgent from './DeleteAgent'
import { toast } from '@/components/ui/toast'


export default function MyAgents() {

    const [myAgents,setMyAgents] = useState<CreatedAgentType[] | null>()
    const [openEditAgentSheet,setOpenEditAgentSheet]  = useState(false)
    const [selectedEditAgent,setSelectedEditAgent] = useState<CreatedAgentType | null>(null)
    const [openChatDrawer,setOpenChatDrawer] = useState(false)
    const [openDeleteAlert,setOpenDeleteAlert] = useState(false)
    const [selectedAgentId,setSelectedAgentId] = useState<string>();

    useEffect(()=>{
        AllUsersAgent()
    },[])

//fetching all users
const AllUsersAgent = async ()=>{
    const result = await axios.get('/api/agent/configure')
    setMyAgents(result.data)
}

const updateAgentStatus = async (agentConfig:CreatedAgentType)=>{
  const result = await axios.put('/api/agent/configure',{
    ...agentConfig,
    status: agentConfig?.status=='active' ? 'pause' : 'active'
  });
  AllUsersAgent()
}

const runAgent = async (agent:CreatedAgentType)=>{
  const result = await axios.post("/api/agent/run",{
    agentConfig:agent,
    agentId:agent?.agentId,
    input:null
  })
  if(result.data.error){
    toast.add({
      type:'error',
      title:result.data.error
    })
    return;
  }
  toast.add({
    title:'Agent Running...',
    type:'success'
  })
}

  return (
    <div className='mt-5'>
      <h2 className='font-bold text-2xl'>My Agents</h2>
      <p className='text-sm text-muted-foreground mt-1'>Run, Manage and Update All the agents you've created.</p>
      <div className='grid grid-cols-2 2xl:grid-cols-2 gap-5 mt-5 '>
        {myAgents?.map((agent,index)=>(
            <div key={index} className='p-2 border rounded-2xl'>
                <div className='flex  justify-between items-center '>
                    <img src={agent?.agentImage} alt={agent.name} width={30} height={30} className='p-2 size-16 border rounded-xl bg-slate-100' />
                
                <div>
                     <DropdownMenu>
  <DropdownMenuTrigger
    aria-label="Agent actions"
    className="inline-flex size-9 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
  >
    <Ellipsis className="size-4" />
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuGroup>
      
      <DropdownMenuItem onClick={()=>runAgent(agent)}><Play/> Run Now</DropdownMenuItem>
      <DropdownMenuItem onClick={()=>updateAgentStatus(agent)}>
        {agent?.status=='active' ?<span className='flex items-center gap-1'><Pause/> Pause Agent</span> : <span className='flex items-center gap-1'><PlaySquareIcon/> Active Agent</span>}
        </DropdownMenuItem>
      <DropdownMenuItem onClick={()=>{setOpenEditAgentSheet(true);setSelectedEditAgent(agent)}}>
<Pencil/> Edit Agent
        </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      <DropdownMenuItem onClick={()=>{setOpenDeleteAlert(true); setSelectedAgentId(agent.agentId)}} variant='destructive'><Trash/> Delete Agent</DropdownMenuItem> 
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>
                </div>
            </div>
            <div className='my-2'>
                <h2 className='font-bold flex gap-2'>{agent.name}
                     <span className={`font-normal  px-1 py-0.5 text-xs rounded-2xl ${agent?.status=='pause' ? 'bg-yellow-100 text-yellow-700' : 'text-green-700 bg-green-100'}`}>
                      {(agent.status.toUpperCase())}</span></h2>
                     <p className='line-clamp-1 mt-1 '>{agent?.description}</p>
            <div className='flex gap-1 items-center mt-4 '>
                <CalendarClockIcon className='h-4 w-4 text-purple-700'/>
                <p className='text-xs text-muted-foreground'>{agent?.schedule?.frequency}
                    {agent?.schedule.type=='recurring' && <span>
                    &nbsp; at {agent?.schedule.time}
                    </span>}
                    </p>
            </div>
            <Separator className={'my-3'}/>
            <div className='flex items-center gap-2.5 w-full'>
            <Button variant={'outline'} className={'flex-1 mt-2 '}>
                <Play/> Run Agent
            </Button>
            <Button onClick={()=>{setOpenChatDrawer(true);setSelectedEditAgent(agent)}} className={'bg-purple-700 flex-1 mt-2 '}>
                <MessageCircle/> Chat With Agent
            </Button>
            </div>
            </div>
      
        </div>
        ))}
                {openEditAgentSheet && <AgentEditSheet agentConfig={selectedEditAgent} setUpdatedAgent={()=>AllUsersAgent()} 
                openSheet_={openEditAgentSheet}
                closeSheet={(v:boolean)=>setOpenEditAgentSheet(v)}
                />}

            <AgentChatDrawer
            agent={selectedEditAgent}
            open={openChatDrawer}
            onOpenChange={setOpenChatDrawer}
            />

            <DeleteAgent openAlert={openDeleteAlert}
            closeAlert={(v:any)=>setOpenDeleteAlert(v)}
            agentId={selectedAgentId}
            refreshData={()=>AllUsersAgent()}
            /> 
      </div>
    </div>
  )
}
