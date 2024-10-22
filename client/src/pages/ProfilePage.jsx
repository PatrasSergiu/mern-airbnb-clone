import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import PlacesPage from "./PlacesPage";
import AccountNav from "../components/AccountNav";

export default function AccountPage() {
  const { user, setUser, ready } = useContext(UserContext);
  const [redirect, setRedirect] = useState(null);

  let { subpage } = useParams();
  if (subpage === undefined) subpage = "profile";

  if (!ready) {
    return "Loading..";
  }

  if (!user && ready && !redirect) {
    return <Navigate to={"/login"}></Navigate>;
  }

  async function handleLogout() {
    toast
      .promise(axios.post("/api/users/logout"), {
        pending: "Logging out...",
        success: "Logout successful!",
        error: "An unknown error occured. Please try again later.",
      })
      .then((response) => {
        console.log(response);
        setRedirect("/");
        setUser(null);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  if (redirect) {
    return <Navigate to={redirect}></Navigate>;
  }

  return (
    <div>
      <AccountNav />
      {subpage === 'profile' && (
        <div className="text-center max-w-lg mx-auto">
          Logged in as {user.name} ({user.email})<br />
          <button onClick={handleLogout} className="primary max-w-sm mt-2">Logout</button>
        </div>
      )}
      {subpage === 'places' && (
        <PlacesPage />
      )}
    </div>
  );
}
