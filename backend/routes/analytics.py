from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.cycle import Cycle
from models.symptom import Symptom
from models.lab_result import LabResult
from models.lab_report import LabReport
from extensions import db
from sqlalchemy import func

analytics_bp = Blueprint("analytics", __name__, url_prefix="/api/analytics")

# Normal ranges for common tests — sourced from standard medical references
NORMAL_RANGES = {
    "HEMOGLOBIN": {"min": 12.0, "max": 16.0, "unit": "g/dL"},
    "TSH": {"min": 0.4, "max": 4.5, "unit": "mIU/L"},
    "VITAMIN_D": {"min": 30.0, "max": 100.0, "unit": "ng/mL"},
    "FERRITIN": {"min": 12.0, "max": 150.0, "unit": "ng/mL"},
    "GLUCOSE": {"min": 70.0, "max": 100.0, "unit": "mg/dL"},
    "PLATELETS": {"min": 1.5, "max": 4.5, "unit": "lakh/µL"},
}

@analytics_bp.route("/", methods=["GET"])
@jwt_required()
def get_analytics():
    user_id = get_jwt_identity()
    result = {}

    # 1. Cycle analytics
    cycles = Cycle.query.filter_by(user_id=user_id).order_by(Cycle.start_date).all()
    result["cycle_count"] = len(cycles)

    sorted_cycles = sorted(cycles, key=lambda c: c.start_date)
    cycle_gaps = []
    for i in range(1, len(sorted_cycles)):
        gap = (sorted_cycles[i].start_date - sorted_cycles[i-1].start_date).days
        cycle_gaps.append(gap)
    result["avg_cycle_length"] = round(sum(cycle_gaps) / len(cycle_gaps), 1) if cycle_gaps else None

    date_lengths = []
    for c in cycles:
        if c.start_date and c.end_date:
            date_lengths.append((c.end_date - c.start_date).days)
    result["avg_period_length"] = round(sum(date_lengths) / len(date_lengths), 1) if date_lengths else None

    # 2. Symptom analytics
    symptoms = Symptom.query.filter_by(user_id=user_id).all()
    result["symptom_count"] = len(symptoms)

    symptom_freq = {}
    for s in symptoms:
        symptom_freq[s.symptom_type] = symptom_freq.get(s.symptom_type, 0) + 1
    result["most_frequent_symptoms"] = sorted(
        [{"symptom": k, "count": v} for k, v in symptom_freq.items()],
        key=lambda x: x["count"],
        reverse=True
    )[:3]

    # 3. Lab result trends
    trends = {}
    reports = LabReport.query.filter_by(user_id=user_id).order_by(LabReport.upload_date).all()

    for report in reports:
        for res in report.results:
            if res.test_type not in trends:
                trends[res.test_type] = []
            trends[res.test_type].append({
                "value": res.value,
                "date": report.upload_date.date().isoformat()
            })

    result["lab_trends"] = trends

    # 4. Health flags
    flags = []

    for test_type, readings in trends.items():
        if test_type not in NORMAL_RANGES:
            continue
        normal = NORMAL_RANGES[test_type]
        recent = readings[-1]["value"]

        if recent < normal["min"]:
            flags.append({
                "type": "low",
                "test": test_type,
                "message": f"Your recent {test_type} ({recent} {normal['unit']}) is below the normal range ({normal['min']}–{normal['max']}). Consider discussing this with your doctor.",
            })
        elif recent > normal["max"]:
            flags.append({
                "type": "high",
                "test": test_type,
                "message": f"Your recent {test_type} ({recent} {normal['unit']}) is above the normal range ({normal['min']}–{normal['max']}). Consider discussing this with your doctor.",
            })

        # trending down across 3+ readings
        if len(readings) >= 3:
            values = [r["value"] for r in readings[-3:]]
            if values[0] > values[1] > values[2]:
                flags.append({
                    "type": "trending_down",
                    "test": test_type,
                    "message": f"Your {test_type} has been consistently decreasing over your last 3 reports. Worth monitoring."
                })
            elif values[0] < values[1] < values[2]:
                flags.append({
                    "type": "trending_up",
                    "test": test_type,
                    "message": f"Your {test_type} has been consistently increasing over your last 3 reports. Worth monitoring."
                })

    # cycle irregularity flag
    if len(date_lengths) >= 3:
        avg = sum(date_lengths) / len(date_lengths)
        if max(date_lengths) - min(date_lengths) > 7:
            flags.append({
                "type": "irregular_cycle",
                "message": f"Your cycle length has varied by more than 7 days recently. This may be worth discussing with your doctor."
            })

    result["flags"] = flags

    return jsonify(result), 200