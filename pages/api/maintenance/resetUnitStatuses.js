import connectMongo from "../../../lib/mongodb";
import unitModel from "../../../lib/schemas/maintenance/unitSchema";

export default async function resetUnitStatuses(req, res) {
  const unitInformation = req.body.unitInformation;
  await connectMongo();

  try {
    // Find the unit document in the database
    const unit = await unitModel.findOne({ number: unitInformation.unit });

    if (unit) {
      // Reset the component statuses for the components in unitInformation
      unitInformation.components.forEach((component) => {
        const componentType = component.type;
        const componentDetails = unit[componentType];

        if (componentDetails) {
          component.details.forEach((holeNumber) => {
            const detail = componentDetails[holeNumber.hole];
            if (detail) {
              detail.status = 'green';
            }
          });
        }
      });

      // Save the updated unit document
      await unit.save();

      res.status(200).json({ message: 'Unit statuses reset successfully' });
    } else {
      res.status(404).json({ message: `Unit ${unitInformation.unit} not found` });
    }
  } catch (error) {
    console.error('Error resetting unit statuses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
