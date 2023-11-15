import { Schema, model, models } from "mongoose";
import unitModel from "./unitSchema";

const unitReferenceSchema = new Schema({
  unit: {
    type: String,
    ref: 'units'
  }
})

const jobSchema = new Schema({
  jobNumber: {
    type: String,
    required: true
  },
  createdBy: {
    type: String
  },
  unitsOnLeft: [unitReferenceSchema],
  unitsOnRight: [unitReferenceSchema],
},{
  timestamps: true
})

const jobModel = models.daJobs || model('daJobs', jobSchema)

export default jobModel