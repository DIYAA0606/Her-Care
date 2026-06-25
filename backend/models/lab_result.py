from extensions import db

class LabResult(db.Model):
    __tablename__ = "lab_results"
    
    id = db.Column(db.Integer, primary_key=True)
    report_id = db.Column(db.Integer, db.ForeignKey("labreports.id"), nullable=False)
    test_type = db.Column(db.String(50), nullable=False)  # e.g., 'TSH', 'HEMOGLOBIN'
    value = db.Column(db.Float, nullable=False)
    unit = db.Column(db.String(20), nullable=True)      
    report = db.relationship("LabReport", backref=db.backref("results", lazy=True))