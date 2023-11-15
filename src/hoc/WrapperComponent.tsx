
const WrapperComponent = (Component:React.FC) =>
  function HOC() {
    return (
      <section className={`mx-auto my-0 max-w-7xl`}>
        <Component />
      </section>
    );
  };

export default WrapperComponent;