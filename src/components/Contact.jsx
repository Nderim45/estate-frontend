import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchLandlord = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/user/${listing.userRef}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      const data = await res.json();
      setLandlord(data);
    };
    fetchLandlord();
  }, [listing.userRef]);

  const changeHandler = (e) => {
    setMessage(e.target.value);
  };

  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landlord?.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="5"
            value={message}
            onChange={changeHandler}
            placeholder="Enter your message here..."
            className="w-full border p-3 rounded-lg "
          ></textarea>
          <Link
            to={`mailto:${landlord?.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
};

export default Contact;
