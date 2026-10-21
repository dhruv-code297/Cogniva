"use client"
import { UserDetailContext } from '@/context/UserDetailContext';
import { useAuth, useUser } from '@clerk/nextjs';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

function Provider ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)  {

const [userDetail,setUserDetail] = useState()
const { isLoaded, isSignedIn } = useUser();
const { getToken } = useAuth();

useEffect(()=>{
    if (isLoaded && isSignedIn) {
      createNewUser();
    }
},[isLoaded, isSignedIn, getToken])

    const createNewUser = async ()=>{
      try {
        const token = await getToken();
        if (!token) {
          return;
        }

        const result = await axios.post('/api/users', undefined, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
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
