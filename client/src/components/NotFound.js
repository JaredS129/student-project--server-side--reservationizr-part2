import BackButton from "./BackButton";
import "../App.css";

const NotFound = () => {
  return (
    <>
      <h1 className="error">404 Page not found</h1>
      <BackButton resource="restaurants" endpoint="/" />
    </>
  );
};

export default NotFound;
