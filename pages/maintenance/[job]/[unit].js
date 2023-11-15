import unitModel from "../../../lib/schemas/maintenance/unitSchema";
import connectMongo from "../../../lib/mongodb";

export default function Unit({unit}) {
  console.log(unit)
  return (
    <>
    <h1>data for {unit.number}</h1>
    <p>{JSON.stringify(unit)}</p>
    </>
  )
}

export async function getServerSideProps(context) {
  const unitNumber = context.params.unit;
  const query = {number: unitNumber}
  console.log(query)
  let unit
  // Make an API request to fetch job data based on the job number
  try {
    console.log('getJob route triggered')
    console.log('connecting to mongo')
    await connectMongo()
    console.log('connected to mongo')

    console.log('requesting data')
    unit = await unitModel.findOne(query)
      console.log('*')
      console.log(unit)
    console.log('data received')
  } catch(error) {
    console.log('there has been an error!')
    console.log(error)
    job = 'ERROR'
  }
  return {
    props: {
      unit: JSON.parse(JSON.stringify(unit))
    },
  };
}