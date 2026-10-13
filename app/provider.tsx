"use client"
import { UserDetailContext } from '@/context/UserDetailContext';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

function Provider ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)  {

const [userDetail,setUserDetail] = useState()
const { isLoaded, isSignedIn } = useUser();

useEffect(()=>{
    if (isLoaded && isSignedIn) {
      createNewUser();
    }
},[isLoaded, isSignedIn])

    const createNewUser = async ()=>{
      try {
        const result = await axios.post('/api/users')
        setUserDetail(result.data)
      } catch (error) {
        console.error('Failed to load the current user', error)
      }
    }
  return (
    <div>
        <UserDetailContext.Provider value={{userDetail,setUserDetail}}>
      {children}
        </UserDetailContext.Provider>
    </div>
  )
}

export default Provider
