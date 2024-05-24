// Import necessary types and components
import { ITask } from "@/types/tasks";
import Task from "./Task";

// Define the TodoList component
const TodoList = ({ tasks }: { tasks: ITask[] }) => {
  return (
    <div className='overflow-x-auto'>
      {/* Render the table for the task list */}
      <table className='table w-full'>
        {/* Table header */}
        <thead>
          <tr className="bg-base-200 text-2xl font-bold text-black">
            <th>Tasks</th>
            <th>Actions</th>
          </tr>
        </thead>
        {/* Table body containing the list of tasks */}
        <tbody>
          {tasks.map((task) => (
            <Task key={task.id} task={task} />  // Render each task using the Task component
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TodoList;
