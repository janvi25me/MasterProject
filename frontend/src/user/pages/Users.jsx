import { useEffect, useState } from "react";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/Hooks/http-hook";
import UsersList from "../components/UsersList";

const Users = () => {
  const { sendRequest, error, isLoading, clearError } = useHttpClient();

  const [loadedUsers, setLoadedUsers] = useState();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await sendRequest("http://localhost:5000/api/users");

        setLoadedUsers(response);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();
  }, [sendRequest]);
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </>
  );
};

export default Users;
