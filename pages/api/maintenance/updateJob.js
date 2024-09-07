import connectMongo from "../../../lib/mongodb";
import jobModel from "../../../lib/schemas/maintenance/jobSchema";

export default async function updateJob(req, res) {
  try {
    await connectMongo()
    //filter: {jobNumber: *string*}
    const filter = {jobNumber: req.body.jobNumber}
    const update = req.body
    console.log(filter)
    console.log(update)
    let mongoResponse = await jobModel.findOneAndUpdate(filter,update)
    console.log(mongoResponse)
    res.json({ mongoResponse })
  } catch(error) {
    console.log(error)
    res.json({error})
  }
}