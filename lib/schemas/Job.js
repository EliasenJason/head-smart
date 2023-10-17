import { Schema, model, models } from "mongoose";

const unitSchema = new Schema(

)

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
  unitsOnLeft: [
    {
      unitNumber: {
        type: String,
      },
      pack1: {
        type: String,
        enum: ['green', 'yellow', 'red'],
      },
      pack2: {
        type: String,
        enum: ['green', 'yellow', 'red'],
      },
      pack3: {
        type: String,
        enum: ['green', 'yellow', 'red'],
      },
      pack4: {
        type: String,
        enum: ['green', 'yellow', 'red'],
      },
      pack5: {
        type: String,
        enum: ['green', 'yellow', 'red'],
      },
    },
  ],
  unitsOnRight: [
    {
      unitNumber: {
        type: String,
      },
      pack1: {
        type: String,
        enum: ['green', 'yellow', 'red'],
      },
      pack2: {
        type: String,
        enum: ['green', 'yellow', 'red'],
      },
      pack3: {
        type: String,
        enum: ['green', 'yellow', 'red'],
      },
      pack4: {
        type: String,
        enum: ['green', 'yellow', 'red'],
      },
      pack5: {
        type: String,
        enum: ['green', 'yellow', 'red'],
      },
    },
  ],
})

const JobModel = models.jobs || model('jobs', jobSchema)

export default JobModel