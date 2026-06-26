from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.lab_report import LabReport
from models.lab_result import LabResult
from extensions import db
import os
import base64
from werkzeug.utils import secure_filename

reports_bp = Blueprint("reports", __name__, url_prefix="/api/reports")

from flask_cors import cross_origin
ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@reports_bp.route("/upload", methods=["POST"])
@jwt_required()
def upload_report():
    user_id = get_jwt_identity()

    if "file" not in request.files:
        return jsonify({"message": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"message": "No file selected"}), 400

    if not allowed_file(file.filename):
        return jsonify({"message": "Only PDF, PNG, JPG files allowed"}), 400

    filename = f"{user_id}_{secure_filename(file.filename)}"
    save_path = os.path.join(current_app.config["UPLOAD_FOLDER"], filename)
    file.save(save_path)

    new_report = LabReport(
        user_id=user_id,
        filename=filename,
        filepath=save_path
    )
    db.session.add(new_report)
    db.session.commit()

    # --- AI extraction ---
    extracted = []
    try:
        extracted = extract_lab_values(save_path, file.filename)
    except Exception as e:
        print(f"AI extraction failed: {e}")
        # don't crash — extraction failure is okay, user can add manually

    return jsonify({
        "message": "File uploaded successfully",
        "report_id": new_report.id,
        "extracted_values": extracted
    }), 201


def extract_lab_values(filepath, original_filename):
    """Send the uploaded file to Gemini and extract lab values."""
    import google.generativeai as genai
    import json

    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    model = genai.GenerativeModel("gemini-2.5-flash")

    ext = original_filename.rsplit(".", 1)[1].lower()

    with open(filepath, "rb") as f:
        file_data = f.read()

    if ext == "pdf":
        file_part = {
            "mime_type": "application/pdf",
            "data": base64.b64encode(file_data).decode("utf-8")
        }
    else:
        mime_map = {"jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png"}
        file_part = {
            "mime_type": mime_map.get(ext, "image/jpeg"),
            "data": base64.b64encode(file_data).decode("utf-8")
        }

    prompt = """Extract all lab test results from this report.
Return ONLY a JSON array, no other text, no markdown, no explanation.
Format: [{"test_type": "HEMOGLOBIN", "value": 11.2, "unit": "g/dL"}, ...]
Use uppercase for test_type. Only include tests with clear numeric values."""

    response = model.generate_content([
        {"mime_type": file_part["mime_type"], "data": file_part["data"]},
        prompt
    ])

    response_text = response.text.strip()
    
    # strip markdown code blocks if Gemini adds them
    if response_text.startswith("```"):
        response_text = response_text.split("```")[1]
        if response_text.startswith("json"):
            response_text = response_text[4:]
    print("Gemini raw response:", response_text)
    return json.loads(response_text.strip())


@reports_bp.route("/<int:report_id>/results", methods=["POST"])
@jwt_required()
def add_result(report_id):
    user_id = get_jwt_identity()

    report = LabReport.query.filter_by(id=report_id, user_id=user_id).first()
    if not report:
        return jsonify({"message": "Report not found"}), 404

    data = request.get_json()

    # handle both single result and bulk save (list of results)
    if isinstance(data, list):
        for item in data:
            if "test_type" not in item or "value" not in item:
                continue
            new_result = LabResult(
                report_id=report_id,
                test_type=item["test_type"].upper(),
                value=float(item["value"]),
                unit=item.get("unit", None)
            )
            db.session.add(new_result)
        db.session.commit()
        return jsonify({"message": "Results saved successfully"}), 201
    else:
        if not data or "test_type" not in data or "value" not in data:
            return jsonify({"message": "test_type and value are required"}), 400
        new_result = LabResult(
            report_id=report_id,
            test_type=data["test_type"].upper(),
            value=float(data["value"]),
            unit=data.get("unit", None)
        )
        db.session.add(new_result)
        db.session.commit()
        return jsonify({"message": "Result added successfully"}), 201


@reports_bp.route("/", methods=["GET"])
@jwt_required()
def get_reports():
    user_id = get_jwt_identity()
    reports = LabReport.query.filter_by(user_id=user_id).all()

    return jsonify([
        {
            "id": r.id,
            "filename": r.filename,
            "upload_date": r.upload_date.isoformat(),
            "results": [
                {
                    "id": result.id,
                    "test_type": result.test_type,
                    "value": result.value,
                    "unit": result.unit
                }
                for result in r.results
            ]
        }
        for r in reports
    ]), 200

@reports_bp.route("/tip", methods=["GET", "OPTIONS"])
@cross_origin(origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://hercare-frontend.vercel.app"
], supports_credentials=True)
@jwt_required(optional=True)
def get_health_tip():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    import google.generativeai as genai

    user_id = get_jwt_identity()

    try:
        from models.cycle import Cycle
        from models.symptom import Symptom

        cycles = Cycle.query.filter_by(user_id=user_id).order_by(Cycle.start_date.desc()).all()
        symptoms = Symptom.query.filter_by(user_id=user_id).order_by(Symptom.date.desc()).limit(10).all()
        reports = LabReport.query.filter_by(user_id=user_id).count()

        cycle_count = len(cycles)
        symptom_count = len(symptoms)

        avg_cycle_length = None
        if cycle_count >= 2:
            lengths = []
            for i in range(len(cycles) - 1):
                if cycles[i].start_date and cycles[i + 1].start_date:
                    diff = (cycles[i].start_date - cycles[i + 1].start_date).days
                    if 15 <= diff <= 60:
                        lengths.append(diff)
            if lengths:
                avg_cycle_length = round(sum(lengths) / len(lengths), 1)

        last_cycle_date = cycles[0].start_date.strftime("%B %d") if cycles else None
        recent_symptoms = list(set([s.symptom_type for s in symptoms[:5]])) if symptoms else []

        stats_summary = f"""
User health summary:
- Total cycles logged: {cycle_count}
- Average cycle length: {f"{avg_cycle_length} days" if avg_cycle_length else "not enough data"}
- Last cycle started: {last_cycle_date or "never"}
- Recent symptoms: {", ".join(recent_symptoms) if recent_symptoms else "none logged"}
- Lab reports uploaded: {reports}
"""

        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        model = genai.GenerativeModel("gemini-2.5-flash")

        prompt = f"""You are a warm, calm health companion in a women's health app called HerCare.
Based on this user's health data, give ONE short, caring observation or gentle tip.
Keep it under 2 sentences. Be specific to their data. Do not give medical advice.
Do not start with "I". Sound like a thoughtful friend, not a doctor or a bot.
If there is very little data, encourage them warmly to keep tracking.

{stats_summary}

Respond with only the tip text, nothing else."""

        response = model.generate_content(prompt)
        tip = response.text.strip()

        return jsonify({"tip": tip}), 200

    except Exception as e:
        print(f"Tip generation failed: {e}")
        return jsonify({"tip": "Keep tracking your health — every entry helps build a clearer picture of your wellbeing."}), 200