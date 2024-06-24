import connectMongo from '../../../lib/mongodb';
import jobHistoryModel from '../../../lib/schemas/maintenance/jobHistorySchema';

export default async function handler(req, res) {
  // get the request data
  const jobNumber = req.body.jobNumber
  const id = req.body.id
  
  try {
    console.log('CONNECTING TO MONGODB');
    await connectMongo();
    console.log('CONNECTED TO MONGODB');

    // find the job history document by job number
    const jobHistory = await jobHistoryModel.findOne({ jobNumber });

    if (!jobHistory) {
      return res.status(404).json({ message: 'Job history not found' });
    }

    // remove the maintenance from the completedMaintenance array using the id
    const updatedCompletedMaintenance = jobHistory.completedMaintenance.filter(
      (maintenance) => maintenance._id.toString() !== id
    );

    jobHistory.completedMaintenance = updatedCompletedMaintenance;

    // save the updated job history document
    await jobHistory.save();

    res.status(200).json({ message: 'Team member removed from job history' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
