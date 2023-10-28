"use client"
import React from 'react'
import DeserveMore from '../DeserveMore'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import DeserveLess from '../DeserveLess'

const Stage2 = () => {

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
    slide = <DeserveLess></DeserveLess>
  } else if (index === 2) {
    slide = <DeserveLess></DeserveLess>
  }

  return (
    <div>
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
  </div>
  {slide}
    </div>
  )
}

export default Stage2