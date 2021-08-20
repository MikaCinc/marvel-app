import Loader from "react-loader-spinner";
export const MarvelLoader = () => {
  return (
    <div className="loaderContainer">
      <Loader
        type="Grid"
        color="#0070f3"
        height={100}
        width={100}
        timeout={3000}
      />
    </div>
  );
};
