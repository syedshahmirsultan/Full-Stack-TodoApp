"use client";

// Import necessary dependencies and components
import { FormEventHandler, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Modal from "./Modal";
import { useRouter } from "next/navigation";
import { ITask } from "@/types/tasks";
import { deleteTodo, editTodo } from "../api";

// Define Task component
const Task = ({ task }: { task: ITask }) => {
  // Initialize necessary states and hooks
  const router = useRouter();
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [openModalDeleted, setOpenModalDeleted] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<string>(task.content);

  // Handle submission of edited todo
  const handleSubmitEditTodo: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await editTodo({
      id: task.id,
      content: taskToEdit,
    });
    setOpenModalEdit(false);
    router.refresh();
  };

  // Handle deletion of task
  const handleDeleteTask = async (id: any) => {
    await deleteTodo(id);
    setOpenModalDeleted(false);
    router.refresh();
  };

  // Return JSX for Task component
  return (
    <tr key={task.id} className="border-b-4 border-gray-200">
      <td className='w-full text-xl'>{task.content}</td>
      <td className='flex gap-x-3'>
        {/* Edit button */}
        <FiEdit
          onClick={() => setOpenModalEdit(true)}
          cursor='pointer'
          className='text-blue-500'
          size={28}
        />
        {/* Edit Task Modal */}
        <Modal modalOpen={openModalEdit} setModalOpen={setOpenModalEdit}>
          <form onSubmit={handleSubmitEditTodo}>
            <h3 className='font-bold text-xl text-primary'>EDIT TASK</h3>
            <div className='modal-action'>
              <input
                value={taskToEdit}
                onChange={(e) => setTaskToEdit(e.target.value)}
                type='text'
                placeholder='Type here'
                className='input input-bordered w-full border-primary'
              />
              <button type='submit' className='btn btn-primary text-white'>
                Submit
              </button>
            </div>
          </form>
        </Modal>
        {/* Delete button */}
        <FiTrash2
          onClick={() => setOpenModalDeleted(true)}
          cursor='pointer'
          className='text-red-500'
          size={28}
        />
        {/* Delete Task Modal */}
        <Modal modalOpen={openModalDeleted} setModalOpen={setOpenModalDeleted}>
          <h3 className='text-xl text-primary'>
            Are you sure, you want to delete this task?
          </h3>
          <div className='modal-action'>
            <button onClick={() => handleDeleteTask(task.id)} className='btn btn-error text-white'>
              Yes
            </button>
          </div>
        </Modal>
      </td>
    </tr>
  );
};

export default Task;
