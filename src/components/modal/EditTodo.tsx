import { ToastMessage } from "@/app/toastMessage";
import TodoApis from "@/common/api/TodoApi";
import { Data } from "@/common/type/todoTypeApi";
import httpUtils from "@/common/utils/httpUtils";
import React, { useState } from "react";
import { useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Modal from ".";
import Toggle from "../toggle";
type Props = {
  onClose?: () => void;
  onSuccess?: (data?: Data) => void;
  dataEdit?: Data;
};

export default function EditTodo({ dataEdit, onClose, onSuccess }: Props) {
  const [message, setMessage] = useState<string>();
  const [data, setData] = useState<Data>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setData(dataEdit);
  }, [JSON.stringify(dataEdit)]);

  const handleChangeInput = (e) => {
    setMessage("");
    setData({ ...data, todo: e.target.value });
  };
  const handleChek = (val) => {
    setData({ ...data, isCompleted: val });
  };
  const validtion = () => {
    if (!data?.todo || data?.todo?.trim() == "") {
      setMessage("Field todo is require");
      return false;
    } else {
      return true;
    }
  };

  const handleKeyPress = (e) => {
    if (e.keyCode == 13) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const body = {
      isCompleted: data?.isCompleted,
      todo: data?.todo,
      id: data?.id as number,
    };
    if (validtion()) {
      setLoading(true);
      await TodoApis.editTodo({ ...body })
        .then((res) => {
          const resData = res?.data;
          ToastMessage({ title: "Updated success", status: "success" });
          onSuccess && onSuccess(resData);
          setLoading(false);
        })
        .catch((error) => {
          httpUtils.parseError(error).then((err) => {
            setLoading(false);
            setMessage(err?.errors[0]);
          });
        });
    }
  };

  return (
    <Modal title="Update Todo">
      <div className=" flex flex-col w-full ">
        {loading && (
          <div className=" h-full w-full bg-black bg-opacity-20 absolute inset-0 z-20 flex flex-col items-center justify-center">
            <AiOutlineLoading3Quarters className=" animate-spin text-teal-500" />
          </div>
        )}
        <div className="sm:flex sm:items-start">
          <div className="mt-2 h-30 w-full flex  flex-col">
            <div className=" border border-teal-500 items-center w-full justify-center flex py-2 px-3 text-sm rounded-lg space-x-2 ">
              <input
                value={data?.todo}
                onChange={handleChangeInput}
                className="focus:outline-none text-gray-600 w-full"
                placeholder="Todo..."
                onKeyDown={handleKeyPress}
              />
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div />
              <Toggle
                id={data?.id + "_edit_todo"}
                onChange={handleChek}
                defaultValue={data?.isCompleted}
                title="Mark as complete"
              />
            </div>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-red-500">{message}</span>
            </div>
          </div>
        </div>
        <div className=" py-3  flex w-full justify-end items-end ">
          <button
            onClick={onClose}
            type="button"
            className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
          >
            Close
          </button>
          <button
            onClick={handleSubmit}
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md border  bg-teal-500 px-4 py-2 text-base font-medium text-white hover:bg-teal-600  shadow-sm focus:outline-none sm:mt-0 sm:ml-6 sm:w-auto sm:text-sm"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}
