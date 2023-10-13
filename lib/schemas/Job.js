import { Schema, model, models } from "mongoose";

const jobSchema = new Schema({
  jobNumber: {
    type: String,
    required: true
  },
  createdDate: {
    type: Date
  },
  createdBy: {
    type: String
  },
  units: {
    type: [{
      unitNumber: {
        type: Number
      }
    }]
  }
})

const JobModel = models.jobs || model('jobs', jobSchema)

export default JobModel