import pytest
from app import create_app
from extensions import db

@pytest.fixture
def client():
    app = create_app({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "JWT_SECRET_KEY": "test-secret",
    })

    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.drop_all()

def test_signup(client):
    response = client.post("/api/auth/signup", json={
        "email": "test@example.com",
        "password": "password123"
    })
    assert response.status_code == 201

def test_signup_duplicate_email(client):
    client.post("/api/auth/signup", json={
        "email": "test@example.com",
        "password": "password123"
    })
    response = client.post("/api/auth/signup", json={
        "email": "test@example.com",
        "password": "password123"
    })
    assert response.status_code == 409

def test_login_success(client):
    client.post("/api/auth/signup", json={
        "email": "test@example.com",
        "password": "password123"
    })
    response = client.post("/api/auth/login", json={
        "email": "test@example.com",
        "password": "password123"
    })
    assert response.status_code == 200
    assert "access_token" in response.get_json()

def test_login_wrong_password(client):
    client.post("/api/auth/signup", json={
        "email": "test@example.com",
        "password": "password123"
    })
    response = client.post("/api/auth/login", json={
        "email": "test@example.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401

def test_login_missing_fields(client):
    response = client.post("/api/auth/login", json={
        "email": "test@example.com"
    })
    assert response.status_code == 400

def test_protected_route_without_token(client):
    response = client.get("/api/auth/me")
    assert response.status_code == 401