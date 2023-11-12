import connectMongo from "../../../lib/mongodb";
import mongoose from "mongoose";
import jobModel from "../../../lib/schemas/maintenance/jobSchema";

export default async function handler(req, res) {
  try {
    await connectMongo();
    // const populatedJob = jobModel.findById('65505d50ebff67019aa9ec8b')
    // const jobId = new mongoose.Types.ObjectId('65505d50ebff67019aa9ec8b'); // Replace with actual job ID
    const populatedJob = await jobModel.findById('65505d50ebff67019aa9ec8b')
    .populate({
      path: 'unitsOnLeft',
      populate: {path: 'unit'}
    })
    res.status(200).json(populatedJob);
  } catch (error) {
    console.error('Error fetching job data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}