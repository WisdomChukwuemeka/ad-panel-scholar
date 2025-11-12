export default function JobList({ jobs }) {
  return (
    <ul className="job-list">
      {jobs.map((job, index) => (
        <li key={index}>
          <h3>{job.title}</h3>
          <p>{job.type} · {job.salary} · {job.applicants} Applicants</p>
        </li>
      ))}
    </ul>
  );
}