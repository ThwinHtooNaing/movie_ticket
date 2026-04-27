import Hero from "../components/Hero";
import MoviesSection from "@/components/MoviesSection";

export default async function Home() {
  

  return (
    <div>
      <Hero />
      <MoviesSection initialData={null} />
    </div>
  );
}
