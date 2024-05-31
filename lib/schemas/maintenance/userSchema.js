import { Schema, model, models } from "mongoose";

const contactSchema = new Schema({
  subscriber: {
    type: String,
    required: true
  },
  teamMembers: [{
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['operator', 'supervisor', 'datavan']
    }
  }],
});

const userModel = models.users || model('users', contactSchema)

export default userModel