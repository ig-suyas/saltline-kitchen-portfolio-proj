import { HomeHero } from "@/components/home/HomeHero";
import { PlateSequence } from "@/components/home/PlateSequence";
import { Rooms } from "@/components/home/Rooms";
import { MenuCollage } from "@/components/home/MenuCollage";
import { TablePromo } from "@/components/home/TablePromo";
import { ReserveBand } from "@/components/home/ReserveBand";

export default function Home() {
  return (
    <>
      <HomeHero />
      <PlateSequence />
      <Rooms />
      <MenuCollage />
      <TablePromo />
      <ReserveBand />
    </>
  );
}
