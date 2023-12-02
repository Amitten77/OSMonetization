"use client"
import React from 'react'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAccount from '@/contexts/AuthContext';
import  secureLocalStorage  from  "react-secure-storage";

const CLIENT_ID =  process.env.NEXT_PUBLIC_CLIENT_ID|| "None";
const SERVER = "https://os-monetization-auth-backend.onrender.com/"

function loginWithGithub() {
  window.location.assign("https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID)
  console.log("Hello world")
}


/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
const Login = () => {
    const {gitAccount, changeGitAccount} = useAccount()
    const router = useRouter();

    async function getUserData() {
        await fetch(SERVER + "getUserData", {
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


    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const codeParam = urlParams.get("code");
        console.log(codeParam)
        if (codeParam) {
        async function getAccessToken() {
          console.log(SERVER + "getAccessToken?code=" + codeParam)
            await fetch(SERVER + "getAccessToken?code=" + codeParam, {
            method: "GET"
            }).then((response) => {
            return response.json();
            }).then((data) => {
            console.log(data);
            if (data.access_token) {
                secureLocalStorage.setItem("accessToken", data.access_token);
                getUserData().then(() => {
                    router.push('/home');
                })
            }
            })
        }
        getAccessToken()
        console.log("SJ")
        }
    }, [])



    return (
      <>
        {/*
          This example requires updating your template:
  
          ```
          <html class="h-full bg-white">
          <body class="h-full">
          ```
        */}
        <div className="flex min-h-full flex-1 h-screen">
          <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
            <div className="mx-auto w-full max-w-sm lg:w-96">
              <div>
                <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900 text-center">
                  Welcome to Open Source Monetization!
                </h2>
                <p className="mt-2 text-lg leading-6 text-black font-semibold mb-4">
                  Our Purpose: {' '}
                </p>
                <p className="text-black">
                    For many profitable Open Source projects, it's difficult to find a fair method to split the profits between contribuitors.
                    Using the transparency and decentralization of Blockchain, Open Source Monetization is a protocol that ensures the profits are split fairly between all contribuitors, decided by the contribuitors themselves.
                    To learn more about our how Open Source Monetization Protocol works, click here. 
                  </p>
              </div>
  
              <div className="mt-10">
  
                <div className="mt-10">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm font-medium leading-6">
                      <span className="bg-white px-6 text-gray-900">Login with</span>
                    </div>
                  </div>
  
                  <div className="mt-6 gap-4">
  
                    <a
                      href="#"
                      className="flex w-full items-center justify-center gap-3 rounded-md bg-[#24292F] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F]"
                      onClick={loginWithGithub}
                    >
                      <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm font-semibold leading-6">GitHub</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative hidden w-0 flex-1 lg:block">
            <img
              className="absolute inset-0 h-full w-full object-cover"
              src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
              alt=""
            />
          </div>
        </div>
      </>
    )
  }

  export default Login
  