import PropTypes from "prop-types";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import PlaceItem from "./PlaceItem";

import "./PlaceList.css";

const PlaceList = (props) => {
  // console.log(props)
  if (props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
        <h2 style={{textAlign:'center'}}>No places found. Maybe create one?</h2>
        <Button to='/places/new'>Share Place</Button>
        </Card>
      </div>
    );
  }
  return (
    <ul className="place-list">
      {props.items.map((place) => (
        <PlaceItem
          key={place.id}
          id={place._id}
          image={place.image}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator}
          coordinates={place.location}
          onDelete = {props.onDeletePlace}
        />
      ))}
    </ul>
  );
};

PlaceList.propTypes = {
  items: PropTypes.object
}

export default PlaceList;
