import { Link } from "react-router-dom";
import "../App.css";

const BackButton = () => {
  return (
    <p className="center">
      <Link to="/">
        <button className="button">&larr; Back to reservations</button>
      </Link>
    </p>
  );
};

export default BackButton;
