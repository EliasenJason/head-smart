import connectMongo from "../../../lib/mongodb";
import jobModel from "../../../lib/schemas/maintenance/jobSchema";

export default async function deleteJob(req, res) {
  const filter = {jobNumber: req.body}
  console.log(filter)
  try {
    await connectMongo()
    let mongoResponse = await jobModel.findOneAndDelete(
      filter
    )
    console.log(mongoResponse)
    res.json({ mongoResponse })
  } catch(error) {
    console.log(error)
    res.json({error})
  }
}