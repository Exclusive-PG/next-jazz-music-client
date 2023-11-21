type Props = React.PropsWithChildren;

export const Wrapper = ({ children }: Props) => {
  return <section className={`mx-auto my-0 max-w-7xl`}>{children}</section>;
};
