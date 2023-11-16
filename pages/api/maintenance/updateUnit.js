import connectMongo from "../../../lib/mongodb";
import unitModel from "../../../lib/schemas/maintenance/unitSchema";

export default async function createUnits(req, res) {
  const filter = {number: req.body.number}
  const update = req.body
  console.log('this is the filter:')
  console.log(filter)
  console.log('this is the update:')
  console.log(update)
  try {
    await connectMongo()
    let mongoResponse = await unitModel.findOneAndUpdate(filter,update)
    console.log(mongoResponse)
    res.json({ mongoResponse })
  } catch(error) {
    console.log(error)
    res.json({error})
  }
}