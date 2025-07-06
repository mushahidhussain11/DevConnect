
import LoadingSpinner from "./LoadingSpinner";

const DeletePostModal = ({
  isOpen,
  onClose,
  onDelete,
  isPostDeleting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs animate-fade-in px-4">
      <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 w-full max-w-sm sm:max-w-md">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">
          Delete Post?
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6">
          Are you sure that you want to delete this post? This action cannot
          be undone.
        </p>
        <div className="flex justify-end gap-2 sm:gap-3 flex-wrap">
          <button
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm sm:text-base"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-primary hover:bg-blue-800 text-white text-sm sm:text-base border-none flex items-center gap-2"
            onClick={onDelete}
            disabled={isPostDeleting}
          >
            {isPostDeleting ? (
              <>
                <LoadingSpinner className="w-4 h-4" />
                <span>Deleting</span>
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePostModal;
