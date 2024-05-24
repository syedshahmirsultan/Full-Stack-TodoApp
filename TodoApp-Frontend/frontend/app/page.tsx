// import { getAllTodos } from "./api";
// import TodoList from "./components/TodoList";
// import AddTask from './components/AddTask';
// export default async function Home() {
//   const tasks = await getAllTodos();

//   return (
//     <main className='max-w-4xl mx-auto mt-4'>
//       <div className='text-center my-5 flex flex-col gap-4'>
//         <h1 className='text-4xl font-bold mb-8 mt-6'> Todo List App</h1>
//         <AddTask />
//       </div>
//       <TodoList tasks={tasks} />
//     </main>
//   );
// }


// Import necessary functions and components
import { getAllTodos } from "./api";
import TodoList from "./components/TodoList";
import AddTask from './components/AddTask';

// Define the main component for the Home page
export default async function Home() {
  const tasks = await getAllTodos(); // Fetch all todos asynchronously

  return (
    <main className='max-w-4xl mx-auto mt-4'>
      {/* Header and AddTask component */}
      <div className='text-center my-5 flex flex-col gap-4'>
        <h1 className='text-4xl font-bold mb-8 mt-6'>Todo List App</h1> {/* Page title */}
        <AddTask /> {/* Component to add a new task */}
      </div>
      {/* TodoList component displaying the list of tasks */}
      <TodoList tasks={tasks} />
    </main>
  );
}
