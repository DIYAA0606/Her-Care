from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.symptom import Symptom
from extensions import db
from datetime import datetime

symptoms_bp = Blueprint("symptoms", __name__, url_prefix="/api/symptoms")

@symptoms_bp.route("/", methods=["POST"])
@jwt_required()
def add_symptom():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validation: Ensure required fields exist
    if not data or "symptom_type" not in data or "date" not in data:
        return jsonify({"message": "symptom_type and date are required"}), 400
    
    try:
        new_symptom = Symptom(
            user_id=user_id,
            symptom_type=data["symptom_type"], # Changed from 'name'
            date=datetime.strptime(data["date"], "%Y-%m-%d").date(), # Added date
            severity=data.get("severity", 1),
            notes=data.get("notes", "")
        )
        db.session.add(new_symptom)
        db.session.commit()
        return jsonify({"message": "Symptom added successfully"}), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@symptoms_bp.route("/", methods=["GET"])
@jwt_required()
def get_symptoms():
    user_id = get_jwt_identity()
    symptoms = Symptom.query.filter_by(user_id=user_id).all()
    
    return jsonify([{
        "id": s.id, 
        "symptom_type": s.symptom_type, 
        "severity": s.severity,
        "date": s.date.isoformat(),
        "notes":s.notes
    } for s in symptoms]), 200