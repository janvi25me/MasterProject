import PropTypes from "prop-types";
import UserItem from "./UserItem";
import Card from "../../shared/components/UIElements/Card";
import "./UserList.css";

const UsersList = (props) => {
  if (props.items.users.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2 style={{ textAlign: "center" }}>No users found.</h2>
        </Card>
      </div>
    );
  }
  return (
    <ul className="users-list">
      {props.items.users.map((user, i) => (
        <UserItem
          key={`${user.id}-${i}`}
          id={user._id}
          image={user.image}
          name={user.name}
          placeCount={user.places.length}
        />
      ))}
    </ul>
  );
};

UsersList.propTypes = {
  items: PropTypes.object,
};

export default UsersList;
