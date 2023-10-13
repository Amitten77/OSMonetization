'use client'
import React from 'react'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import useAccount from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import  secureLocalStorage  from  "react-secure-storage";


export default function HomeLayout({children,}) {

    const {gitAccount, changeGitAccount} = useAccount()
    const router = useRouter();
    useEffect(() => {
      const shouldRedirect = (secureLocalStorage.getItem('accessToken') == null)  
      if (shouldRedirect) {
        router.push('/');
      }
    }, []);
    return (
    <>
    <main>
    <Navbar username={gitAccount.login} imageURL={gitAccount.avatar_url} name={gitAccount.name}></Navbar>
        {children}
    </main>
    </>
  )
}
