from datetime import datetime
import uuid
from extensions import db

class User(db.Model):
    __tablename__="users"
    id=db.Column(db.String(36),primary_key=True, default=lambda:str(uuid.uuid4()))
    email=db.Column(db.String(255),unique=True,nullable=False)
    password_hash=db.Column(db.String(255),nullable=False)
    created_at=db.Column(db.DateTime, default=datetime.utcnow)
    updated_at=db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)