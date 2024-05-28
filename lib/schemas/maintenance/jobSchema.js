import { Schema, model, models } from "mongoose";
import unitModel from "./unitSchema";

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
  currentMaintenance: {type: Schema.Types.Mixed}
},{
  timestamps: true
})

const jobModel = models.daJobs || model('daJobs', jobSchema)

export default jobModel