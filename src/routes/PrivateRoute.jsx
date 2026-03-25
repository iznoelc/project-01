import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import FallbackElement from "../components/FallbackElement";

// pass children as props, which should be just the page that the user is allowed to go to if they are signed in
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  console.log(location);

  // if authentication is still loading the user, show the fallback element
  if (loading) {
    return <FallbackElement />;
  }

  // if the user is signed in, allow the user to go to the child component page
  // which in main, it can be seen that this is the dashboard
  if (user) {
    return children;
  }

  // if the user is NOT signed in, relocate them to the login page if they try to access the private route.
  return <Navigate state={location?.pathname} to="/login"></Navigate>;
};

export default PrivateRoute;