// Import necessary types
import { ITask } from "@/types/tasks";

// Define the base URL for the API
const baseUrl = 'http://localhost:8000';

// Function to fetch all todos from the server
export const getAllTodos = async () => {
  const res = await fetch(`${baseUrl}/todo`, { cache: 'no-store' }); // Fetch todos with no caching
  const todos = await res.json(); // Parse the JSON response
  return todos; // Return the list of todos
}

// Function to add a new todo
export const addTodo = async (todo: ITask) => {
  const res = await fetch(`${baseUrl}/todo`, {
    method: 'POST', // Use POST method to create a new todo
    headers: {
      'Content-Type': 'application/json' // Set the content type to JSON
    },
    body: JSON.stringify(todo) // Stringify the todo object to JSON
  });
  const newTodo = await res.json(); // Parse the JSON response
  return newTodo; // Return the newly created todo
}

// Function to edit an existing todo
export const editTodo = async (todo: ITask) => {
  const res = await fetch(`${baseUrl}/todo/${todo.id}`, {
    method: 'PUT', // Use PUT method to update the todo
    headers: {
      'Content-Type': 'application/json' // Set the content type to JSON
    },
    body: JSON.stringify(todo) // Stringify the updated todo object to JSON
  });
  const updatedTodo = await res.json(); // Parse the JSON response
  return updatedTodo; // Return the updated todo
}

// Function to delete a todo by ID
export const deleteTodo = async (id: number) => {
  await fetch(`${baseUrl}/todo/${id}`, {
    method: 'DELETE', // Use DELETE method to remove the todo
  });
}
