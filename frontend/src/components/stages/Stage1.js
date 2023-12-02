import React, { useState } from 'react'

const people = [
  {
    name: 'sw4th1'
  }, 
  {
    name: 'nzhan2'
  },
  {
    name: 'yaogurt7'
  },
  {
    name: 'Amitten77'
  }
]

const Stage1 = ({actionRequired}) => {

  const handleClick  = () => {
    setId(id + 1);
  }

  const [id, setId] = useState(0);
  let person = people[id]
  if (id >= people.length) {
    actionRequired = false
  }
  return (
    <div>
        <h1 className='font-bold text-center text-2xl mb-4'>Welcome to the Contract Creation Stage (Stage 1)!</h1>
        <p className='text-center mb-16'>The first step of the process is to vote on users you believe are worthy versus users you don't believe deserve earn a share of the profits</p>
        {actionRequired ? 
          <div className=''>
         <ul role="list" className="grid grid-cols-1 gap-6">
         {
           <li
             key={person.name}
             className="flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center place-self-center shadow w-3/5"
           >
             <div className="flex flex-1 flex-col p-8">
               <img className="mx-auto h-32 w-32 flex-shrink-0 rounded-full" src={"https://github.com/" + person.name  +".png"} alt="" />
               <h3 className="mt-6 text-sm font-medium text-gray-900">{person.name}</h3>
             </div>
             <div>
               <div className="-mt-px flex divide-x divide-gray-200 text-center">
                 <button className="flex w-0 flex-1 text-center justify-center" onClick={handleClick}>
                    Yes
                 </button>
                 <button className="-ml-px flex w-0 flex-1 text-center justify-center" onClick={handleClick}>
                    Maybe
                 </button>
                 <button className="-ml-px flex w-0 flex-1 text-center justify-center" onClick={handleClick}>
                    No
                 </button>
               </div>
             </div>
           </li>
         }
       </ul>
       </div> :
        <p>No Action Required</p>
        }
    </div>
  )
}

export default Stage1