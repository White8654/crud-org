"use client";

import { addTodo } from "@/actions/addTodo";
import { deleteTodo } from "@/actions/deleteTodo";
import { getTodos } from "@/actions/getTodos";
import { updateTodo } from "@/actions/updateTodo";
import Popup from "@/components/Popup";
import { FormEvent, useEffect, useState } from "react";

interface Todo {
  id: number;
  todo: string;
  status: boolean;
}

export default function Home() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [tableData, setTableData] = useState<Todo[]>([]);
  const [editTodo, setEditTodo] = useState<
    Todo | undefined
  >();

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setEditTodo(undefined);
  };

  const loadTableData = async () => {
    try {
      const todos: Todo[] = await getTodos();
      setTableData(todos);
    } catch (error) {
      throw error;
    }
  };

  const handleTodoSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const target = event.target as typeof event.target & {
      todo: { value: string };
    };

    try {
      if (editTodo) {
        await updateTodo(editTodo);
      } else {
        await addTodo(target.todo.value);
      }

      closePopup();
      loadTableData();
    } catch (error) {
      throw error;
    }
  };

  const doneTodo = async (todo: Todo) => {
    try {
      await updateTodo({ ...todo, status: true });
      await loadTableData();
    } catch (error) {
      throw error;
    }
  };

  const deleteItem = async (id: number) => {
    try {
      await deleteTodo(id);
      await loadTableData();
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    loadTableData();
  }, []);

  return (
    <main className="bg-gray-800 w-4/5 mx-auto mt-20 p-5 rounded-lg">
      <div className="flex justify-between items-center mb-3">
        <div className="text-3xl text-white">Todos</div>
        <button
          onClick={openPopup}
          className="bg-blue-500 text-white px-5 py-3 text-xl rounded-xl"
        >
          Add Todo
        </button>
      </div>
      <Popup isOpen={isPopupOpen} onClose={closePopup}>
        <form
          onSubmit={handleTodoSubmit}
          className="mx-auto"
        >
          <div className="mb-5">
            <label
              htmlFor="todo"
              className="block mb-2 text-sm font-medium text-white"
            >
              Todo
            </label>

            {editTodo ? (
              <input
                type="text"
                id="todo"
                placeholder="Enter your task"
                className="text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white shadow-sm-light"
                value={editTodo.todo}
                onChange={(e: any) =>
                  setEditTodo((prev) =>
                    prev
                      ? { ...prev, todo: e.target.value }
                      : {
                          id: 0,
                          todo: e.target.value,
                          status: false,
                        }
                  )
                }
                required
              />
            ) : (
              <input
                type="text"
                id="todo"
                placeholder="Enter your task"
                className="text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white shadow-sm-light"
                required
              />
            )}
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            {editTodo ? "Update Todo" : "Add Todo"}
          </button>
        </form>
      </Popup>
      <div className="mt-5">
        <table className="w-full border rounded-xl overflow-hidden">
          <thead className="bg-blue-900">
            <tr>
              <th className="text-center py-3 border border-gray-500 text-lg">
                Done
              </th>
              <th className="text-center py-3 border border-gray-500 text-lg">
                Task
              </th>

              <th className="text-center py-3 border border-gray-500 text-lg">
                Edit
              </th>

              <th className="text-center py-3 border border-gray-500 text-lg">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData &&
              tableData.map((row, idx) => (
                <tr
                  key={idx}
                  className="text-center odd:bg-gray-700 even:bg-gray-600"
                >
                  <td className="py-3 border border-gray-500">
                    <button onClick={() => doneTodo(row)}>
                      <div className="w-4 h-4 cursor-pointer border border-white rounded-sm"></div>
                    </button>
                  </td>
                  <td className="py-3 border border-gray-500">
                    {row.todo}
                  </td>
                  <td className="py-3 border border-gray-500">
                    <button
                      onClick={() => {
                        setEditTodo(row);
                        setIsPopupOpen(true);
                      }}
                    >
                      Edit
                    </button>
                  </td>
                  <td className="py-3 border border-gray-500">
                    <button
                      onClick={() => deleteItem(row.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
