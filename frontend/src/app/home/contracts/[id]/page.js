"use client"
import { useRouter } from 'next/navigation'
import RepoInfo from '@/components/RepoInfo';
import Stage1 from '@/components/stages/Stage1';
import Stage2 from '@/components/stages/Stage2';
import Stage3 from '@/components/stages/Stage3';
import Stage8 from '@/components/stages/Stage8';
import Timeline from '@/components/Timeline';

const people = [
  {
    name: 'Amitten77',
    percent: 13.5,
  },
  {
    name: 'kavpurana',
    percent: 20.1
  },
  {
    name: 'dkulgod',
    percent: 50.9
  },
  {
    name: 'eziCode',
    percent: 15.5
  }
]
 
export default function Page() {
  const router = useRouter()

  const url = window.location.href;

  const parts = url.split('/');
  const stage = parts[parts.length - 1].split('#')[0].split('?');

  console.log(stage)
  const repo = "Crossy Tractor"

  let currentStage = <div>PlaceHolder.</div>;
  if (stage == 1) {
    currentStage = <Stage1 actionRequired={true}></Stage1>
  } else if (stage == 2 || stage == 4 || stage == 6) {
    currentStage = <Stage2></Stage2>
  } else if (stage == 3 || stage == 5 || stage == 7) {
    currentStage = <Stage3></Stage3>
  } else if (stage == 8) {
    currentStage = <Stage8></Stage8>
  }
  
  return <div className='ml-6'>
    <button
        type="button"
        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ml-2 mt-2"
      >
       <a href="/home/contracts">Back to Contracts</a>
      </button>
    <div className='grid grid-cols-3'>
      <RepoInfo people={people} repo={repo}></RepoInfo>
      <Timeline curr_stage={stage}></Timeline>
      <div>
        {currentStage}
      </div>
    </div>
  </div>
}