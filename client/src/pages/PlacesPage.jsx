import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountNav from "../components/AccountNav";
import axios from "axios";
import PlaceImg from "../components/PlaceImg";
import { toast } from "react-toastify";

export default function PlacesPage() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get("/api/places/owner-places").then(({ data }) => {
      setPlaces(data);
    });
  }, []);

  const handleDelete = (placeId) => {
    toast.promise(
      axios.delete(`/api/places/${placeId}`),
      {
        pending: "Deleting place...",
        success: "Place deleted successfully!",
        error: {
          render({ data }) {
            const errorMessage =
              data?.response?.data?.message || "Error deleting place.";
            return errorMessage; 
          },
        },
      }
    )
      .then(() => {
        setPlaces((prevPlaces) =>
          prevPlaces.filter((place) => place._id !== placeId)
        );
      })
      .catch((error) => {
        console.error("Error deleting place:", error);
      });
  };

  return (
    <div>
      <AccountNav />
      <div className="text-center">
        <Link
          className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
          to={"/account/places/new"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
              clipRule="evenodd"
            />
          </svg>
          Add new place
        </Link>
      </div>

      {places.length > 0 ? (
        <div className="mt-4">
          {places.map((place) => (
            <div
              className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl items-center"
              key={place._id}
            >
              <Link
                to={"/account/places/" + place._id}
                className="flex items-center gap-4"
              >
                <div className="w-48 h-48 bg-gray-300 rounded-2xl overflow-hidden flex items-center justify-center">
                  <PlaceImg
                    place={place}
                    className="object-cover h-full w-full"
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-bold">{place.title}</h2>
                    <p className="text-sm mt-1 text-gray-500">
                      {place.description}
                    </p>
                  </div>
                  <div className="mt-4 text-sm text-gray-700">
                    <p>Max guests: {place.maxGuests}</p>
                    <p>Price per night: ${place.price}</p>
                  </div>
                </div>
              </Link>
              <button
                onClick={() => handleDelete(place._id)}
                className="flex items-center justify-center ml-auto bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600"
              >
                <svg
                className="mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  height="21px"
                  viewBox="0 -960 960 960"
                  width="21px"
                  fill="#FFFFFF"
                >
                  <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                </svg>
                Remove Accomodation
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-2xl mt-4 text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="48px"
            viewBox="0 -960 960 960"
            width="48px"
            fill="#000000"
          >
            <path d="M160-120v-401l-84 64-36-48 120-91v-114h60v68l260-198 440 336-36 47-84-64v401H160Zm60-60h230v-160h60v160h230v-387L480-765 220-567v387Zm-60-580q0-46 32.5-78t77.5-32q21.25 0 35.63-15Q320-900 320-920h60q0 45-32.08 77.5Q315.83-810 270-810q-20 0-35 14.37-15 14.38-15 35.63h-60Zm60 580h520-520Z" />
          </svg>
          <p className="text-lg font-semibold">
            You have no accommodations posted on Airbnb yet!
          </p>
        </div>
      )}
    </div>
  );
}
