import { useRouter } from "next/router"
import { useState } from "react"


/*
TODO:
1. fetch the job object from mongodb
2. display the job object similarly to the [job] page with units on the left and right
  -create arrows to move units up or down adjusting the unit array which in turn adjusts the displayed units
  -ability to add a unit
  -ability to remove a unit
3. update the database with the new unit arrays for left and right
4. add spinner in for when loading
5. route back to [job] page
*/

export default function AdjustJob() {
  const [jobUpdate, setJobUpdate] = useState()

  const router = useRouter()
  const { job } = router.query

  return (
    <p>{job}</p>
  )
}