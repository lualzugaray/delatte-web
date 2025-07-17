import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

export function SyncUser() {
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    const syncUser = async () => {
      if (isAuthenticated && user) {
        try {
          const res = await axios.post("http://localhost:5000/api/auth/sync-client", {
            email: user.email,
            firstName: user.given_name || "",
            lastName: user.family_name || "",
            profilePicture: user.picture || ""
          });
          localStorage.setItem("token", res.data.token);
        } catch (err) {
          console.error(err);
        }
      }
    };
    syncUser();
  }, [isAuthenticated, user]);

  return null;
}
