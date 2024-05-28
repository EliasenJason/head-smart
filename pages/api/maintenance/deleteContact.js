import connectMongo from "../../../lib/mongodb";
import contactSchema from "../../../lib/schemas/maintenance/userSchema";

// delete team member
export default async function handler(req, res) {
  try {
    await connectMongo();

    const { subscriber, memberId } = req.body;
    // console.log( subscriber)
    // console.log( memberId)
    // Find the document by the subscriber field
    const document = await contactSchema.findOne({ subscriber });

    if (!document) {
      
      return res.status(404).json({ message: "Document not found" });
    }

    // Find the index of the team member to be deleted
    const memberIndex = document.teamMembers.findIndex(
      (member) => member._id.toString() === memberId
    );

    if (memberIndex === -1) {
      
      return res.status(404).json({ message: "Team member not found" });
    }
    
    // Remove the team member from the array
    document.teamMembers.splice(memberIndex, 1);
    
    const result = await document.save();
    
    res.status(200).json(result.teamMembers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting team member" });
  }
}