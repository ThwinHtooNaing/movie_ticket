"use client";

import { useState, useEffect } from "react";
import styles from "./ReviewsTab.module.css";

export default function ReviewsTab({ movieId }) {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, text: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch(`/api/movies/${movieId}/reviews`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch (e) {}
    }
    loadReviews();
  }, [movieId]);

  const handleStarClick = (star) => {
    setNewReview((prev) => ({ ...prev, rating: star }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newReview.rating === 0 || !newReview.text.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/movies/${movieId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: newReview.rating * 2,
          review_text: newReview.text,
        }),
      });

      if (res.ok) {
        const newReviewData = await res.json();
        setReviews((prev) => [newReviewData, ...prev]);
        setNewReview({ rating: 0, text: "" });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating / 2);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={i <= fullStars ? styles.starFilled : styles.starEmpty}
        >
          ★
        </span>,
      );
    }
    return stars;
  };

  return (
    <div className={styles.reviews}>
      <h2 className={styles.sectionTitle}>Reviews</h2>

      <div className={styles.writeReview}>
        <h3>Write a Review</h3>
        <form onSubmit={handleSubmit}>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => handleStarClick(star)}
                className={
                  star <= newReview.rating
                    ? styles.starFilled
                    : styles.starEmpty
                }
              >
                ★
              </span>
            ))}
          </div>

          <textarea
            placeholder="Share your thoughts about this movie..."
            value={newReview.text}
            onChange={(e) =>
              setNewReview({ ...newReview, text: e.target.value })
            }
            rows="4"
          />

          <button type="submit" disabled={submitting || newReview.rating === 0}>
            {submitting ? "Posting..." : "Post Review"}
          </button>
        </form>
      </div>

      {/* Reviews List */}
      <div className={styles.reviewsList}>
        {reviews.length === 0 ? (
          <p className={styles.noReviews}>
            No reviews yet. Be the first to review!
          </p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <div>
                  <span className={styles.reviewer}>
                    {review.user_name || "Anonymous"}
                  </span>
                  <span className={styles.date}>
                    {new Date(review.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className={styles.reviewStars}>
                  {renderStars(review.rating)}
                </div>
              </div>
              <p className={styles.reviewText}>{review.review_text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
