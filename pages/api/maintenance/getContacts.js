import connectMongo from "../../../lib/mongodb";
import contactSchema from "../../../lib/schemas/maintenance/userSchema";

export default async function getContacts(req, res) {
  try {
    await connectMongo();

    const { subscriber } = req.query;
    
    if (!subscriber) {
      return res.status(400).json({ error: 'Missing subscriber parameter' });
    }
    const contacts = await contactSchema.findOne({ subscriber: subscriber });
    res.status(200).json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}