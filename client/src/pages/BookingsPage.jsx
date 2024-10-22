import axios from "axios";
import { useEffect, useState } from "react";
import AccountNav from "../components/AccountNav";
import { Link } from "react-router-dom";
import PlaceImg from "../components/PlaceImg";
import BookingDates from "../components/BookingDates";
import { toast } from "react-toastify";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get("/api/bookings").then((response) => {
      setBookings(response.data);
    });
  }, []);

  const handleCancelBooking = (bookingId) => {
    toast.promise(
      axios
        .delete(`/api/bookings/${bookingId}`)
        .then((response) => {
          setBookings((prevBookings) =>
            prevBookings.filter((booking) => booking._id !== bookingId)
          );
          toast.success("Booking canceled successfully!");
        })
        .catch((error) => {
          toast.error(
            error.response?.data?.error ||
              "Error canceling booking. Please try again."
          );
        }),
      {
        pending: "Canceling booking...",
      }
    );
  };

  return (
    <div>
      <AccountNav />
      <div>
        {bookings?.length > 0 ? (
          bookings.map((booking) => (
            <div
              className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl items-center"
              key={booking._id}
            >
              <Link
                to={`/account/bookings/${booking._id}`}
                className="flex gap-4 bg-gray-200 rounded-2xl overflow-hidden mb-4 p-4 items-center"
                key={booking._id}
              >
                <div className="w-48">
                  <PlaceImg place={booking.place} />
                </div>
                <div className="py-3 pr-3 grow">
                  <h2 className="text-xl">{booking.place.title}</h2>
                  <div className="text-xl">
                    <BookingDates
                      booking={booking}
                      className="mb-2 mt-4 text-gray-500"
                    />
                    <div className="flex gap-1 items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-8 h-8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                        />
                      </svg>
                      <span className="text-2xl">
                        Total price: ${booking.price}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
              <button
                onClick={() => handleCancelBooking(booking._id)}
                className="flex items-center justify-center ml-auto bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#FFFFFF"
                >
                  <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                </svg>
                Cancel Booking
              </button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center mt-20 text-center">
            <div className="mt-30 flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="40px"
                viewBox="0 -960 960 960"
                width="40px"
                fill="#000000"
              >
                <path d="M618.67-240v-131.33H490Q462-312 408-276t-128 36q-100 0-170-70T40-480q0-100 70-170t170-70q74 0 128 36t82 95.33h266V-522H444.67q-8-41.67-51.67-86.5t-113-44.83q-72 0-122.67 50.66Q106.67-552 106.67-480t50.66 122.67Q208-306.67 280-306.67q69.33 0 113-44.83t51.58-86.5H688v131.33h68V-240H618.67ZM280-408q30.33 0 51.17-20.83Q352-449.67 352-480q0-30.33-20.83-51.17Q310.33-552 280-552q-30.33 0-51.17 20.83Q208-510.33 208-480q0 30.33 20.83 51.17Q249.67-408 280-408Zm0-72Zm599.88 240q-14.21 0-23.71-9.62-9.5-9.61-9.5-23.83 0-14.22 9.61-23.72 9.62-9.5 23.84-9.5 14.21 0 23.71 9.62t9.5 23.83q0 14.22-9.61 23.72-9.62 9.5-23.84 9.5Zm-33.21-133.33v-215.34h66.66v215.34h-66.66Z" />
              </svg>
              <h2 className="text-2xl font-semibold mb-2">
                Uh-oh, you've got no place to stay yet.
              </h2>
              <p className="text-lg text-gray-600">
                <Link to="/" className="text-blue-600 hover:underline">
                  Browse available accommodations now!
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
