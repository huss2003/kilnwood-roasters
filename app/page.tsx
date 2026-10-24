import SmoothScroll from "@/components/SmoothScroll";
import Loader from "@/components/Loader";
import Cursor from "@/components/Cursor";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Manifesto from "@/components/Manifesto";
import Origins from "@/components/Origins";
import Process from "@/components/Process";
import Stats from "@/components/Stats";
import BrewClub from "@/components/BrewClub";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <>
      <SmoothScroll />
      <Loader />
      <Cursor />
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Manifesto />
        <Origins />
        <Process />
        <Stats />
        <BrewClub />
      </main>
      <Footer />
    </>
  );
}
