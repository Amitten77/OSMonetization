"use client"
import React from 'react'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAccount from '@/contexts/AuthContext';

const CLIENT_ID =  process.env.NEXT_PUBLIC_CLIENT_ID|| "None";

function loginWithGithub() {
  window.location.assign("https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID)
}




const Login = () => {


    const {gitAccount, changeGitAccount} = useAccount()
    const router = useRouter();


    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const codeParam = urlParams.get("code");
        console.log(codeParam)
        if (codeParam) {
        async function getAccessToken() {
            await fetch("http://localhost:4000/getAccessToken?code=" + codeParam, {
            method: "GET"
            }).then((response) => {
            return response.json();
            }).then((data) => {
            console.log(data);
            if (data.access_token) {
                localStorage.setItem("accessToken", data.access_token);
                getUserData().then(() => {
                    router.push('/home');
                })
            }
            })
        }
        getAccessToken()
        }
    }, [])

    async function getUserData() {
        console.log(localStorage.getItem("accessToken"))
        await fetch("http://localhost:4000/getUserData", {
            method: "GET", 
            headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken")//Bearer ACCESSTOKEN
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data)
            changeGitAccount(data)
            console.log("Hello World")
        })
        }

    
  return (
    <div>
        <h1>Welcome to Open Source Monetization!</h1>
        <button onClick={loginWithGithub}>
            Login with Github
        </button>
    </div>
  )
}

export default Login