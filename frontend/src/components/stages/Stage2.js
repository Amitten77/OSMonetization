"use client"
import React from 'react'
import DeserveMore from '../DeserveMore'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import DeserveLess from '../DeserveLess'

const Stage2 = ({stage}) => {

  const [index, setIndex] = useState(0)

  const handleClick = (arg) => {
    console.log(index)
    if (arg === -1) {
      if (index != 0) {
        setIndex(index - 1);
      }
    }
    if (arg == 1) {
      if (index != 2) {
        setIndex(index + 1);
      }
    }
  }

  let slide = <p>Place Holder</p>
  if (index === 0) {
    slide = <DeserveMore></DeserveMore>
  } else if (index === 1) {
    slide = <DeserveLess num={1}></DeserveLess>
  } else if (index === 2) {
    slide = <DeserveLess num={2}></DeserveLess>
  }

  return (
    <div>
    <div>
      <div className='flex flex-row justify-between'>
        <h2 className="mt-auto font-semibold leading-7 text-gray-900">Stage {stage}</h2>
        <nav className="isolate -space-x-px rounded-md shadow-sm mr-16" aria-label="Pagination">
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
      </div>
          <p className="mt-4 text-sm leading-6 text-gray-600 mr-8">
            Welcome to Stage {stage} of the Process! In this stage you'll have 24 hours to make your case on why you deserve more or a couple of other users deserve less. 
          </p>
  </div>
  <div className='mr-16 mt-2'>
  {slide}
  </div>
    </div>
  )
}

export default Stage2