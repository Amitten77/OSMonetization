'use client'
import React from 'react'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import useAccount from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import  secureLocalStorage  from  "react-secure-storage";
import Web3 from 'web3'


export default function HomeLayout({children,}) {

    async function getUserData() {
      await fetch("http://localhost:4000/getUserData", {
          method: "GET", 
          headers: {
          "Authorization": "Bearer " + secureLocalStorage.getItem("accessToken")//Bearer ACCESSTOKEN
          }
      }).then((response) => {
          return response.json();
      }).then((data) => {
          changeGitAccount(data)
      })
    }

    const {account, changeAccount, gitAccount, changeGitAccount} = useAccount()
    const router = useRouter();
    useEffect(() => {
      /*const shouldRedirect = (secureLocalStorage.getItem('accessToken') == null)  
      if (shouldRedirect) {
        router.push('/');
      } else {*/
        const loadWeb3 = async () => {
          // Modern dapp browsers...
          if (window.ethereum) {
            const temp = await window.ethereum.request({ method: 'eth_requestAccounts' });
            if (temp) {
              changeAccount(temp)
            }
          }
          // Legacy dapp browsers...
          else if (window.web3) {
              window.web3 = new Web3(window.web3.currentProvider);
          }
          // Non-dapp browsers...
          else {
              window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
          }
        }
        loadWeb3().catch(console.error)
        getUserData();
      //}
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
