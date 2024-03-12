import { Schema, model, models } from "mongoose";

const contactSchema = new Schema({
  userID: {
    type: String,
    required: true
  },
  users: [{
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    }
  }],
  currentTeam: [{
    username: String,
    email: String,
  }]
})

