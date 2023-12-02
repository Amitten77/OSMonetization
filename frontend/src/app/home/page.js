"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios'
import Web3 from 'web3'
import { OSMonetization } from '@/components/abi';
import Swal from 'sweetalert2';


const CONTRACT_ABI = OSMonetization;
const CONTRACT_ADDRESS = '0x7A17237d99C0c2032BdED702e60a4aACF2152809'
const web3 = new Web3(window.ethereum);
const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
const PYSERVER = "https://webservice-github-fetch.onrender.com/"


export default function Home() {
  
  const [inputURL, setInputURL] = useState('');
  const [loading, setLoading] = useState(false)




  const handleInputChange = (e) => {
    setInputURL(e.target.value);
  };
  

  const handleSubmit = async (e) => {
    if (!contract) {
        console.error("Contract not initialized");
        return;
    }
    e.preventDefault();
    console.log('Input Value:', inputURL);
    const reqStr = PYSERVER + 'flask/hello?url=' + inputURL;
    
    try {
        setLoading(true)
        console.log("HEY")
        const response = await axios.get(reqStr);
        console.log("SUCCESS", response)
        const dataString = response.data.message;
        
        // Extract the number of days
        const daysRegex = /Total # of Days this project has been worked on for: (\d+)/;
        const daysMatch = dataString.match(daysRegex);
        const totalDays = daysMatch ? parseInt(daysMatch[1]) : null;

        // Extract and parse the contributors' data
        const contributorsRegex = /Map of Contributors to \[# of commits, days worked, changes made\]: ({.*})/;
        const contributorsMatch = dataString.match(contributorsRegex);
        const contributorsData = contributorsMatch ? JSON.parse(contributorsMatch[1].replace(/'/g, "\"")) : null;

        // Create the lists
        let names = [];
        let commits = [];
        let daysWorked = [];
        let changesMade = [];

        if (contributorsData) {
            Object.entries(contributorsData).forEach(([name, values]) => {
                if (name.indexOf(" ") == -1) {
                    names.push(name);
                    commits.push(values[0]);
                    daysWorked.push(values[1]);
                    changesMade.push(values[2]);
                }
            });
        }

        const accounts = await web3.eth.getAccounts();
        const account = accounts[0]; // The first account in MetaMask
        const transactionResult = await contract.methods.createRepo(inputURL, names, commits, changesMade, daysWorked, totalDays).send({from: account });
        console.log("Transaction successful: ", transactionResult);
        Swal.fire({
          title: "Success!",
          text: "Repository has successfully been added to Ongoing Contracts",
          icon: "success"
        })
        setLoading(false)
    } catch (error) {
        console.error("Error in transaction or fetching data: ", error);
        setLoading(false)
    }

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
        { loading ? 
        <div>
        <div className="flex justify-between mb-1">
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-16">
          <div className="bg-blue-600 h-2.5 rounded-full loading-bar"></div>
      </div> </div> : <div></div>
      }
      </div>
    </div>
  )
}
