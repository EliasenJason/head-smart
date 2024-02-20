import { Schema, model, models } from "mongoose";

const contactSchema = new Schema({
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
})

