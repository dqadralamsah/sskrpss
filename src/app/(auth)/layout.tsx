const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" bg-gray-100">
      <div className=" flex flex-col items-center justify-center h-screen">
        <div className=" w-full rounded-lg bg-white shadow max-w-md">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
