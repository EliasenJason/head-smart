import { useRouter } from "next/router"
import { useState } from "react"

export default function AdjustJob() {
  const [jobUpdate, setJobUpdate] = useState()
  
  const router = useRouter()
  const { job } = router.query

  return (
    <p>{job}</p>
  )
}