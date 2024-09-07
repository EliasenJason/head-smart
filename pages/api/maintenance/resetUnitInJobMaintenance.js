import connectMongo from "../../../lib/mongodb";
import jobModel from "../../../lib/schemas/maintenance/jobSchema";

export default async function resetUnitMaintenance(req, res) {
  const unitNumber = req.body.unitNumber
  const jobFilter = {jobNumber: req.body.job}

  try {
    await connectMongo();
    
    const jobDocument = await jobModel.findOne(jobFilter);

    if (!jobDocument) {
      return res.status(404).json({ message: "Job not found" });
    }

    const updatedJob = await jobModel.findOneAndUpdate(
      jobFilter,
      {
        $set: {
          "currentMaintenance": jobDocument.currentMaintenance.map((item) => {
            if (item.unit === unitNumber) {
              return {
                ...item,
                components: [],
                fixer: null,
              };
            }
            return item;
          }),
        },
      },
      { new: true }
    );
    res.status(200).json({ message: "Unit reset successfully" });
    } catch (error) {
    console.error("Error resetting unit:", error);
    res.status(500).json({ message: "Internal server error" });
  }



}




// try {
//   await connectMongo();
  
//   const options = {
//     new: true,
//     runValidators: true,
//   };
//   //UPDATE UNITS COLLECTION
//   //reset the unit statuses
//   console.log("WTF")
//   if (req.body.remove) {
//     console.log('****************')
//     const updatedUnit = await unitModel.findOneAndUpdate(filter, update, options);
//     console.log("Updated unit:", updatedUnit);
//     console.log('reset components')
//   } else {
//     console.log('****************')
//     console.log('do not reset components')
//   }

  
  
  
//   //Remove the unit from the job's currentMaintenance object
//   const jobUpdate = {
//     $unset: {
//       [`currentMaintenance.${req.body.unit}`]: 1,
//     },
//   };
//   const updatedJob = await jobModel.updateOne(jobFilter, jobUpdate);
//   console.log("Updated job:", updatedJob);


//   //check if update is successful and if it is create a history item for the job
//   if (updatedJob.modifiedCount > 0 && req.body.remove) {
//     const maintenanceCompleted = update['$set'];

//     const completedMaintenanceArray = Object.entries(maintenanceCompleted)
//       .map(([component, statusObj]) => {
//         const componentName = component.split('.')[0];
//         const hole = component.split('.')[1];
//         return { component: componentName, hole: parseInt(hole) };
//       }
//     )

//     //UPDATE JOBHISTORIES COLLECTION
//     const existingJobHistory = await jobHistoryModel.findOne({ jobNumber: req.body.job });

//     if (existingJobHistory) {
//       // Update the existing document
//       existingJobHistory.completedMaintenance.push({
//         unit: unit,
//         fixer: fixer,
//         maintenanceCompleted: completedMaintenanceArray,
//       });
//       await existingJobHistory.save();
//       console.log("Existing job history document updated:", existingJobHistory);
//     } else {
//       // Create a new document
//       const newJobHistory = new jobHistoryModel({
//         jobNumber: req.body.job,
//         completedMaintenance: [{
//           unit: unit,
//           fixer: fixer,
//           maintenanceCompleted: completedMaintenanceArray,
//         }],
//       });
//       await newJobHistory.save();
//       //console.log("New job history document created:", newJobHistory);
//     }
//   }

//   res.status(200).json("successful updates");
// } catch (error) {
//   console.error(error);
//   res.status(500).json({ error: "Error updating unit maintenance" });
// }