import os
from flask import Flask
from dotenv import load_dotenv
from datetime import timedelta
from extensions import db, migrate, bcrypt, jwt, limiter
from flask_cors import CORS
load_dotenv()

def create_app(test_config=None):
    app = Flask(__name__)
    CORS(app,
    origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://hercare-frontend.vercel.app"
    ],
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
)
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=15)
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)

    # override with test config if provided
    if test_config:
        app.config.update(test_config)
    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)
    @jwt.user_lookup_loader
    def user_lookup_callback(_jwt_header, jwt_data):
        from models.user import User
        identity = jwt_data["sub"]
        return User.query.filter_by(id=identity).first()
    limiter.init_app(app)
    from models.user import User
    from models.cycle import Cycle
    from models.symptom import Symptom
    from models.lab_report import LabReport
    from models.lab_result import LabResult
    from routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    from routes.cycles import cycles_bp
    app.register_blueprint(cycles_bp)
    from routes.symptoms import symptoms_bp
    app.register_blueprint(symptoms_bp)
    from routes.reports import reports_bp
    app.register_blueprint(reports_bp)
    from routes.timeline import timeline_bp
    app.register_blueprint(timeline_bp)
    from routes.analytics import analytics_bp
    app.register_blueprint(analytics_bp)
    from routes.export import export_bp
    app.register_blueprint(export_bp)
    @app.route("/")
    def home():
        return "HerCare backend is running!"

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)