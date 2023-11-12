import { useState, useEffect } from 'react';

const YourPage = ({ initialData }) => {
  const [populatedJob, setPopulatedJob] = useState(initialData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetch('/api/maintenance/getJobData');
        const data = await result.json();
        setPopulatedJob(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (!populatedJob) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Render your component using populatedJob */}
      <p>Job Number: {populatedJob.jobNumber}</p>
    </div>
  );
};

export const getServerSideProps = async () => {
  return {
    props: {
      initialData: null, // You can initialize with null or some default value
    },
  };
};

export default YourPage;