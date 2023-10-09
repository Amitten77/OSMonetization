"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios'
import Web3 from 'web3'
import useAccount from '@/contexts/AuthContext';




const CLIENT_ID =  process.env.CLIENT_ID || "None";


function loginWithGithub() {
  window.location.assign("https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID)
}

export default function Home() {
  const [userData, setUserData] = useState({})
  const [inputURL, setInputURL] = useState('');
  const [pyData, setpyData] = useState('nothing here yet')
  const {account, changeAccount} = useAccount()
  const [rerender, setRerender] = useState(false)


  const handleInputChange = (e) => {
    setInputURL(e.target.value);
  };

  useEffect(() => {
    const loadWeb3 = async () => {
      // Modern dapp browsers...
      if (window.ethereum) {
        const temp = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (temp) {
          changeAccount(temp)
          console.log(account, temp)
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
            setRerender(!rerender)
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
      setUserData(data)
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Input Value:', inputURL);
    const reqStr = 'http://127.0.0.1:5000/flask/hello?url=' + inputURL
    axios.get(reqStr).then(response => {
      console.log("SUCCESS", response)
      setpyData(response.data.message)
    }).catch(error => {
      console.log(error)
    })
    setInputURL('');
  };


  return (
    <div>
    <p>Enter Github URL Here: </p>
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputURL}
        onChange={handleInputChange}
        placeholder="Enter text here"
      />
      <button type="submit">Submit</button>
    </form>
    <div>
      <h1>DATA:</h1>
      <p>{pyData}</p>
      <h1>Metamask Account:</h1>
      <p>{account}</p>
    </div>
    <div>
      <button onClick={loginWithGithub}>
        Login with Github
      </button>
        {localStorage.getItem("accessToken") ? 
        <>
        <button onClick={() => {localStorage.removeItem("accessToken"); setRerender(!rerender);}}>
          Log Out
        </button>
        <button onClick={getUserData}>
          Get User Data
        </button>
        {Object.keys(userData).length !== 0 ? 
        <>
        <p>Hey there</p>
        <p>{JSON.stringify(userData)}</p>
        </>
        :
        <>
        No user data
        </>
        }
        </>
        :
        <>
        <p>User is not logged in with Github</p>
        </>      
      }
    </div>
  </div>
  )
}
