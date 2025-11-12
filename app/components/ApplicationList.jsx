export default function ApplicationList({ applications }) {
  return (
    <table className="application-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Position</th>
          <th>Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {applications.map((app, index) => (
          <tr key={index}>
            <td>{app.name}</td>
            <td>{app.position}</td>
            <td>{app.date}</td>
            <td>{app.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}