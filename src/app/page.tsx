import { auth } from "@/auth";
import MeteorShower from "@/backforunds/MeteorShower";
import HomePage from "@/components/layout/homepage";

export default async function Home() {
  return (
    <>
      <MeteorShower />
      <HomePage />
    </>
  );
}
