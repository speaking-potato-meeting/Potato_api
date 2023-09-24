interface RootProps {
  children: React.ReactNode;
}

const Root = ({ children }: RootProps) => {
  return (
    <div>
      <div>인증이 필요한 페이지입니다.</div>
      <>{children}</>
    </div>
  );
};

export default Root;
