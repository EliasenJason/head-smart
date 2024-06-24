import connectMongo from "../../../lib/mongodb";
import unitModel from "../../../lib/schemas/maintenance/unitSchema";
import jobModel from "../../../lib/schemas/maintenance/jobSchema";
import jobHistoryModel from "../../../lib/schemas/maintenance/jobHistorySchema";

export default async function resetUnitMaintenance(req, res) {
  const filter = {number: req.body.unit}
  const update = req.body.update
  const jobFilter = {jobNumber: req.body.job}
  const fixer = req.body.fixer
  const unit = req.body.unit
  console.log(fixer)
  console.log('this is the update')
  console.log(update)
  console.log('end of update')
  try {
    await connectMongo();
    
    const options = {
      new: true,
      runValidators: true,
    };
    //UPDATE UNITS COLLECTION
    //reset the unit statuses
    console.log("WTF")
    if (req.body.remove) {
      console.log('****************')
      const updatedUnit = await unitModel.findOneAndUpdate(filter, update, options);
      console.log("Updated unit:", updatedUnit);
      console.log('reset components')
    } else {
      console.log('****************')
      console.log('do not reset components')
    }

    
    
    
    //Remove the unit from the job's currentMaintenance object
    const jobUpdate = {
      $unset: {
        [`currentMaintenance.${req.body.unit}`]: 1,
      },
    };
    const updatedJob = await jobModel.updateOne(jobFilter, jobUpdate);
    console.log("Updated job:", updatedJob);


    //check if update is successful and if it is create a history item for the job
    if (updatedJob.modifiedCount > 0 && req.body.remove) {
      const maintenanceCompleted = update['$set'];

      const completedMaintenanceArray = Object.entries(maintenanceCompleted)
        .map(([component, statusObj]) => {
          const componentName = component.split('.')[0];
          const hole = component.split('.')[1];
          return { component: componentName, hole: parseInt(hole) };
        }
      )

      //UPDATE JOBHISTORIES COLLECTION
      const existingJobHistory = await jobHistoryModel.findOne({ jobNumber: req.body.job });

      if (existingJobHistory) {
        // Update the existing document
        existingJobHistory.completedMaintenance.push({
          unit: unit,
          fixer: fixer,
          maintenanceCompleted: completedMaintenanceArray,
        });
        await existingJobHistory.save();
        console.log("Existing job history document updated:", existingJobHistory);
      } else {
        // Create a new document
        const newJobHistory = new jobHistoryModel({
          jobNumber: req.body.job,
          completedMaintenance: [{
            unit: unit,
            fixer: fixer,
            maintenanceCompleted: completedMaintenanceArray,
          }],
        });
        await newJobHistory.save();
        //console.log("New job history document created:", newJobHistory);
      }
    }

    res.status(200).json("successful updates");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating unit maintenance" });
  }
}