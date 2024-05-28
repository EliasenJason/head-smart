import connectMongo from "../../../lib/mongodb";
import jobModel from "../../../lib/schemas/maintenance/jobSchema";

//update job to have maintenance assigned

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await connectMongo();
      const { maintenance, jobNumber } = req.body;

      // Find the job document by jobNumber
      const job = await jobModel.findOne({ jobNumber });
      job.currentMaintenance = maintenance;
      console.log(job)
      await job.save()
      res.status(200).json({ message: 'Maintenance assigned successfully' });
    } catch (error) {
      console.error('Error assigning maintenance:', error);
      res.status(500).json({ message: 'Failed to assign maintenance' });
    }
  }
}