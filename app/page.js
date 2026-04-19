import Hero from "../components/Hero";
import MoviesSection from "@/components/MoviesSection";

export default async function Home() {
  const res = await fetch("http://localhost:3000/api/movies?page=1&limit=8", {
      next: { revalidate: 10 },
  });

  const data = await res.json();

  return (
    <div>
      <Hero />
      <MoviesSection initialData={data} />
    </div>
  );
}
