import connectMongo from "../../../lib/mongodb";
import contactSchema from "../../../lib/schemas/maintenance/userSchema";

/*

{
  userID: {
    type: String,
    required: true
  },
  users: [{
    username: String,
    email: String
  }],
  currentTeam: [{
    username: String,
    email: String,
  }]
}

*/

export default async function createContact(req, res) {
  try {
    await connectMongo()
    let mongoResponse = await contactSchema.create(
      req.body
    )
    console.log(mongoResponse)
    res.json({ mongoResponse })
  } catch(error) {
    console.log(error)
    res.json({error})
  }
}