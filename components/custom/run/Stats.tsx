import React from 'react'

type Props={
    completed:number | undefined,
    failed:number | undefined,
    scheduled:number | undefined
}

export default function Stats({completed,failed,scheduled}:Props) {
  return (
    <div className='mt-8 grid grid-cols-2 md:grid-cols-3 gap-5'>
      <div className='flex justify-between p-3 border rounded-xl'>
        <div className='flex items-center gap-1.5'>
        <div className='h-3 w-3 bg-green-600 rounded-full'>
        </div>
        <h2>Completed</h2>
        </div>
        <h2>{completed}</h2>
      </div>

      <div className='flex justify-between p-3 border rounded-xl'>
        <div className='flex items-center gap-1.5'>
        <div className='h-3 w-3 bg-red-600 rounded-full'>
        </div>
        <h2>Failed</h2>
        </div>
        <h2>{failed}</h2>
      </div>

      <div className='flex justify-between p-3 border rounded-xl'>
        <div className='flex items-center gap-1.5'>
        <div className='h-3 w-3 bg-blue-600 rounded-full'>
        </div>
        <h2>Scheduled</h2>
        </div>
        <h2>{scheduled}</h2>
      </div>
    </div>
  )
}
