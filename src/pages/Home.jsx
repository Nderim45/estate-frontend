import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ListingCard from "../components/ListingCard";

const Home = () => {
  SwiperCore.use([Navigation]);

  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_APP_BACKEND_URL}/listing/?offer=true&limit=4`
        );
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {}
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_APP_BACKEND_URL}/listing/?type=rent&limit=4`
        );
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {}
    };

    const fetchSaleListings = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/listing/?type=sale&limit=4`
      );
      const data = await res.json();
      setSaleListings(data);
    };
    fetchOfferListings();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find Your Next Home <span className="text-slate-500">Perfect</span>{" "}
          <br /> place with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          RealEstate will help you find your home fast, easy and comfortable.{" "}
          <br /> Our expert team is always avalible to help you find your
          perfect home.
        </div>
        <Link
          to="/search"
          className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
        >
          Let's get started
        </Link>
      </div>
      <Swiper navigation>
        {offerListings?.length > 1 &&
          offerListings.map((listing) => (
            <SwiperSlide>
              <div
                style={{
                  background: `url(${listing.imageURL[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[500px]"
                key={listing._id}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      <div className="max-w-7xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings?.length > 1 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent Offers
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to="/search?offer=true"
              >
                Show More Offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => (
                <ListingCard listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings?.length > 1 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent Place For Rent
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to="/search?type=rent"
              >
                Show More Places For Rent
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((listing) => (
                <ListingCard listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings?.length > 1 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent Place For Sale
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to="/search?type=sale"
              >
                Show More Places For Sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListings.map((listing) => (
                <ListingCard listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
