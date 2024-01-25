from app import db
from app.rbac import check_access
from app.users.models import User, UserRole
from app.users.schemas import add_user_schema, edit_user_schema
from app.utils import make_error_response, make_success_response
from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from schema import SchemaError


blueprint = Blueprint("users", __name__)


@blueprint.route("/api/me", methods=["GET"])
@jwt_required()
def get_me():
    """Get the current user."""
    identity = get_jwt_identity()
    user: User = User.query.get(identity)
    return make_success_response(user.safe_dict, "User retrieved")


@blueprint.route("/api/users", methods=["GET"])
@check_access(roles=[UserRole.SUPERADMIN, UserRole.ADMIN])
def get_users():
    """Get all users."""
    users = User.query.all()
    return make_success_response(users, "Users retrieved")


@blueprint.route("/api/users", methods=["POST"])
@check_access(roles=[UserRole.SUPERADMIN])
def create_user():
    """Create a new user."""
    data = request.get_json()
    valid_data = {}

    # Validate the data
    try:
        valid_data = add_user_schema.validate(data)
    except SchemaError as e:
        return make_error_response(400, str(e))

    # check if username already exists
    if User.query.filter_by(username=valid_data["username"]).first():
        return make_error_response(400, "Username already exists")

    # check if email already exists
    if User.query.filter_by(email=valid_data["email"]).first():
        return make_error_response(400, "Email already used")

    # create new user
    user = User(
        username=valid_data["username"],
        email=valid_data["email"],
        role=valid_data["role"],
    )
    user.set_password(valid_data["password"])

    db.session.add(user)
    db.session.commit()

    return make_success_response(user.safe_dict, "User created")


@blueprint.route("/api/users/<int:user_id>", methods=["PATCH"])
@check_access(roles=[UserRole.SUPERADMIN])
def edit_user(user_id):
    """Edit a user."""
    user = User.query.get(user_id)
    if not user:
        return make_error_response(404, "User not found")

    data = request.get_json()
    valid_data = {}

    # Validate the data
    try:
        valid_data = edit_user_schema.validate(data)
    except SchemaError as e:
        return make_error_response(400, str(e))

    # check if username already exists but not the current user
    if (
        User.query.filter_by(username=valid_data["username"])
        .filter(User.id != user_id)
        .first()
    ):
        return make_error_response(400, "Username already exists")

    # check if email already exists but not the current user
    if (
        User.query.filter_by(email=valid_data["email"])
        .filter(User.id != user_id)
        .first()
    ):
        return make_error_response(400, "Email already used")

    # edit user
    user.username = valid_data["username"] or user.username
    user.email = valid_data["email"] or user.email
    user.role = valid_data["role"] or user.role

    if valid_data["password"]:
        user.set_password(valid_data["password"])

    db.session.commit()

    return make_success_response(user.safe_dict, "User edited")


@blueprint.route("/api/users/<int:user_id>", methods=["DELETE"])
@check_access(roles=[UserRole.SUPERADMIN])
def delete_user(user_id):
    """Delete a user."""
    user = User.query.get(user_id)
    if not user:
        return make_error_response(404, "User not found")

    db.session.delete(user)
    db.session.commit()

    return make_success_response(user.safe_dict, "User deleted")
