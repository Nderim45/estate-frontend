import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Search = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get("searchTerm");
    const type = urlParams.get("type");
    const parking = urlParams.get("parking");
    const furnished = urlParams.get("furnished");
    const offer = urlParams.get("offer");
    const sort = urlParams.get("sort");

    if (searchTerm || type || parking || furnished || offer || sort) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTerm || "",
        type: type || "all",
        parking: parking === "true" ? true : false,
        furnished: furnished === "true" ? true : false,
        offer: offer === "true" ? true : false,
        sort: sort || "created_at",
        order: "desc",
      });
    }

    const fetchData = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/listing/?${searchQuery}`
      );
      const data = await res.json();
      setListings(data);
      setLoading(false);
    };

    fetchData();
  }, [location.search]);

  const handleChange = (event) => {
    if (
      event.target.id === "all" ||
      event.target.id === "rent" ||
      event.target.id === "sale"
    ) {
      setSidebarData({
        ...sidebarData,
        type: event.target.id,
      });
    }
    if (event.target.id === "searchTerm") {
      setSidebarData({
        ...sidebarData,
        searchTerm: event.target.value,
      });
    }

    if (
      event.target.id === "parking" ||
      event.target.id === "furnished" ||
      event.target.id === "offer"
    ) {
      setSidebarData({
        ...sidebarData,
        [event.target.id]:
          event.target.checked || event.target.checked === "true"
            ? true
            : false,
      });
    }

    if (event.target.id === "sort_order") {
      const sort = event.target.value.split("_")[0];
      const order = event.target.value.split("_")[1];
      setSidebarData({
        ...sidebarData,
        sort,
        order,
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("type", sidebarData.type);
    urlParams.set("parking", sidebarData.parking);
    urlParams.set("furnished", sidebarData.furnished);
    urlParams.set("offer", sidebarData.offer);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap">Search Term:</label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search"
              className="border rounded-lg p-3 w-full"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                checked={sidebarData.type === "all"}
                onChange={handleChange}
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                checked={sidebarData.type === "rent"}
                onChange={handleChange}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                checked={sidebarData.type === "sale"}
                onChange={handleChange}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                checked={sidebarData.offer}
                onChange={handleChange}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                checked={sidebarData.parking}
                onChange={handleChange}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                checked={sidebarData.furnished}
                onChange={handleChange}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={"createdAt_desc"}
              id="sort_order"
              className="border rounded-lg p-3"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      <div className="">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing Results:
        </h1>
      </div>
    </div>
  );
};

export default Search;
