import connectMongo from "../../lib/mongodb";
import jobModel from "../../lib/schemas/Job"

//request body must have a job number

export default async function createJob(req, res) {
  try {
    console.log('createJob Route triggered')
    console.log('connecting to mongo')
    await connectMongo()
    console.log('connected to mongo')

    console.log('creating document')
    console.log(req.body)
    let mongoResponse = await jobModel.create(req.body)
    console.log('created document')
    console.log(mongoResponse)
    res.json({ mongoResponse })
  } catch(error) {
    console.log(error)
    res.json({error})
  }
}