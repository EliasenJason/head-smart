import connectMongo from "../../../lib/mongodb";
import unitModel from "../../../lib/schemas/maintenance/unitSchema";

//request body must have a job number

export default async function createUnit(req, res) {
  try {
    
    await connectMongo()
    let mongoResponse = await unitModel.create(
      req.body
    )
    console.log(mongoResponse)
    res.json({ mongoResponse })
  } catch(error) {
    console.log(error)
    res.json({error})
  }
}