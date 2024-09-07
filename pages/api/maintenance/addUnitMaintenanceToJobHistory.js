import connectMongo from "../../../lib/mongodb";
import jobHistoryModel from "../../../lib/schemas/maintenance/jobHistorySchema";

export default async function addUnitMaintenanceToJobHistory(req, res) {
  try {
    await connectMongo();
    const { jobNumber, maintenance } = req.body;

    const maintenanceCompletedItem = {
      unit: maintenance.unit,
      fixer: maintenance.fixer.name,
      maintenanceCompleted: maintenance.components.flatMap(component => {
        return component.details.map(detail => ({
          component: component.type,
          hole: parseInt(detail.hole)
        }));
      }),
      timestamp: new Date()
    }
    let jobHistory = await jobHistoryModel.findOne({ jobNumber: jobNumber });

    if (jobHistory) {
      jobHistory.completedMaintenance.push(maintenanceCompletedItem)
    } else {
      jobHistory = new jobHistoryModel({
        jobNumber: jobNumber,
        completedMaintenance: [maintenanceCompletedItem]
      });
    }
    const savedJobHistory = await jobHistory.save();
    res.status(201).json({ message: 'Job history created', data: savedJobHistory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}