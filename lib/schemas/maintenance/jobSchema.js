import { Schema, model, models } from "mongoose";
import unitModel from "./unitSchema";

// const unitReferenceSchema = new Schema({
//   unit: {
//     type: Array,
//     ref: 'units'
//   }
// })

const jobSchema = new Schema({
  jobNumber: {
    type: String,
    required: true
  },
  createdBy: {
    type: String
  },
  unitsOnLeft: {type: Array, ref: 'units'},
  unitsOnRight: {type: Array, ref: 'units'},
    // type: Array,
    // ref: 'units'
},{
  timestamps: true
})

const jobModel = models.daJobs || model('daJobs', jobSchema)

export default jobModel