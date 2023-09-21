interface RootProps {
  children: React.ReactNode;
}

const Root = ({ children }: RootProps) => {
  return (
    <div>
      <>{children}</>
    </div>
  );
};

export default Root;
