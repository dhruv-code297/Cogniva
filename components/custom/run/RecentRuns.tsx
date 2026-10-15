import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AgentRunType } from '@/app/dashboard/run/page'
import moment from 'moment'
import { Badge } from '@/components/ui/badge'
import { DotIcon } from 'lucide-react'

type Props={
    agentRunList:AgentRunType[]
}

export default function RecentRuns({agentRunList}:Props) {

    const renderStatus=(status:string)=>{
       return ( <Badge className={`${status=='completed' ? 'bg-green-100 text-green-700': status=='failed' ? 'bg-red-100 text-red-700'
        : status=='scheduled' ? 'bg-slate-100 text-slate-700' : 'bg-yellow-100 text-yellow-700'
       }`}>
           <DotIcon /> {status}
        </Badge> )
    }

  return (
    <div className='mt-12 '>
        <h2 className='text-2xl font-bold'>Recent Runs</h2>
        <div className='py-2 mt-3 border rounded-2xl'>
    <Table className=''>
  <TableCaption>All recent agents log</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">Agent</TableHead>
      <TableHead>Task</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="">Updated</TableHead>
      <TableHead className="">Result</TableHead>
      <TableHead className="text-right">Action</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {agentRunList.map((run,index)=>(
 <TableRow key={index} className=''>
      <TableCell className="font-medium p-5">{run?.name}</TableCell>
      <TableCell className='truncate max-w-[200px]'>{run.task}</TableCell>
      <TableCell>{renderStatus(run.status)}</TableCell>
      <TableCell>{run.completedAt ? moment(run.completedAt).fromNow() : moment(run.createdAt).fromNow()}</TableCell>
      <TableCell className='text-blue-600 hover:cursor-pointer'>View</TableCell>
    </TableRow>
    ))}

  </TableBody>
</Table>
</div>
    </div>
  )
}
