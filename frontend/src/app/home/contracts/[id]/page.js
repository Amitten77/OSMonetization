"use client"
import RepoInfo from '@/components/RepoInfo';
import Stage1 from '@/components/stages/Stage1';
import Stage2 from '@/components/stages/Stage2';
import Stage3 from '@/components/stages/Stage3';
import Stage8 from '@/components/stages/Stage8';
import Timeline from '@/components/Timeline';
import { useState, useEffect } from 'react';
import { OSMonetization } from '@/components/abi'
import Web3 from 'web3';

// const people = [
//   {
//     name: 'Amitten77',
//     percent: 13.5,
//   },
//   {
//     name: 'kavpurana',
//     percent: 20.1
//   },
//   {
//     name: 'dkulgod',
//     percent: 50.9
//   },
//   {
//     name: 'eziCode',
//     percent: 15.5
//   }
// ]
 

const CONTRACT_ABI = OSMonetization;
const CONTRACT_ADDRESS = '0x7A17237d99C0c2032BdED702e60a4aACF2152809'
const web3 = new Web3(window.ethereum);
const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);


export default function Page() {
  const [client, setClient] = useState(null);
  const [people, setPeople] = useState([]);
  // const [stage, setStage] = useState(null);
  // const [repo, setRepo] = useState(null);
  // const [currentStage, setCurrentStage] = useState(null)
  


  useEffect(() => {
    const loadBlockchainData = async () => {
    const url = window.location.href;

    const parts = url.split('/');
    const id = Number(parts[parts.length - 1].split('#')[0].split('?')[0]);
    const temp = await contract.methods.id_to_repo(id).call();
    const length = Number(temp.num_contributors);

    for (var i = 0; i < length; i++) {
      const person = await contract.methods.getRepoContributor(id, i).call();
      const percent = await contract.methods.getRepoPercent(id, i).call();
      setPeople(people => [...people, {name: person,
           percent: Number(percent)/1000}])
    }
    setClient(temp);
    }

    loadBlockchainData().catch(console.error)

  }, [])


  let stage;
  let repo;
  let currentStage;
  if (client != null) {
    stage = Number(client.stage);

    repo = client.url.split('/').pop()


    currentStage = <div>PlaceHolder.</div>;
    if (stage == 1) {
      currentStage = <Stage1 actionRequired={true}></Stage1>
    } else if (stage == 2 || stage == 4 || stage == 6) {
      currentStage = <Stage2 stage={stage}></Stage2>
    } else if (stage == 3 || stage == 5 || stage == 7) {
      currentStage = <Stage3 stage={stage}></Stage3>
    } else if (stage == 8) {
      currentStage = <Stage8></Stage8>
    }
  }
  
  return ( 
   <div>
    { client==null ? <p>Loading...</p>:
  <div className='ml-6'>
    <button
        type="button"
        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ml-1 mt-4"
      >
       <a href="/home/contracts">Back to Contracts</a>
      </button>
    <div className='grid grid-cols-4'>
      <RepoInfo people={people} repo={repo}></RepoInfo>
      <Timeline curr_stage={stage}></Timeline>
      <div className='col-span-2 justify-self-start'>
        {currentStage}
      </div>
    </div>
  </div>
}
  </div> )
}