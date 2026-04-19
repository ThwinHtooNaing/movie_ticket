import CinemasClient from "@/components/CinemaSection";

export default async function CinemasPage() {
  const res = await fetch("http://localhost:3000/api/cinemas?page=1&limit=6", {
    cache: "force-cache",
  });

  const data = await res.json();

  return <CinemasClient initialData={data} />;
}
