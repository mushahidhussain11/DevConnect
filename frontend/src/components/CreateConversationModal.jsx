import React from "react";
import { X } from "lucide-react";
import { MessagesSquare } from "lucide-react";

const CreateConversationModal = ({
  isOpen,
  onClose,
  users,
  onStartConversation,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-2xl w-[90%] sm:w-[420px] max-h-[90vh] p-6 relative overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4 h-full">
          <h3 className="text-xl font-semibold text-primary dark:text-gray-100">
            <span className="flex items-center gap-2 text-primary">
              <MessagesSquare className="w-6 h-6 text-primary" />
              Start New Conversation
            </span>
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-300" />
          </button>
        </div>

        {/* User List or Message */}
        {users?.length > 0 ? (
          <ul className="space-y-2 max-h-100 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-hide pr-1">
            {users?.map((user) => (
              <li
                key={user?._id}
                onClick={() => {
                  onStartConversation(user);
                  onClose();
                }}
                className="p-3 rounded-xl cursor-pointer bg-white hover:bg-indigo-100 dark:bg-[#2c2c2c] dark:hover:bg-[#333] text-gray-800 dark:text-gray-100 transition flex items-center gap-3 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                {user?.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt={user.fullName}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user?.fullName.charAt(0).toUpperCase()}
                  </div>
                )}

                <span className="font-medium">{user?.fullName}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            You haven’t followed anyone yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default CreateConversationModal;
