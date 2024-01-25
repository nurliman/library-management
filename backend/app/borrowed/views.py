from app import db
from app.users.models import User
from app.books.models import Book
from app.borrowed.models import BorrowedBook
from app.borrowed.schemas import (
    borrowed_book_schema,
    return_book_schema,
    extend_borrowed_book_schema,
)
from app.utils import calc_late_fee, make_error_response, make_success_response
from datetime import datetime, timedelta, timezone
from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from schema import SchemaError


blueprint = Blueprint("borrowed-books", __name__)


@blueprint.route("/api/borrowed-books", methods=["GET"])
@jwt_required()
def get_borrowed_books():
    """Get all borrowed books."""
    borrowed_books = BorrowedBook.query.order_by(BorrowedBook.id.desc()).all()

    for i in range(len(borrowed_books)):
        borrowed_books[i].member.password_hash = None

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


@blueprint.route("/api/borrowed-books/<int:borrowed_book_id>/return", methods=["POST"])
@jwt_required()
def return_book(borrowed_book_id):
    """Member returns a book."""
    borrowed_book = BorrowedBook.query.get(borrowed_book_id)

    if not borrowed_book:
        return make_error_response(
            400, f"Borrowed book with id {borrowed_book_id} does not exist"
        )

    data = request.get_json()
    valid_data = {}

    # Validate the data
    try:
        valid_data = return_book_schema.validate(data)
    except SchemaError as e:
        return make_error_response(400, str(e))

    borrowed_book.return_date = valid_data["return_date"] or datetime.now(timezone.utc)

    if isinstance(valid_data["is_lost"], bool):
        borrowed_book.is_lost = valid_data["is_lost"]

    if isinstance(valid_data["is_damaged"], bool):
        borrowed_book.is_damaged = valid_data["is_damaged"]

    if isinstance(valid_data["additional_fee"], (int, float)):
        borrowed_book.additional_fee = valid_data["additional_fee"]

    # calculate late fee
    due_date_offset_aware = borrowed_book.due_date.replace(tzinfo=timezone.utc)

    borrowed_book.late_fee = calc_late_fee(
        due_date_offset_aware,
        borrowed_book.return_date,
    )

    db.session.commit()

    return make_success_response(True, "Book successfully returned")


# extend the borrowed book
@blueprint.route("/api/borrowed-books/<int:borrowed_book_id>/extend", methods=["POST"])
@jwt_required()
def extend_borrowed_book(borrowed_book_id):
    """Member extends the borrowed book."""
    borrowed_book = BorrowedBook.query.get(borrowed_book_id)

    if not borrowed_book:
        return make_error_response(
            400, f"Borrowed book with id {borrowed_book_id} does not exist"
        )

    data = request.get_json()
    valid_data = {}

    # Validate the data
    try:
        valid_data = extend_borrowed_book_schema.validate(data)
    except SchemaError as e:
        return make_error_response(400, str(e))

    borrowed_book.due_date = valid_data["due_date"] or (
        datetime.now(timezone.utc) + timedelta(days=7)
    )

    db.session.commit()

    return make_success_response(True, "Book successfully extended")
