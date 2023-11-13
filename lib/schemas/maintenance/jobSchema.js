import { Schema, model, models } from "mongoose";

const unitReferenceSchema = new Schema({
  unit: {
    type: String,
    ref: 'unitModel'
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