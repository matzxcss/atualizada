import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PorscheGallery from "@/components/PorscheGallery";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <PorscheGallery />
    </div>
  );
};

export default Home;