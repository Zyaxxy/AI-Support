const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen min-w-screen h-full w-full flex flex-col items-center justify-center bg-gray-50">
      {children}
    </div>
  );
};

export default Layout;