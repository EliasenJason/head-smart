import { Schema, model, models } from "mongoose";

const componentSchema = new Schema({
  status: {
    type: String,
    required: true,
    enum: ['green', 'yellow', 'red'],
    default: 'green'
  },
  hours: { type: Number },
  tonnage: { type: Number },
  isTestComponent: { type: Boolean, default: false },
  installed: {
    name: { type: String },
    Date: { type: Date },
  },
  commentToFixer: { type: String },
  commentByFixer: { type: String },
  assignedFixer: { type: String, required: false }
}, {
  timestamps: true,
});

const unitSchema = new Schema({
  number: { type: String, required: true, unique: true },
  type: { type: String, required: true, enum: ['quintuplex', 'triplex'] },
  packing: {
    1: componentSchema,
    2: componentSchema,
    3: componentSchema,
    4: componentSchema,
    5: componentSchema,
  },
  dischargeValve: {
    1: componentSchema,
    2: componentSchema,
    3: componentSchema,
    4: componentSchema,
    5: componentSchema,
  },
  suctionValve: {
    1: componentSchema,
    2: componentSchema,
    3: componentSchema,
    4: componentSchema,
    5: componentSchema,
  },
  dischargeSeat: {
    1: componentSchema,
    2: componentSchema,
    3: componentSchema,
    4: componentSchema,
    5: componentSchema,
  },
  suctionSeat: {
    1: componentSchema,
    2: componentSchema,
    3: componentSchema,
    4: componentSchema,
    5: componentSchema,
  },
  plunger: {
    1: componentSchema,
    2: componentSchema,
    3: componentSchema,
    4: componentSchema,
    5: componentSchema,
  },
  stuffingBox: {
    1: componentSchema,
    2: componentSchema,
    3: componentSchema,
    4: componentSchema,
    5: componentSchema,
  },
  dischargeSeal: {
    1: componentSchema,
    2: componentSchema,
    3: componentSchema,
    4: componentSchema,
    5: componentSchema,
  },
  suctionSeal: {
    1: componentSchema,
    2: componentSchema,
    3: componentSchema,
    4: componentSchema,
    5: componentSchema,
  }
},{
  timestamps: true
});

const unitModel = models.units || model('units', unitSchema)

export default unitModel