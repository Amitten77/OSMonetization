'use client'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid'

const statuses = {
  "No Action Required": 'text-green-700 bg-green-50 ring-green-600/20',
  Withdraw: 'text-gray-600 bg-gray-50 ring-gray-500/10',
  "Action Required": 'text-red-700 bg-red-50 ring-red-600/10',
}
const clients = [
  {
    id: 1,
    name: 'Tuple',
    imageUrl: 'https://tailwindui.com/img/logos/48x48/tuple.svg',
    status: 'Action Required', 
    date: 'December 13, 2022', 
    dateTime: '2022-12-13'
  },
  {
    id: 2,
    name: 'SavvyCal',
    imageUrl: 'https://tailwindui.com/img/logos/48x48/savvycal.svg',
    status: 'Action Required', 
    date: 'December 13, 2022', 
    dateTime: '2022-12-13'
  },
  {
    id: 3,
    name: 'Reform',
    imageUrl: 'https://tailwindui.com/img/logos/48x48/reform.svg',
    status: 'Action Required', 
    date: 'December 13, 2022', 
    dateTime: '2022-12-13'
  },
  {
    id: 4,
    name: 'Reform',
    imageUrl: 'https://tailwindui.com/img/logos/48x48/reform.svg',
    status: 'No Action Required', 
    date: 'December 13, 2022', 
    dateTime: '2022-12-13'
  },
  {
    id: 5,
    name: 'Reform',
    imageUrl: 'https://tailwindui.com/img/logos/48x48/reform.svg',
    status: 'No Action Required', 
    date: 'December 13, 2022', 
    dateTime: '2022-12-13'
  },
  {
    id: 6,
    name: 'Reform',
    imageUrl: 'https://tailwindui.com/img/logos/48x48/reform.svg',
    status: 'No Action Required', 
    date: 'December 13, 2022', 
    dateTime: '2022-12-13'
  },
  {
    id: 7,
    name: 'Reform',
    imageUrl: 'https://tailwindui.com/img/logos/48x48/reform.svg',
    status: 'No Action Required', 
    date: 'December 13, 2022', 
    dateTime: '2022-12-13'
  },
  {
    id: 8,
    name: 'Reform',
    imageUrl: 'https://tailwindui.com/img/logos/48x48/reform.svg',
    status: 'No Action Required', 
    date: 'December 13, 2022', 
    dateTime: '2022-12-13'
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Contracts() {
  return (
    <div>
      <h1 className='mt-16 ml-2 text-lg font-bold'>Your Contracts in the Making!</h1>
      <ul role="list" className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8 mt-4">
        {clients.map((client) => (
          <li key={client.id} className="overflow-hidden rounded-xl border border-gray-200">
            <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
              <div className="text-sm font-medium leading-6 text-gray-900">{client.name}</div>
              <div
                    className={classNames(
                      statuses[client.status],
                      'rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset'
                    )}
                  >
                    {client.status}
              </div>
              <Menu as="div" className="relative ml-auto">
                <Menu.Button className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Open options</span>
                  <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href={"/home/contracts/" + client.id}
                          className={classNames(
                            active ? 'bg-gray-50' : '',
                            'block px-3 py-1 text-sm leading-6 text-gray-900'
                          )}
                        >
                          View<span className="sr-only">, {client.name}</span>
                        </a>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
            <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Current Stage</dt>
                <dd className="text-gray-700">
                  <time dateTime={client.dateTime}>{client.id}</time>
                </dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Time Until Next Stage</dt>
                <dd className="flex items-start gap-x-2">
                  <div className="font-medium text-gray-900">10 hours</div>
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  )
}