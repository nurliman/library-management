from app import db
from app.rbac import check_access
from app.users.models import UserRole
from app.utils import make_error_response, make_success_response
from app.vars.models import SystemVariable
from app.vars.schemas import get_system_variable_schema, add_system_variable_schema
from flask import Blueprint, request
from schema import SchemaError


blueprint = Blueprint("system-variables", __name__)


@blueprint.route("/api/system-variables", methods=["GET"])
@check_access(roles=[UserRole.SUPERADMIN])
def get_system_variables():
    """Get all system variables."""
    system_variables = SystemVariable.query.all()
    return make_success_response(system_variables, "System variables retrieved")


@blueprint.route("/api/system-variables", methods=["POST"])
@check_access(roles=[UserRole.SUPERADMIN])
def create_system_variable():
    """Create a new system variable."""
    data = request.get_json()
    valid_data = {}

    # Validate the data
    try:
        valid_data = add_system_variable_schema.validate(data)
    except SchemaError as e:
        return make_error_response(400, str(e))

    # check if name already exists
    if SystemVariable.query.filter_by(name=valid_data["name"]).first():
        return make_error_response(400, "Name already exists")

    # create new system variable
    system_variable = SystemVariable(
        name=valid_data["name"],
        value=valid_data["value"],
    )

    db.session.add(system_variable)
    db.session.commit()

    return make_success_response(system_variable, "System variable created")


@blueprint.route("/api/system-variables/<string:name>", methods=["GET"])
@check_access(roles=[UserRole.SUPERADMIN])
def get_system_variable(name):
    """Get a system variable."""
    system_variable = SystemVariable.query.filter_by(name=name).first()
    if not system_variable:
        return make_error_response(404, "System variable not found")
    return make_success_response(system_variable, "System variable retrieved")


@blueprint.route("/api/system-variables/<string:name>", methods=["PATCH"])
@check_access(roles=[UserRole.SUPERADMIN])
def edit_system_variable(name):
    """Edit a system variable."""
    system_variable = SystemVariable.query.filter_by(name=name).first()
    if not system_variable:
        return make_error_response(404, "System variable not found")

    data = request.get_json()
    valid_data = {}

    # Validate the data
    try:
        valid_data = get_system_variable_schema.validate(data)
    except SchemaError as e:
        return make_error_response(400, str(e))

    system_variable.value = valid_data["value"]

    db.session.add(system_variable)
    db.session.commit()

    return make_success_response(system_variable, "System variable updated")


@blueprint.route("/api/system-variables/<string:name>", methods=["DELETE"])
@check_access(roles=[UserRole.SUPERADMIN])
def delete_system_variable(name):
    """Delete a system variable."""
    system_variable = SystemVariable.query.filter_by(name=name).first()
    if not system_variable:
        return make_error_response(404, "System variable not found")

    db.session.delete(system_variable)
    db.session.commit()

    return make_success_response(None, "System variable deleted")
