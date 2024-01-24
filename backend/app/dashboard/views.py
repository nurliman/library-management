from app.utils import make_success_response
from flask import Blueprint, request
from flask_jwt_extended import jwt_required


blueprint = Blueprint("dashboard", __name__)


@blueprint.route("/api/dashboard", methods=["GET"])
@jwt_required()
def get_dashboard_data():
    """Get dashboard data."""
    return make_success_response({}, "Dashboard data retrieved")
