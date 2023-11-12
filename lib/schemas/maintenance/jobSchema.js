import { Schema, model, models } from "mongoose";

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

const JobModel = models.job || model('job', jobSchema)

export default JobModel