"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios'
import Web3 from 'web3'
import useAccount from '@/contexts/AuthContext';
import secureLocalStorage from 'react-secure-storage';





export default function Home() {
  
  const [inputURL, setInputURL] = useState('');
  const [pyData, setpyData] = useState('nothing here yet')
  const {account, changeAccount} = useAccount()
  const {gitAccount, changeGitAccount} = useAccount()



  const handleInputChange = (e) => {
    setInputURL(e.target.value);
  };
  

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


  // return (
  //   <div>
  //   <p>Enter Github Repository URL Here: </p>
  //   <form onSubmit={handleSubmit}>
  //     <input
  //       type="text"
  //       value={inputURL}
  //       onChange={handleInputChange}
  //       placeholder="Enter text here"
  //     />
  //     <button type="submit">Submit</button>
  //   </form>
  // </div>
  // )
  return (
    <div className="mx-auto max-w-lg">
      <div>
        <div className="text-center mt-32">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.813 2.602 9.288 6.286M30 14a6 6 0 11-12 0 6 6 0 0112 0zm12 6a4 4 0 11-8 0 4 4 0 018 0zm-28 0a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <h2 className="mt-2 text-base font-semibold leading-6 text-gray-900">Enter Github URL Here</h2>
          <p className="mt-1 text-sm text-gray-500">
            Want to start the process of splitting the profits? Enter your Github URL here, and your contribuitors will be notified too!
          </p>
        </div>
        <form action="#" className="mt-6 flex" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            id="email"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder=" Enter your Github Repository URL"
            value={inputURL}
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className="ml-4 flex-shrink-0 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}
