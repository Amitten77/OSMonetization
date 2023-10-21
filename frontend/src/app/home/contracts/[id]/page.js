"use client"
import { useRouter } from 'next/navigation'
 
export default function Page() {
  const router = useRouter()
  return <div>
    <a href="/home/contracts">Back</a>
  </div>
}