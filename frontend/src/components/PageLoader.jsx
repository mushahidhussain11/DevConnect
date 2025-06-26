const PageLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white space-y-4">
      <div
        className="h-14 w-14 animate-spin rounded-full border-4 border-solid border-[#4C68D5] border-t-transparent"
        role="status"
      />
      <p className="text-[#4C68D5] text-lg font-medium animate-pulse tracking-wide">
        Loading, please wait...
      </p>
    </div>
  );
};

export default PageLoader;
