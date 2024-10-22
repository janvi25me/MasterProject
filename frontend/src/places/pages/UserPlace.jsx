import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/Hooks/http-hook";

const UserPlace = () => {
  const [loadedPlaces, setLoadedPlaces] = useState();
  const { isLoading, error, clearError, sendRequest } = useHttpClient();

  const { userId } = useParams()
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await sendRequest(
          `http://localhost:5000/api/places/user/${userId}`
        );
        setLoadedPlaces(response.places);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPlaces();
  }, [sendRequest, userId]);

  const placeDeletedHandler = (deletedPlaceId) => {
setLoadedPlaces(prevPlaces => prevPlaces.filter (place => place.id !== deletedPlaceId)) 
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />}
    </>
  );
};

export default UserPlace;
