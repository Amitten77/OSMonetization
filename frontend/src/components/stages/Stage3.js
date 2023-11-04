"use client"
import React from 'react'
import { useState } from 'react'
import CaseForLess from '../CaseForLess'
import CaseForMore from '../CaseForMore'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'


  const case_file = [{
    username: 'vikram',
    percent: 50.5,
    description: "Please Boss",
    imgSrc: "IlliniBlockchainLogo.png",
    type: "more"
  },
  {
    username: 'vikram1',
    user_against: 'blegh',
    percent: 50.5,
    description: "Please Boss",
    imgSrc: "IlliniBlockchainLogo.png",
    type: "less"
  },
  {
    username: 'vikram2',
    user_against: 'blegh',
    percent: 50.5,
    description: "Please Boss",
    imgSrc: "IlliniBlockchainLogo.png",
    type: "less"
  },
  {
    username: 'vikram3',
    percent: 50.5,
    description: "Please Boss",
    imgSrc: "IlliniBlockchainLogo.png",
    type: "more"
  },
  ]


const Stage3 = ({stage}) => {
  const [currCase, setCurrCase] = useState(0);

  const handleClick = (arg) => {
    console.log(currCase)
    if (arg === -1) {
      if (currCase != 0) {
        setCurrCase(currCase - 1);
      }
    }
    if (arg == 1) {
      if (currCase != case_file.length - 1) {
        setCurrCase(currCase + 1);
      }
    }
  }


  return (
    <div>
      <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
      <button
        onClick={() => handleClick(-1)}
        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
      >
        <span className="sr-only">Previous</span>
        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
      </button>
      {/* Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" */}
      <button
        onClick={() => handleClick(1)}
        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
      >
        <span className="sr-only">Next</span>
        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
      </button>
    </nav>
      {currCase >= case_file.length ? <p>No action required</p> : 
      case_file[currCase].type=="more" ? <CaseForMore currcase={case_file[currCase]} stage={stage}></CaseForMore> : <CaseForLess currcase={case_file[currCase]} stage={stage}></CaseForLess>}
    </div>
  )
}

export default Stage3