import math
import os
from datetime import datetime
from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func

BASE_DIR = Path(__file__).resolve().parent
STATIC_IMAGE_DIR = BASE_DIR / "static" / "images"
PROFILE_IMAGE_DIR = BASE_DIR / "profile" / "images"
DATABASE_PATH = BASE_DIR / "servicemart.db"

db = SQLAlchemy()


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "servicemart-local-secret")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", f"sqlite:///{DATABASE_PATH.as_posix()}")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    EMPLOYER_URL = os.getenv("EMPLOYER_URL", "https://example.com/careers")
    RENDER_SERVICE_NAME = os.getenv("RENDER_SERVICE_NAME", "service-mart-api")
    RENDER_EXTERNAL_URL = os.getenv("RENDER_EXTERNAL_URL", "")
    FRONTEND_URL = os.getenv("FRONTEND_URL", "*")


class ServiceProvider(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    service_type = db.Column(db.String(80), nullable=False)
    description = db.Column(db.Text, nullable=False)
    city = db.Column(db.String(80), nullable=False)
    neighborhood = db.Column(db.String(80), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    hourly_rate = db.Column(db.Float, nullable=False)
    image_filename = db.Column(db.String(255))
    employer_url = db.Column(db.String(255))
    careers_summary = db.Column(db.Text)


class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    provider_id = db.Column(db.Integer, db.ForeignKey("service_provider.id"), nullable=False)
    reviewer_name = db.Column(db.String(120), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)


class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    provider_id = db.Column(db.Integer, db.ForeignKey("service_provider.id"), nullable=False)
    customer_name = db.Column(db.String(120), nullable=False)
    customer_email = db.Column(db.String(120), nullable=False)
    booking_date = db.Column(db.String(40), nullable=False)
    notes = db.Column(db.Text)
    status = db.Column(db.String(40), nullable=False, default="pending")
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)


class Career(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    team = db.Column(db.String(80), nullable=False)
    location = db.Column(db.String(80), nullable=False)
    type = db.Column(db.String(40), nullable=False)
    description = db.Column(db.Text, nullable=False)
    apply_url = db.Column(db.String(255), nullable=False)


def create_app():
    STATIC_IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    PROFILE_IMAGE_DIR.mkdir(parents=True, exist_ok=True)

    app = Flask(__name__)
    app.config.from_object(Config)
    cors_origins = app.config["FRONTEND_URL"]
    CORS(app, resources={r"/api/*": {"origins": cors_origins}}, supports_credentials=True)
    db.init_app(app)

    with app.app_context():
        db.create_all()
        seed_data()

    register_routes(app)
    return app


def register_routes(app):
    @app.get("/api/health")
    def health_check():
        return jsonify({"status": "ok", "service": "Service Mart API"})

    @app.get("/api/meta")
    def meta():
        return jsonify(
            {
                "brand": "Service Mart",
                "tagline": "Nearby service providers, bookings, reviews, and careers in one place.",
                "employer_url": app.config["EMPLOYER_URL"],
                "render": {
                    "service_name": app.config["RENDER_SERVICE_NAME"],
                    "external_url": app.config["RENDER_EXTERNAL_URL"],
                },
            }
        )

    @app.get("/api/services")
    def list_services():
        query = request.args.get("query", "").strip().lower()
        category = request.args.get("category", "").strip().lower()
        lat = request.args.get("lat", type=float)
        lng = request.args.get("lng", type=float)

        providers = ServiceProvider.query.all()
        rating_map = get_rating_map()
        results = []

        for provider in providers:
            haystack = " ".join(
                [provider.name, provider.service_type, provider.description, provider.city, provider.neighborhood]
            ).lower()
            if query and query not in haystack:
                continue
            if category and provider.service_type.lower() != category:
                continue

            distance_km = None
            if lat is not None and lng is not None:
                distance_km = haversine(lat, lng, provider.latitude, provider.longitude)

            metrics = rating_map.get(provider.id, {"average_rating": 0.0, "review_count": 0})
            results.append(provider_to_dict(provider, metrics, distance_km))

        results.sort(
            key=lambda item: (
                item["distance_km"] is None,
                item["distance_km"] if item["distance_km"] is not None else 999999,
                -item["average_rating"],
            )
        )
        return jsonify(results)

    @app.get("/api/providers/<int:provider_id>")
    def get_provider(provider_id):
        provider = ServiceProvider.query.get_or_404(provider_id)
        reviews = Review.query.filter_by(provider_id=provider_id).order_by(Review.created_at.desc()).all()
        metrics = get_rating_map().get(provider_id, {"average_rating": 0.0, "review_count": 0})
        return jsonify({**provider_to_dict(provider, metrics), "reviews": [review_to_dict(item) for item in reviews]})

    @app.post("/api/providers/<int:provider_id>/reviews")
    def create_review(provider_id):
        ServiceProvider.query.get_or_404(provider_id)
        payload = request.get_json(force=True)
        rating = int(payload.get("rating", 0))
        comment = payload.get("comment", "").strip()
        if rating < 1 or rating > 5:
            return jsonify({"error": "Rating must be between 1 and 5."}), 400
        if not comment:
            return jsonify({"error": "Review comment is required."}), 400

        review = Review(
            provider_id=provider_id,
            reviewer_name=payload.get("reviewer_name", "").strip() or "Anonymous",
            rating=rating,
            comment=comment,
        )
        db.session.add(review)
        db.session.commit()
        return jsonify(review_to_dict(review)), 201

    @app.get("/api/bookings")
    def list_bookings():
        bookings = Booking.query.order_by(Booking.created_at.desc()).all()
        return jsonify([booking_to_dict(item) for item in bookings])

    @app.post("/api/bookings")
    def create_booking():
        payload = request.get_json(force=True)
        provider = ServiceProvider.query.get_or_404(payload.get("provider_id"))
        required = ["customer_name", "customer_email", "booking_date"]
        missing = [field for field in required if not payload.get(field)]
        if missing:
            return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

        booking = Booking(
            provider_id=provider.id,
            customer_name=payload["customer_name"].strip(),
            customer_email=payload["customer_email"].strip(),
            booking_date=payload["booking_date"].strip(),
            notes=payload.get("notes", "").strip(),
        )
        db.session.add(booking)
        db.session.commit()
        response = booking_to_dict(booking)
        response["provider_name"] = provider.name
        return jsonify(response), 201

    @app.get("/api/careers")
    def list_careers():
        roles = Career.query.order_by(Career.title.asc()).all()
        return jsonify({"employer_url": app.config["EMPLOYER_URL"], "roles": [career_to_dict(item) for item in roles]})

    @app.get("/static/images/<path:filename>")
    def static_images(filename):
        return send_from_directory(STATIC_IMAGE_DIR, filename)

    @app.get("/profile/images/<path:filename>")
    def profile_images(filename):
        return send_from_directory(PROFILE_IMAGE_DIR, filename)


def get_rating_map():
    rating_subquery = (
        db.session.query(
            Review.provider_id.label("provider_id"),
            func.avg(Review.rating).label("average_rating"),
            func.count(Review.id).label("review_count"),
        )
        .group_by(Review.provider_id)
        .subquery()
    )
    return {
        row.provider_id: {
            "average_rating": round(float(row.average_rating), 1),
            "review_count": row.review_count,
        }
        for row in db.session.query(rating_subquery).all()
    }


def haversine(lat1, lon1, lat2, lon2):
    radius_km = 6371
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)
    a = (
        math.sin(d_lat / 2) ** 2
        + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(d_lon / 2) ** 2
    )
    return round(2 * radius_km * math.asin(math.sqrt(a)), 1)


def provider_to_dict(provider, metrics, distance_km=None):
    image_url = f"/profile/images/{provider.image_filename}" if provider.image_filename else None
    return {
        "id": provider.id,
        "name": provider.name,
        "service_type": provider.service_type,
        "description": provider.description,
        "city": provider.city,
        "neighborhood": provider.neighborhood,
        "latitude": provider.latitude,
        "longitude": provider.longitude,
        "hourly_rate": provider.hourly_rate,
        "average_rating": metrics["average_rating"],
        "review_count": metrics["review_count"],
        "distance_km": distance_km,
        "image_url": image_url,
        "employer_url": provider.employer_url,
        "careers_summary": provider.careers_summary,
    }


def review_to_dict(review):
    return {
        "id": review.id,
        "provider_id": review.provider_id,
        "reviewer_name": review.reviewer_name,
        "rating": review.rating,
        "comment": review.comment,
        "created_at": review.created_at.isoformat(),
    }


def booking_to_dict(booking):
    return {
        "id": booking.id,
        "provider_id": booking.provider_id,
        "customer_name": booking.customer_name,
        "customer_email": booking.customer_email,
        "booking_date": booking.booking_date,
        "notes": booking.notes,
        "status": booking.status,
        "created_at": booking.created_at.isoformat(),
    }


def career_to_dict(career):
    return {
        "id": career.id,
        "title": career.title,
        "team": career.team,
        "location": career.location,
        "type": career.type,
        "description": career.description,
        "apply_url": career.apply_url,
    }


def seed_data():
    if ServiceProvider.query.count() == 0:
        providers = [
            ServiceProvider(
                name="Amina Home Care",
                service_type="Cleaner",
                description="Home cleaning, laundry support, and apartment turnover.",
                city="Nairobi",
                neighborhood="Westlands",
                latitude=-1.2676,
                longitude=36.8108,
                hourly_rate=12.0,
                image_filename="provider-01.txt",
                employer_url="https://example.com/employer/amina",
                careers_summary="Hiring full-time and part-time residential cleaners.",
            ),
            ServiceProvider(
                name="MetroFix Electric",
                service_type="Electrician",
                description="Certified electrical repairs, installations, and emergency troubleshooting.",
                city="Nairobi",
                neighborhood="Kilimani",
                latitude=-1.2921,
                longitude=36.7830,
                hourly_rate=18.0,
                image_filename="provider-02.txt",
                employer_url="https://example.com/employer/metrofix",
                careers_summary="Open roles for field technicians and dispatch support.",
            ),
            ServiceProvider(
                name="SwiftPipe Pros",
                service_type="Plumber",
                description="Leak repair, bathroom fitting, and routine water system maintenance.",
                city="Nairobi",
                neighborhood="Lavington",
                latitude=-1.2833,
                longitude=36.7605,
                hourly_rate=16.5,
                image_filename="provider-03.txt",
                employer_url="https://example.com/employer/swiftpipe",
                careers_summary="Growing the team for plumbers and provider support staff.",
            ),
        ]
        db.session.add_all(providers)
        db.session.flush()
        db.session.add_all(
            [
                Review(provider_id=providers[0].id, reviewer_name="Nancy", rating=5, comment="Fast response and great results."),
                Review(provider_id=providers[1].id, reviewer_name="Brian", rating=4, comment="Clear pricing and solid electrical diagnostics."),
                Review(provider_id=providers[2].id, reviewer_name="Julia", rating=5, comment="Resolved the plumbing issue the same day."),
            ]
        )

    if Career.query.count() == 0:
        db.session.add_all(
            [
                Career(
                    title="Community Operations Lead",
                    team="Operations",
                    location="Nairobi",
                    type="Full-time",
                    description="Own provider onboarding quality, local growth, and marketplace coverage.",
                    apply_url="https://example.com/careers/community-operations",
                ),
                Career(
                    title="Frontend Engineer",
                    team="Engineering",
                    location="Remote / Nairobi",
                    type="Full-time",
                    description="Build the marketplace experience for customers, providers, and recruiters.",
                    apply_url="https://example.com/careers/frontend-engineer",
                ),
                Career(
                    title="Provider Success Associate",
                    team="Customer Success",
                    location="Nairobi",
                    type="Contract",
                    description="Support provider retention, booking quality, and customer communication.",
                    apply_url="https://example.com/careers/provider-success",
                ),
            ]
        )

    placeholders = {
        PROFILE_IMAGE_DIR / "provider-01.txt": "Replace with a real profile photo for Amina Home Care.",
        PROFILE_IMAGE_DIR / "provider-02.txt": "Replace with a real profile photo for MetroFix Electric.",
        PROFILE_IMAGE_DIR / "provider-03.txt": "Replace with a real profile photo for SwiftPipe Pros.",
        STATIC_IMAGE_DIR / "brand-note.txt": "Store Service Mart brand assets here.",
    }
    for file_path, content in placeholders.items():
        if not file_path.exists():
            file_path.write_text(content, encoding="utf-8")

    db.session.commit()


app = create_app()


if __name__ == "__main__":
    app.run(debug=True)
