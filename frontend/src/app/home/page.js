"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios'
import Web3 from 'web3'
import useAccount from '@/contexts/AuthContext';
import secureLocalStorage from 'react-secure-storage';
import Swal from 'sweetalert2';





export default function Home() {
  
  const [inputURL, setInputURL] = useState('');
  const [pyData, setpyData] = useState('nothing here yet')
  const {account, changeAccount} = useAccount()
  const {gitAccount, changeGitAccount} = useAccount()
  const [loading, setLoading] = useState(true);



  const handleInputChange = (e) => {
    setInputURL(e.target.value);
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(false);
    console.log('Input Value:', inputURL);
    const reqStr = 'http://127.0.0.1:5000/flask/hello?url=' + inputURL
    axios.get(reqStr).then(response => {
      console.log("SUCCESS", response)
      setpyData(response.data.message)
      setLoading(true);
      Swal.fire(
        'Congrats!',
        'Your Repository has been added into the System! Click on Ongoing Contracts to continue the process.',
        'success'
      )
    }).catch(error => {
      console.log(error)
    })
    setInputURL('');
  };


  return (
    <div className="mx-auto max-w-lg">
      {loading ? 
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
            type="text"
            name="url"
            id="url"
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
        <p>{pyData}</p>
      </div> :
      <div className="flex items-center justify-center h-screen">
          <button disabled type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
          <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
          </svg>
          Loading...
        </button>
        </div>
      }
    </div>
  )
}
