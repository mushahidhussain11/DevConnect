const SuggestedUsersSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-300"></div>
            <div className="flex flex-col gap-2">
              <div className="w-24 h-3 bg-gray-300 rounded"></div>
              <div className="w-16 h-2 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="w-6 h-6 rounded bg-gray-200"></div>
        </div>
      ))}
    </div>
  );
};

export default SuggestedUsersSkeleton;
