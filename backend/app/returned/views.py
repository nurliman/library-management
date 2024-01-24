from app import db
from app.users.models import User
from app.books.models import Book
from app.returned.models import ReturnedBook
from app.returned.schemas import returned_book_schema
from app.utils import make_error_response, make_success_response
from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from schema import SchemaError


blueprint = Blueprint("returned-books", __name__)


@blueprint.route("/api/returned-books", methods=["GET"])
@jwt_required()
def get_returned_books():
    """Get all returned books."""
    returned_books = ReturnedBook.query.all()
    return make_success_response(returned_books, "Returned books retrieved")


@blueprint.route("/api/returned-books", methods=["POST"])
@jwt_required()
def return_book():
    """Member returns a book."""
    data = request.get_json()
    valid_data = {}

    # Validate the data
    try:
        valid_data = returned_book_schema.validate(data)
    except SchemaError as e:
        return make_error_response(400, str(e))

    # check if book exists
    book = Book.query.get(valid_data["book_id"])

    if not book:
        return make_error_response(
            400, f"Book with id {valid_data['book_id']} does not exist"
        )

    # check if member exists
    member = User.query.get(valid_data["member_id"])

    if not member:
        return make_error_response(
            400, f"Member with id {valid_data['member_id']} does not exist"
        )

    returned_book = ReturnedBook(**valid_data)
    db.session.add(returned_book)
    db.session.commit()

    return make_success_response(True, "Book successfully returned")
