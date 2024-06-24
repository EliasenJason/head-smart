import { Schema, model, models } from "mongoose";

const jobHistorySchema = new Schema({
  jobNumber: {
    type: String,
    required: true
  },
  completedMaintenance: [{
    unit: {
      type: String,
      required: true
    },
    fixer: {
      type: String,
      required: true
    },
    maintenanceCompleted: [{
      component: {
        type: String,
        required: true,
      },
      hole: {
        type: Number,
        required: true
      }
    }],
    timestamp: { type: Date, default: Date.now }
  }]

}
)

const jobHistoryModel = models.jobHistory || model('jobHistory', jobHistorySchema)

export default jobHistoryModel