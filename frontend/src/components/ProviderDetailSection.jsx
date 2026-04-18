function ProviderDetailSection({
  bookingForm,
  onBookingChange,
  onBookingSubmit,
  onReviewChange,
  onReviewSubmit,
  provider,
  reviewForm
}) {
  if (!provider) {
    return (
      <section className="panel provider-detail" id="provider">
        <div className="empty-state">
          <h2>No providers match the current filters.</h2>
          <p>Try a broader search or switch categories.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="panel provider-detail" id="provider">
      <div className="section-head">
        <div>
          <p className="eyebrow">{provider.service_type}</p>
          <h2>{provider.name}</h2>
        </div>
        <div className="stats-chip">
          {provider.average_rating} / 5 - {provider.review_count} reviews
        </div>
      </div>

      <p className="detail-copy">{provider.description}</p>

      <div className="detail-grid">
        <div className="metric-box">
          <strong>Location</strong>
          <span>{provider.neighborhood}, {provider.city}</span>
        </div>
        <div className="metric-box">
          <strong>Premium rate</strong>
          <span>KES {provider.hourly_rate.toFixed(2)} / hour</span>
        </div>
        <div className="metric-box">
          <strong>Employer pathway</strong>
          <span>{provider.careers_summary}</span>
        </div>
      </div>

      <div className="split-grid">
        <form className="form-card" onSubmit={onBookingSubmit}>
          <p className="eyebrow">Booking</p>
          <h3>Reserve a premium service slot</h3>
          <input
            value={bookingForm.customer_name}
            onChange={(event) =>
              onBookingChange((current) => ({ ...current, customer_name: event.target.value }))
            }
            placeholder="Your name"
          />
          <input
            type="email"
            value={bookingForm.customer_email}
            onChange={(event) =>
              onBookingChange((current) => ({ ...current, customer_email: event.target.value }))
            }
            placeholder="Email"
          />
          <input
            type="date"
            value={bookingForm.booking_date}
            onChange={(event) =>
              onBookingChange((current) => ({ ...current, booking_date: event.target.value }))
            }
          />
          <textarea
            rows="4"
            value={bookingForm.notes}
            onChange={(event) =>
              onBookingChange((current) => ({ ...current, notes: event.target.value }))
            }
            placeholder="Describe the task and timing expectations"
          />
          <button type="submit" className="button primary">Send booking request</button>
        </form>

        <form className="form-card accent-card" onSubmit={onReviewSubmit}>
          <p className="eyebrow">Reviews</p>
          <h3>Publish your experience</h3>
          <input
            value={reviewForm.reviewer_name}
            onChange={(event) =>
              onReviewChange((current) => ({ ...current, reviewer_name: event.target.value }))
            }
            placeholder="Your name"
          />
          <select
            value={reviewForm.rating}
            onChange={(event) =>
              onReviewChange((current) => ({ ...current, rating: Number(event.target.value) }))
            }
          >
            {[5, 4, 3, 2, 1].map((rating) => (
              <option key={rating} value={rating}>{rating} stars</option>
            ))}
          </select>
          <textarea
            rows="5"
            value={reviewForm.comment}
            onChange={(event) =>
              onReviewChange((current) => ({ ...current, comment: event.target.value }))
            }
            placeholder="Describe quality, punctuality, and professionalism"
          />
          <button type="submit" className="button secondary">Post review</button>
        </form>
      </div>

      <div className="reviews-block">
        <div className="section-head compact">
          <div>
            <p className="eyebrow">Recent feedback</p>
            <h3>Customer reviews</h3>
          </div>
        </div>
        {provider.reviews.map((review) => (
          <article key={review.id} className="review-card">
            <div className="review-head">
              <strong>{review.reviewer_name}</strong>
              <span>{review.rating} / 5</span>
            </div>
            <p>{review.comment}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ProviderDetailSection;
