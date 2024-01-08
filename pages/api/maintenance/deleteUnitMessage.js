import connectMongo from "../../../lib/mongodb";
import unitModel from "../../../lib/schemas/maintenance/unitSchema";

export default async function createUnits(req, res) {
  const filter = {number: req.body.unit}

  console.log('this is the filter:')
  console.log(filter)
  try {
    await connectMongo()
    let mongoResponse = await unitModel.findOneAndUpdate(
      filter,
      { $pull: { messages: { _id: req.body.message_id} } },
      { new: true}
      )
    console.log(mongoResponse)
    res.status(200).json(mongoResponse)
  } catch(error) {
    console.log(error)
    res.json({error})
  }
}