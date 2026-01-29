import { useRef } from "react";
import Banner from "./Banner";
import NewReleasesPage from "./NewReleasesPage";
import Newsletter from "./Newsletter";
import Recommended from "./Recommended";
import SpecialOffersPage from "./SpecialOffersPage";
import TopSellers from "./TopSellers";

const Home = () => {
  const subscribeRef = useRef(null);

  const scrollToSubscribe = () => {
    subscribeRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  return (
    <>
      <Banner />
      <NewReleasesPage scrollToSubscribe={scrollToSubscribe} />
      <TopSellers />
      <Recommended />
      <SpecialOffersPage />
      <Newsletter ref={subscribeRef} />
    </>
  );
};

export default Home;
