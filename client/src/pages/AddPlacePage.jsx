import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import PhotosUploader from "../components/PhotosUploader.jsx";
import Perks from "../components/Perks.jsx";
import AccountNav from "../components/AccountNav.jsx";
import { toast } from "react-toastify";

export default function AddPlacePage() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [price, setPrice] = useState(100);
  const [redirect, setRedirect] = useState(false);

  // Error state for validation
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!id) {
      return;
    }
    axios
      .get("/api/places/" + id)
      .then((response) => {
        const { data } = response;
        setTitle(data.title);
        setAddress(data.address);
        setAddedPhotos(data.photos);
        setDescription(data.description);
        setPerks(data.perks);
        setExtraInfo(data.extraInfo);
        setCheckIn(data.checkIn);
        setCheckOut(data.checkOut);
        setMaxGuests(data.maxGuests);
        setPrice(data.price);
      })
      .catch((e) => {
        toast.error("Something went wrong, please reload the page!");
        console.log(e);
      });
  }, [id]);

  function inputHeader(text) {
    return <h2 className="text-2xl mt-4">{text}</h2>;
  }

  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }

  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  function validateForm() {
    const newErrors = {};
  
    if (!title) newErrors.title = "Title is required.";
    if (!address) newErrors.address = "Address is required.";
    if (addedPhotos.length === 0) newErrors.addedPhotos = "At least one photo is required.";
    if (!description) newErrors.description = "Description is required.";
  
    if (!checkIn) {
      newErrors.checkIn = "Check-in time is required.";
    }
  
    if (!checkOut) {
      newErrors.checkOut = "Check-out time is required.";
    }
  
    if (!maxGuests || maxGuests <= 0) newErrors.maxGuests = "Maximum number of guests must be greater than zero.";
    if (!price || price <= 0) newErrors.price = "Price per night must be greater than zero.";
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function savePlace(ev) {
    ev.preventDefault();
    if (!validateForm()) {
      return;
    }

    const placeData = {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    };

    if (id) {
      // Update an existing place
      toast.promise(
        axios
          .put("/api/places", { id, ...placeData })
          .then(() => setRedirect(true)),
        {
          pending: "Updating your place...",
          success: "Place updated successfully! 🎉",
          error: "Failed to update the place. Please try again.",
        }
      );
    } else {
      // Add a new place
      toast.promise(
        axios.post("/api/places", placeData).then(() => setRedirect(true)),
        {
          pending: "Adding your new place...",
          success: "New place added successfully!",
          error: "Failed to add the new place. Please try again.",
        }
      );
    }
  }

  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }

  return (
    <div>
      <AccountNav />
      <form onSubmit={savePlace}>
        {preInput(
          "Title",
          "Title for your place. should be short and catchy as in advertisement"
        )}
        <input
          type="text"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
          placeholder="title, for example: My lovely apt"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

        {preInput("Address", "Address to this place")}
        <input
          type="text"
          value={address}
          onChange={(ev) => setAddress(ev.target.value)}
          placeholder="address"
        />
        {errors.address && (
          <p className="text-red-500 text-sm">{errors.address}</p>
        )}

        {preInput("Photos", "more = better")}
        <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
        {errors.addedPhotos && (
          <p className="text-red-500 text-sm">{errors.addedPhotos}</p>
        )}

        {preInput("Description", "description of the place")}
        <textarea
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description}</p>
        )}

        {preInput("Perks", "select all the perks of your place")}
        <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <Perks selected={perks} onChange={setPerks} />
        </div>
        {preInput("Extra info", "house rules, etc")}
        <textarea
          value={extraInfo}
          onChange={(ev) => setExtraInfo(ev.target.value)}
        />
        {preInput(
          "Check in&out times",
          "add check in and out times, remember to have some time window for cleaning the room between guests"
        )}
        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mt-2 -mb-1">Check in time</h3>
            <input
              type="text"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
              placeholder="14"
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Check out time</h3>
            <input
              type="text"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
              placeholder="11"
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Max number of guests</h3>
            <input
              type="number"
              value={maxGuests}
              onChange={(ev) => setMaxGuests(ev.target.value)}
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Price per night</h3>
            <input
              type="number"
              value={price}
              onChange={(ev) => setPrice(ev.target.value)}
            />
          </div>
        </div>
        {(errors.checkIn ||
          errors.checkOut ||
          errors.maxGuests ||
          errors.price) && (
          <div className="text-red-500 text-sm">
            {errors.checkIn && <p>{errors.checkIn}</p>}
            {errors.checkOut && <p>{errors.checkOut}</p>}
            {errors.maxGuests && <p>{errors.maxGuests}</p>}
            {errors.price && <p>{errors.price}</p>}
          </div>
        )}
        <button className="primary my-4">Save</button>
      </form>
    </div>
  );
}
