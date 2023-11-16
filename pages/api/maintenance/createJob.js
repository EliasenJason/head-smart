import connectMongo from "../../../lib/mongodb";
import jobModel from "../../../lib/schemas/maintenance/jobSchema";

export default async function createJob(req, res) {
  try {
    await connectMongo()
    let mongoResponse = await jobModel.create(
      req.body
    )
    console.log(mongoResponse)
    res.json({ mongoResponse })
  } catch(error) {
    console.log(error)
    res.json({error})
  }
}