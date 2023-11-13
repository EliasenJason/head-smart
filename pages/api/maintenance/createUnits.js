import connectMongo from "../../../lib/mongodb";
import unitModel from "../../../lib/schemas/maintenance/unitSchema";

export default async function createUnits(req, res) {
  try {
    
    await connectMongo()
    let mongoResponse = await unitModel.insertMany(
      req.body
    )
    console.log(mongoResponse)
    res.json({ mongoResponse })
  } catch(error) {
    console.log(error)
    res.json({error})
  }
}