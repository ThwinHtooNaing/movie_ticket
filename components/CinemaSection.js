"use client";

import { useState, useEffect } from "react";
import CinemaCard from "@/components/CinemaCard";
import styles from "@/components/CinemasPage.module.css";
import NoCinemaIcon from "@/public/images/no-cinema.png";

const districts = [
  { label: "ALL LOCATIONS", value: null },
  { label: "PATHUM WAN", value: "Pathum Wan" },
  { label: "KHLONG SAN", value: "Khlong San" },
  { label: "WATTHANA", value: "Watthana" },
  { label: "RIVERSIDE", value: "Riverside" },
];

export default function CinemasClient({ initialData }) {
  
  const [cinemas, setCinemas] = useState(initialData?.data || []);
  const [pagination, setPagination] = useState(
    initialData?.pagination || { total: 0, loaded: 0 },
  );

  const [limit, setLimit] = useState(6);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [loading, setLoading] = useState(false);
  const [navbarHidden, setNavbarHidden] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const fetchCinemas = async () => {
    setLoading(true);

    let url = `/api/cinemas?page=1&limit=${limit}`;
    if (selectedDistrict) {
      url += `&address=${encodeURIComponent(selectedDistrict)}`;
    }

    try {
      const res = await fetch(url);
      const json = await res.json();

      setCinemas(json.data || []);
      setPagination(json.pagination || { total: 0, loaded: 0 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      return;
    }

    fetchCinemas();
  }, [limit, selectedDistrict]);

  // Navbar listener (unchanged)
  useEffect(() => {
    const handleNavbarChange = (e) => {
      setNavbarHidden(e.detail.hidden);
    };

    window.addEventListener("navbarChange", handleNavbarChange);
    return () => window.removeEventListener("navbarChange", handleNavbarChange);
  }, []);

  const handleLoadMore = () => setLimit((prev) => prev + 6);

  const handleDistrictClick = (value) => {
    setSelectedDistrict(value);
    setLimit(6);
  };

  return (
    <div className={`${styles.page} ${!navbarHidden ? styles.navHidden : ""}`}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Cinemas in Bangkok</h1>
          <p className={styles.subtitle}>
            Experience the pinnacle of cinematography in world-class venues
            across the city.
          </p>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {districts.map((district) => (
            <button
              key={district.label}
              onClick={() => handleDistrictClick(district.value)}
              className={`${styles.tab} ${
                selectedDistrict === district.value ? styles.tabActive : ""
              }`}
            >
              {district.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && <p>Loading cinemas...</p>}

        {/* Grid */}
        <div className={styles.grid}>
          {!loading && cinemas.length > 0
            ? cinemas.map((cinema) => (
                <CinemaCard key={cinema.id} cinema={cinema} />
              ))
            : !loading && (
                <div className={styles.noResults}>
                  <img src={NoCinemaIcon.src} alt="No cinemas" />
                  <p>No cinemas found</p>
                </div>
              )}
        </div>

        {/* Pagination */}
        {!loading && pagination.total > 0 && cinemas.length > 0 && (
          <div className={styles.paginationSection}>
            <div>
              <span className={styles.showing}>
                Showing <span className={styles.highlight}>
                  {pagination.loaded} of {pagination.total}
                </span>
              </span>
            </div>

            <div className={styles.line}></div>

            {pagination.loaded < pagination.total && (
              <button onClick={handleLoadMore} className={styles.loadMore}>
                Load More Cinemas
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
