import connectMongo from "../../../lib/mongodb";
import unitModel from "../../../lib/schemas/maintenance/unitSchema";
import jobModel from "../../../lib/schemas/maintenance/jobSchema";

export default async function resetUnitMaintenance(req, res) {
  const filter = {number: req.body.unit}
  const update = req.body.update
  const jobFilter = {jobNumber: req.body.job}

  try {
    await connectMongo();
    
    const options = {
      new: true,
      runValidators: true,
    };
    //reset the unit statuses
    const updatedUnit = await unitModel.findOneAndUpdate(filter, update, options);
    console.log("Updated unit:", updatedUnit);
    
    //Remove the unit from the job's currentMaintenance object
    const jobUpdate = {
      $unset: {
        [`currentMaintenance.${req.body.unit}`]: 1,
      },
    };
    const updatedJob = await jobModel.updateOne(jobFilter, jobUpdate);
    console.log("Updated job:", updatedJob);

    res.status(200).json("successful updates");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating unit maintenance" });
  }
}