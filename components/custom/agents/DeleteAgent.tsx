import React, { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import axios from 'axios'
import { toast } from '@/components/ui/toast'
import { Loader2Icon } from 'lucide-react'

type Props = {
    openAlert: boolean,
    agentId: string | undefined,
    closeAlert: (open: boolean) => void,
    refreshData: () => void
}

export default function DeleteAgent({ openAlert, agentId, closeAlert, refreshData }: Props) {
    const [loading, setLoading] = useState(false)

    const handleOpenChange = (open: boolean) => {
        if (!loading) {
            closeAlert(Boolean(open))
        }
    }

    const deleteAgent = async () => {
        if (!agentId) return;
        setLoading(true)
        try {
            const result = await axios.delete('/api/agent/configure', {
                data: { agentId }
            })
            if (result?.data?.error) {
                toast.add({
                    type: 'error',
                    title: result.data.error
                })
                return;
            }
            toast.add({
                type: 'success',
                title: 'Agent deleted successfully'
            })
            closeAlert(false);
            refreshData();
        } catch (error: any) {
            console.error("Delete agent error:", error)
            const errMsg = error?.response?.data?.error || error?.message || 'Failed to delete agent';
            toast.add({
                type: 'error',
                title: typeof errMsg === 'string' ? errMsg : 'Failed to delete agent'
            })
        } finally {
            setLoading(false);
        }
    }
    
  return (
   <AlertDialog open={Boolean(openAlert)} onOpenChange={handleOpenChange}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your Agent
        from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={() => deleteAgent()}
        disabled={loading}
        >
            {loading && <Loader2Icon className='animate-spin'/> }
            Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
  )
}
