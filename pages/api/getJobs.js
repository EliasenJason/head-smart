import connectMongo from "../../lib/mongodb";
import jobModel from "../../lib/schemas/Job"

//request body must have a job number

export default async function createJob(req, res) {
  try {
    console.log('connecting to mongo')
    await connectMongo()
    console.log('connected to mongo')

    console.log('creating document')
    console.log(req.body)
    let mongoResponse = await jobModel.find({})
    console.log('created document')
    console.log(mongoResponse)
    res.status(200).json(mongoResponse)
  } catch(error) {
    res.status(500).json({error: 'Error fetching data from the Database'})
  }
}