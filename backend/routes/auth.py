from flask import Blueprint,request,jsonify
from extensions import db,bcrypt, limiter
from models.user import User
from flask_jwt_extended import create_access_token,create_refresh_token,jwt_required,get_jwt_identity
from models.cycle import Cycle
from models.symptom import Symptom
from models.lab_report import LabReport
from models.lab_result import LabResult
import os
auth_bp=Blueprint("auth",__name__)
@auth_bp.route("/signup", methods=["POST"])
@limiter.limit("3 per minute")
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "Email already registered"}), 409

    password_hash = bcrypt.generate_password_hash(password).decode("utf-8")
    new_user = User(email=email, password_hash=password_hash)

    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Email already registered"}), 409

    return jsonify({"message": "User created successfully"}), 201


@auth_bp.route("/login",methods=["POST"])
@limiter.limit("5 per minute")
def login():
    data=request.get_json()
    email=data.get("email")
    password=data.get("password")
    if not email or not password:
        return jsonify({"error":"email and password are required"}), 400
    user=User.query.filter_by(email=email).first()
    if not user or not bcrypt.check_password_hash(user.password_hash,password):
        return jsonify({"error":"invalid credentials"}), 401 #we return a generic message so that we are not giving away important information, like if it is wrong password or wrong email, because it cane be helped to check which user is regsitered
    access_token=create_access_token(identity=user.id)
    refresh_token=create_refresh_token(identity=user.id)
    return jsonify({
        "access_token":access_token,
        "refresh_token":refresh_token,
        "user":{
            "id":user.id,"email":user.email
        }
    }),200

@auth_bp.route("/me",methods=["GET"])
@jwt_required()
def me():
    user_id=get_jwt_identity()
    user=User.query.get(user_id)
    if not user:
        return jsonify({"error":"User not found"}), 404
    return jsonify({
        "id":user.id,"email":user.email
    }), 200


@auth_bp.route("/refresh",methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    user_id=get_jwt_identity()
    new_access_token=create_access_token(identity=user_id)
    return jsonify({
        "access_token":new_access_token
    }),200


@auth_bp.route("/delete-account",methods=["DELETE"])
@jwt_required
def delete_account():
    user_id=get_jwt_identity()
    try:
        reports=LabReport.query.filter_by(user_id=user_id).all()
        for report in reports:
            LabResult.query.filter_by(report_id=report.id).delete()
            if report.filepath and os.path.exists(report.filepath):
                os.remove(report.filepath)
        LabReport.query.filter_by(user_id=user_id).delete()
        Cycle.query.filter_by(user_id=user_id).delete()
        Symptom.query.filter_by(user_id=user_id).delete()
        from models.user import User
        User.query.filter_by(id=user_id).delete()
        db.session.commit()
        return jsonify({"message": "Account deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Could not delete account"}), 500
    
@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({
        "id": user.id,
        "email": user.email,
        "display_name": user.display_name,
        "cycle_length": user.cycle_length or 28,
        "period_length": user.period_length or 5,
    }), 200


@auth_bp.route("/profile", methods=["PATCH"])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()

    if "display_name" in data:
        display_name = data["display_name"].strip()
        if len(display_name) > 100:
            return jsonify({"error": "Display name too long"}), 400
        user.display_name = display_name

    if "cycle_length" in data:
        cycle_length = int(data["cycle_length"])
        if not (15 <= cycle_length <= 60):
            return jsonify({"error": "Cycle length must be between 15 and 60 days"}), 400
        user.cycle_length = cycle_length

    if "period_length" in data:
        period_length = int(data["period_length"])
        if not (1 <= period_length <= 14):
            return jsonify({"error": "Period length must be between 1 and 14 days"}), 400
        user.period_length = period_length

    try:
        db.session.commit()
        return jsonify({
            "message": "Profile updated",
            "display_name": user.display_name,
            "cycle_length": user.cycle_length,
            "period_length": user.period_length,
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Could not update profile"}), 500