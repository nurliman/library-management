from app import db
from app.users.models import User
from app.utils import is_email, make_error_response, make_success_response
from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required


blueprint = Blueprint("auth", __name__)


@blueprint.route("/api/auth/login", methods=["POST"])
def login():
    """Login a user by username/email and password."""

    data = request.get_json()

    # if "username" not in data or "password" not in data:
    if ("email" not in data and "username" not in data) or "password" not in data:
        return make_error_response(400, "Username/email and password required")

    email = data.get("email")
    username = data.get("username")
    password = data.get("password")

    # check if email valid
    if email and not is_email(email):
        return make_error_response(400, "Invalid email")

    user: User = None

    if email:
        # find user by email
        user = User.query.filter_by(email=email).first()

    elif username:
        # find user by username
        user = User.query.filter_by(username=username).first()

    # check if user found
    if not user:
        return make_error_response(404, "User not found")

    # check if password is correct
    if not user.check_password(password):
        return make_error_response(400, "Incorrect password")

    credentials = user.create_credentials()

    return make_success_response(
        {
            "user": user.safe_dict,
            "credentials": credentials,
        },
        "Login successful",
    )


@blueprint.route("/api/auth/register", methods=["POST"])
def register():
    """Register a new user."""

    data = request.get_json()

    if (
        "username" not in data
        or "email" not in data
        or "password" not in data
        or "confirm_password" not in data
    ):
        return make_error_response(
            400, "Username, email, password and confirm password required"
        )

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    confirm_password = data.get("confirm_password")

    # check if email valid
    if not is_email(email):
        return make_error_response(400, "Invalid email")

    # check if passwords match
    if password != confirm_password:
        return make_error_response(400, "Passwords do not match")

    # check if username already exists
    if User.query.filter_by(username=username).first():
        return make_error_response(400, "Username already exists")

    # check if email already exists
    if User.query.filter_by(email=email).first():
        return make_error_response(400, "Email already exists")

    # create new user
    user = User(username=username, email=email, password=password)

    # commit to database
    db.session.add(user)
    db.session.commit()

    return make_success_response(user.safe_dict, "Registration successful")


@blueprint.route("/api/auth/refresh-token", methods=["POST"])
@jwt_required(refresh=True)
def refresh_token():
    """Refresh a user's token."""
    identity = get_jwt_identity()

    user: User = User.query.get(identity)

    if not user:
        return make_error_response(404, "User not found")

    credentials = user.create_credentials()

    return make_success_response(
        {
            "user": user.safe_dict,
            "credentials": credentials,
        },
        "Token refreshed",
    )
