from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.cycle import Cycle
from extensions import db
from datetime import datetime

cycles_bp = Blueprint("cycles", __name__, url_prefix="/api/cycles")

@cycles_bp.route("/", methods=["POST"])
@jwt_required()
def create_cycle():
    user_id = get_jwt_identity()
    data = request.get_json()

    # Basic validation
    if not data or "start_date" not in data:
        return jsonify({"message": "start_date is required"}), 400
    try:
        start_date = datetime.strptime(data["start_date"], "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"message": "Invalid date format. Use YYYY-MM-DD"}), 400
    end_date=None
    try:
        end_date = datetime.strptime(data["end_date"], "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"message": "Invalid date format. Use YYYY-MM-DD"}), 400
    if end_date<start_date:
        return jsonify({"message": "end_Date cannot be before start_date"}), 400
    try:
        new_cycle = Cycle(
    user_id=user_id,
    start_date=datetime.strptime(data["start_date"], "%Y-%m-%d").date(),
    end_date=datetime.strptime(data["end_date"], "%Y-%m-%d").date() if data.get("end_date") else None,
    notes=data.get("notes", None)
)
        db.session.add(new_cycle)
        db.session.commit()
        return jsonify({"message": "Cycle created successfully", "id": new_cycle.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Could not save cycle"}), 500

@cycles_bp.route("/", methods=["GET"])
@jwt_required()
def get_cycles():
    user_id = get_jwt_identity()
    cycles = Cycle.query.filter_by(user_id=user_id).all()
    
    return jsonify([
    {
        "id": c.id,
        "start_date": c.start_date.isoformat(),
        "end_date": c.end_date.isoformat() if c.end_date else None,
        "cycle_length": c.cycle_length,
        "period_length": c.period_length,
        "notes": c.notes
    }
    for c in cycles
]), 200