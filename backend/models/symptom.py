from datetime import datetime
from extensions import db

class Symptom(db.Model):
    __tablename__="symptoms"
    id=db.Column(db.Integer,primary_key=True)
    user_id=db.Column(db.String(36),db.ForeignKey("users.id"),nullable=False)
    date=db.Column(db.Date,nullable=False)
    symptom_type = db.Column(db.String(100), nullable=False)
    severity=db.Column(db.Integer,nullable=True)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)