import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUser,
} from "../redux/user/userSlice";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [succesfullUpdate, setSuccesfullUpdate] = useState(false);
  const [listingError, setListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },

      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.id]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      dispatch(updateUserStart(formData));
      const res = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/user/update/${
          currentUser._id
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setSuccesfullUpdate(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/user/delete/${
          currentUser._id
        }`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      localStorage.removeItem("access_token");
      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = () => {
    dispatch(signOutUser());
    localStorage.removeItem("access_token");
  };

  const handleShowListings = async () => {
    try {
      setListingError(false);
      const res = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/user/listings/${
          currentUser._id
        }`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      const data = await res.json();
      if (data.success === false) {
        setListingError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setListingError(true);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt=""
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm text-center">
          {fileUploadError ? (
            <span className="text-red-700">Error Image Upload</span>
          ) : filePercentage > 0 && filePercentage < 100 ? (
            <span className="text-slate-700">Uploading {filePercentage}%</span>
          ) : filePercentage === 100 ? (
            <span className="text-green-700">Succesfully Uploaded</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="Username"
          id="username"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="E-mail"
          id="email"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          to="/create-listing"
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          className="text-red-700 cursor-pointer"
          onClick={handleDeleteUser}
        >
          Delete Account
        </span>
        <span className="text-red-700 cursor-pointer" onClick={handleSignOut}>
          Sign Out
        </span>
      </div>
      {error && <p className="text-red-700 mt-5">{error}</p>}
      {succesfullUpdate && (
        <p className="text-green-700 mt-5">Profile Updated</p>
      )}
      <button onClick={handleShowListings} className="text-green-700 w-full">
        Show Listings
      </button>
      {listingError && <p className="text-red-700 mt-5">Error showing listings</p>}
      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
         { userListings.map((listing) => (
          <div
            key={listing._id}
            className="border rounded-lg p-3 flex justify-between items-center gap-4"
          >
            <Link to={`/listing/${listing._id}`}>
              <img
                src={listing.imageURL[0]}
                alt="listing cover"
                className="h-16 w-16 object-contain"
              />
            </Link>
            <Link
              className="text-slate-700 font-semibold  hover:underline truncate flex-1"
              to={`/listing/${listing._id}`}
            >
              <p>{listing.name}</p>
            </Link>

            <div className="flex flex-col item-center">
              <button
                onClick={() => handleListingDelete(listing._id)}
                className="text-red-700 uppercase"
              >
                Delete
              </button>
              <Link to={`/update-listing/${listing._id}`}>
                <button className="text-green-700 uppercase">Edit</button>
              </Link>
            </div>
          </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
