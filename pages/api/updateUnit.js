import connectMongo from "../../lib/mongodb";
import jobModel from "../../lib/schemas/Job"

//request body must have a job number

export default async function updateUnit(req, res) {
  let side
  if (req.body.side === "left") {
    side = "unitsOnLeft"
  } else if (req.body.side === "right") {
    side ="unitsOnRight"
  }
  
  const filter = { jobNumber: req.body.job, [`${side}.unitNumber`] : req.body.unitObject.unitNumber }
  
  const update = {
    $set: {
      [`${side}.$`]: req.body.unitObject 
    }
  }
  console.log("This is the update:")
  console.log(update)
  console.log('*** Trying to update database***')
  try {
    console.log('updateUnit route triggered')
    console.log('connecting to mongo')
    await connectMongo()
    console.log('connected to mongo')

    console.log('updating document')
    console.log('updateunit triggered')
    let mongoResponse = await jobModel.findOneAndUpdate(filter, update, {new: true})
    console.log('updated document')
    console.log(mongoResponse)
    res.json({ mongoResponse })
  } catch(error) {
    console.log(error)
    res.json({error})
  }
}