import connectMongo from "../../lib/mongodb";
import jobModel from "../../lib/schemas/Job"

//request body must have a job number

export default async function deleteJob(req, res) {
  try {
    console.log('connecting to mongo')
    await connectMongo()
    console.log('connected to mongo')

    console.log('deleting document')
    console.log(req.body)
    let mongoResponse = await jobModel.findByIdAndDelete(req.body)
    console.log('deleted document')
    console.log(mongoResponse)
    res.json({ mongoResponse })
  } catch(error) {
    console.log(error)
    res.json({error})
  }
}