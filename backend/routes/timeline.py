from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.cycle import Cycle
from models.symptom import Symptom
from models.lab_report import LabReport

timeline_bp = Blueprint("timeline", __name__, url_prefix="/api/timeline")

@timeline_bp.route("/", methods=["GET"])
@jwt_required()
def get_timeline():
    user_id = get_jwt_identity()
    events = []

    for c in Cycle.query.filter_by(user_id=user_id).all():
        events.append({
            "type": "cycle",
            "date": c.start_date.isoformat(),
            "data": {
                "start_date": c.start_date.isoformat(),
                "end_date": c.end_date.isoformat() if c.end_date else None,
                "notes": c.notes
            }
        })

    for s in Symptom.query.filter_by(user_id=user_id).all():
        events.append({
            "type": "symptom",
            "date": s.date.isoformat(),
            "data": {
                "symptom_type": s.symptom_type,
                "severity": s.severity,
                "notes": s.notes
            }
        })

    for r in LabReport.query.filter_by(user_id=user_id).all():
        events.append({
            "type": "lab_report",
            "date": r.upload_date.date().isoformat(),
            "data": {
                "filename": r.filename,
                "results": [
                    {"test_type": res.test_type, "value": res.value, "unit": res.unit}
                    for res in r.results
                ]
            }
        })

    events.sort(key=lambda x: x["date"], reverse=True)

    return jsonify(events), 200