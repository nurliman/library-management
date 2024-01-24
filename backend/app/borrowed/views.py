from app import db
from app.users.models import User
from app.books.models import Book
from app.borrowed.models import BorrowedBook
from app.borrowed.schemas import borrowed_book_schema
from app.utils import make_error_response, make_success_response
from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from schema import SchemaError


blueprint = Blueprint("borrowed-books", __name__)


@blueprint.route("/api/borrowed-books", methods=["GET"])
@jwt_required()
def get_borrowed_books():
    """Get all borrowed books."""
    borrowed_books = BorrowedBook.query.all()
    return make_success_response(borrowed_books, "Borrowed books retrieved")


@blueprint.route("/api/borrowed-books", methods=["POST"])
@jwt_required()
def borrow_book():
    """Member borrows a book."""
    data = request.get_json()
    valid_data = {}

    # Validate the data
    try:
        valid_data = borrowed_book_schema.validate(data)
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

    borrowed_book = BorrowedBook(**valid_data)
    db.session.add(borrowed_book)
    db.session.commit()

    return make_success_response(True, "Book successfully borrowed")
