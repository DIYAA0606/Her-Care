from datetime import datetime
from extensions import db

class Cycle(db.Model):
    __tablename__="cycles"

    id=db.Column(db.Integer,primary_key=True)
    user_id=db.Column(db.String(36),db.ForeignKey("users.id"),nullable=False)
    start_date=db.Column(db.Date,nullable=False)
    end_date=db.Column(db.Date, nullable=True)
    cycle_length=db.Column(db.Integer,nullable=True)
    period_length=db.Column(db.Integer,nullable=True)
    notes=db.Column(db.Text,nullable=True)
    created_at=db.Column(db.DateTime,default=datetime.utcnow)