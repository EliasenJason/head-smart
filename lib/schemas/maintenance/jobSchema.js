import { Schema, model, models } from "mongoose";

const unitReferenceSchema = new Schema({
  unit: {
    type: Schema.Types.ObjectId,
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