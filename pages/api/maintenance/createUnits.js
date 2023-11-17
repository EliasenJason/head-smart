import connectMongo from "../../../lib/mongodb";
import unitModel from "../../../lib/schemas/maintenance/unitSchema";

export default async function createUnits(req, res) {
  try {
    await connectMongo();
    const documents = req.body;

    let successfulInserts = [];
    let failedInserts = [];

    for (const document of documents) {
      try {
        // Attempt to insert the document
        const result = await unitModel.create(document);
        successfulInserts.push(result);
      } catch (error) {
        // Check if the error is a duplicate key error
        if (error.code === 11000) {
          console.warn("Duplicate key error. Skipping duplicate entry.");
          failedInserts.push({ document, error: "Duplicate key error" });
        } else {
          // Re-throw other types of errors
          throw error;
        }
      }
    }

    console.log("Successful inserts:", successfulInserts.length);
    console.log("Failed inserts:", failedInserts.length);

    res.json({ successfulInserts, failedInserts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}