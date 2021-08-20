import Loader from "react-loader-spinner";
export const MarvelLoader = () => {
  return (
    <div className="loaderContainer">
      <Loader
        type="Puff"
        color="#00BFFF"
        height={100}
        width={100}
        timeout={3000}
      />
    </div>
  );
};
