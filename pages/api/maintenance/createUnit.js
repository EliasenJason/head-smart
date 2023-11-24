import connectMongo from "../../../lib/mongodb";
import unitModel from "../../../lib/schemas/maintenance/unitSchema";

export default async function createUnit(req, res) {
  try {
    await connectMongo()
    let mongoResponse = await unitModel.create(
      req.body
    )
    // console.log(mongoResponse)
    res.json({ mongoResponse })
  } catch(error) {
    console.log(error.code)
    res.json({error})
  }
}