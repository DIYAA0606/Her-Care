from extensions import db
from datetime import datetime
class LabReport(db.Model):
    __tablename__="labreports"
    id=db.Column(db.Integer, primary_key=True)
    user_id=db.Column(db.String(36),db.ForeignKey("users.id"),nullable=False)
    filename=db.Column(db.String(255),nullable=True)
    filepath=db.Column(db.String(255),nullable=True)
    upload_date=db.Column(db.DateTime,default=datetime.utcnow)