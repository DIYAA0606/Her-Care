from flask import Blueprint, send_file, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
import io
from datetime import date
from models.cycle import Cycle
from models.symptom import Symptom
from models.lab_result import LabResult
from models.lab_report import LabReport
# import NORMAL_RANGES from analytics
NORMAL_RANGES = {
    "HEMOGLOBIN": {"min": 12.0, "max": 16.0, "unit": "g/dL"},
    "TSH": {"min": 0.4, "max": 4.5, "unit": "mIU/L"},
    "VITAMIN_D": {"min": 30.0, "max": 100.0, "unit": "ng/mL"},
    "FERRITIN": {"min": 12.0, "max": 150.0, "unit": "ng/mL"},
    "GLUCOSE": {"min": 70.0, "max": 100.0, "unit": "mg/dL"},
    "PLATELETS": {"min": 1.5, "max": 4.5, "unit": "lakh/µL"},
}

export_bp = Blueprint("export", __name__, url_prefix="/api/export")

@export_bp.route("/pdf", methods=["GET"])
@jwt_required()
def generate_pdf():
    user_id = get_jwt_identity()
    
    # 1. fetch the data (cycles, symptoms, lab reports)
    # hint: same queries as analytics route
    cycles = Cycle.query.filter_by(user_id=user_id).all()
    symptoms=Symptom.query.filter_by(user_id=user_id).all()
    reports = LabReport.query.filter_by(user_id=user_id).order_by(LabReport.upload_date).all()
    
    # 2. create the PDF buffer
    buffer = io.BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    y = height - 50 

    def draw_line(text, size=11, bold=False, gap=20):
        nonlocal y
        font = "Helvetica-Bold" if bold else "Helvetica"
        pdf.setFont(font, size)
        pdf.drawString(50, y, text)
        y -= gap

    def check_space():
        nonlocal y
        if y < 80:
            pdf.showPage()
            y = height - 50
    # 3. draw content on the PDF
    # - title
    # - user info
    # - cycle summary
    # - symptoms
    # - lab results
    # - health flags
    draw_line("HerCare Health Summary", size=18, bold=True, gap=25)
    draw_line(f"Generated: {date.today().isoformat()}", size=10, gap=25)

    # cycle summary
    draw_line("CYCLE SUMMARY", bold=True, gap=18)
    draw_line(f"Total cycles logged: {len(cycles)}", gap=16)

    date_lengths = []
    for c in cycles:
        if c.start_date and c.end_date:
            date_lengths.append((c.end_date - c.start_date).days)

    if date_lengths:
        avg = round(sum(date_lengths) / len(date_lengths), 1)
        draw_line(f"Average period length: {avg} days", gap=16)
    else:
        draw_line("Average period length: Not enough data", gap=16)

    y -= 10

    # symptoms
    check_space()
    draw_line("SYMPTOMS LOGGED", bold=True, gap=18)

    if symptoms:
        freq = {}
        for s in symptoms:
            freq[s.symptom_type] = freq.get(s.symptom_type, 0) + 1
        for symptom, count in sorted(freq.items(), key=lambda x: x[1], reverse=True):
            check_space()
            draw_line(f"  {symptom}: {count}x", gap=16)
    else:
        draw_line("  No symptoms logged.", gap=16)

    y -= 10

    # lab results
    check_space()
    draw_line("LAB RESULTS", bold=True, gap=18)

    if reports:
        for report in reports:
            check_space()
            draw_line(f"  Report: {report.upload_date.date().isoformat()}", bold=True, gap=16)
            for res in report.results:
                check_space()
                draw_line(f"    {res.test_type}: {res.value} {res.unit or ''}", gap=15)
    else:
        draw_line("  No lab reports uploaded.", gap=16)

    y -= 10

    # health flags
    check_space()
    draw_line("HEALTH FLAGS", bold=True, gap=18)

    flags = []
    trends = {}
    for report in reports:
        for res in report.results:
            if res.test_type not in trends:
                trends[res.test_type] = []
            trends[res.test_type].append(res.value)

    for test_type, values in trends.items():
        if test_type not in NORMAL_RANGES:
            continue
        normal = NORMAL_RANGES[test_type]
        recent = values[-1]
        if recent < normal["min"]:
            flags.append(f"  LOW {test_type}: {recent} {normal['unit']} (normal: {normal['min']}-{normal['max']})")
        elif recent > normal["max"]:
            flags.append(f"  HIGH {test_type}: {recent} {normal['unit']} (normal: {normal['min']}-{normal['max']})")

    if date_lengths and max(date_lengths) - min(date_lengths) > 7:
        flags.append("  Cycle length has varied by more than 7 days.")

    if flags:
        for flag in flags:
            check_space()
            draw_line(flag, gap=16)
    else:
        draw_line("  No flags at this time.", gap=16)

    y -= 15
    check_space()
    draw_line("* This report is not a medical diagnosis. Please consult your doctor.", size=9, gap=15)

    # 4. save and return
    pdf.save()
    buffer.seek(0)

    return send_file(
        buffer,
        mimetype="application/pdf",
        as_attachment=True,
        download_name="hercare_report.pdf"
    )