from datetime import datetime
import uuid
from extensions import db

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    display_name = db.Column(db.String(100), nullable=True)
    cycle_length = db.Column(db.Integer, default=28, nullable=True)
    period_length = db.Column(db.Integer, default=5, nullable=True)

    # Cascade relationships — when user deleted, all their data deletes automatically
    cycles = db.relationship("Cycle", backref="user", lazy=True, cascade="all, delete-orphan")
    symptoms = db.relationship("Symptom", backref="user", lazy=True, cascade="all, delete-orphan")
    lab_reports = db.relationship("LabReport", backref="user", lazy=True, cascade="all, delete-orphan")