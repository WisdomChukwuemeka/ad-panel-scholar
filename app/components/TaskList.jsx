export default function TaskList({ tasks }) {
  return (
    <ul className="task-list">
      {tasks.map((task, index) => (
        <li key={index}>
          <h3>{task.title}</h3>
          <p>{task.date} · {task.status}</p>
        </li>
      ))}
    </ul>
  );
}