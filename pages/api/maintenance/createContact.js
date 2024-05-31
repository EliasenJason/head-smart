import connectMongo from "../../../lib/mongodb";
import contactSchema from "../../../lib/schemas/maintenance/userSchema";

export default async function createContact(req, res) {
  try {
    await connectMongo()

    const { userEmail, userName, subscriber, userRole } = req.body

    if (!req.body.hasOwnProperty('userEmail') || !req.body.hasOwnProperty('userName') || !req.body.hasOwnProperty('subscriber')|| !req.body.hasOwnProperty('userRole')) {
      return res.status(400).json({ error: 'Missing required properties in request body, request body must contain subscriber, userName and userEmail' });
    }

    let contact = await contactSchema.findOne({ subscriber })

    const newTeamMember = {
      name: userName,
      email: userEmail,
      role: userRole
    }
    console.log('this is the new team member: ')
    console.log(newTeamMember)

    if (contact) {
      // console.log(contact)
      // If the user exists, add the new teamMembers to the teamMembers array only if the teamMember doesn't already exist
      const userSubscriber = contact.teamMembers.find(teamMember => teamMember.subscriber === subscriber);
      if (!userSubscriber) {
        console.log('user exists, adding a team member')
        console.log('Contact before update:', contact);
        contact.teamMembers.push(newTeamMember);
        const updatedContact = await contact.save();
        console.log('Contact after update:', updatedContact);
        console.log(updatedContact)
        res.status(200).json(updatedContact);
      } else {
        res.status(200).json({ message: 'Team member already exists' });
      }
    } else {
      // If the user doesn't exist, create a new one
      console.log('user does not exist, creating a new user')
      const newContact = await contactSchema.create({
        subscriber: subscriber,
        teamMembers: [newTeamMember],
      });
      res.status(201).json(newContact);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}