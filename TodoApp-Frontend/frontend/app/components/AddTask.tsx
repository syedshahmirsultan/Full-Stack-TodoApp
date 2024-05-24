"use client";

// Import necessary dependencies and components
import { FormEventHandler, useState } from "react";
import { useRouter } from "next/navigation";
import { addTodo } from "../api";
import React from "react";
import Modal from './Modal'

// Define AddTask component
const AddTask = () => {
  const router = useRouter();  // Initialize useRouter for navigation
  const [modalOpen, setModalOpen] = useState<boolean>(false);  // State for managing modal open/close status
  const [newTaskValue, setNewTaskValue] = useState<string>("");  // State for storing the new task content

  // Handle submission of the new todo
  const handleSubmitNewTodo: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await addTodo({
      content: newTaskValue,  // Pass the new task content to addTodo API
    });
    setNewTaskValue("");  // Reset the input field
    setModalOpen(false);  // Close the modal
    router.refresh();  // Refresh the page to show the updated list of tasks
  };

  // Return JSX for AddTask component
  return (
    <div>
      {/* Button to open the modal for adding a new task */}
      <button
        onClick={() => setModalOpen(true)}
        className='btn btn-primary w-full text-white text-xl'
      >
        ADD NEW TASK
      </button>

      {/* Modal for adding a new task */}
      <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <form onSubmit={handleSubmitNewTodo}>
          <h3 className='font-bold text-xl text-primary text-left'>ADD NEW TASK</h3>
          <div className='modal-action'>
            {/* Input field for the new task content */}
            <input
              value={newTaskValue}
              onChange={(e) => setNewTaskValue(e.target.value)}
              type='text'
              placeholder='Type here'
              className='input input-bordered w-full border-primary'
            />
            {/* Submit button for the form */}
            <button type='submit' className='btn btn-primary text-white'>
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddTask;
