import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

const Listing = () => {
  SwiperCore.use([Navigation]);
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    console.log("test");
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/listing/${id}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
      } catch (error) {
        setError(true);
      }
    };
    fetchListing();
  }, [id]);

  console.log(listing);
  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && <p className="text-center my-7 text-2xl">Something Wrong!</p>}
      {listing && (
        <>
                  <Swiper navigation>
                      {listing.imageURL.map((image, index) => (
                          <SwiperSlide key={index}>
                              <div className="h-[500px]" style={{ background: `url(${image}) center no-repeat`, backgroundSize: "cover" }}></div>
                        </SwiperSlide>
                      ))}
          </Swiper>
        </>
      )}
    </main>
  );
};

export default Listing;
