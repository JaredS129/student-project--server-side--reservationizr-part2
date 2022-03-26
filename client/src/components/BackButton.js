import { Link } from "react-router-dom";
import "../App.css";

const BackButton = ({ resource, endpoint }) => {
  return (
    <p className="center">
      <Link to={endpoint}>
        <button className="button">&larr; Back to {resource}</button>
      </Link>
    </p>
  );
};

export default BackButton;
