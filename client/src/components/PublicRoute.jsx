import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  if (userInfo) {
    return <Navigate to="/" />;
  }

  return children;
}

export default PublicRoute;