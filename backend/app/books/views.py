from app import db
from app.books.models import Book
from app.borrowed.models import BorrowedBook
from app.rbac import check_access
from app.users.models import UserRole
from app.utils import is_valid_url, make_error_response, make_success_response
from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from sqlalchemy import null


blueprint = Blueprint("books", __name__)


@blueprint.route("/api/books", methods=["GET"])
@jwt_required()
def get_books():
    """Get all books."""
    books = Book.query.all()
    return make_success_response(books, "Books retrieved")


@blueprint.route("/api/books/available", methods=["GET"])
@jwt_required()
def get_available_books():
    """Get all available books."""

    # Get all books that are not currently borrowed
    available_books = (
        db.session.query(Book)
        .outerjoin(
            BorrowedBook,
            (BorrowedBook.book_id == Book.id) & (BorrowedBook.return_date == null()),
        )
        .filter(BorrowedBook.id == null())
        .all()
    )

    return make_success_response(available_books, "Available books retrieved")


@blueprint.route("/api/books/<int:book_id>", methods=["GET"])
@jwt_required()
def get_book(book_id):
    """Get a book."""
    book = Book.query.get(book_id)

    if not book:
        return make_error_response(404, "Book not found")

    return make_success_response(book, "Book retrieved")


@blueprint.route("/api/books", methods=["POST"])
@check_access(roles=[UserRole.SUPERADMIN, UserRole.ADMIN])
def create_book():
    """Create a new book."""
    data = request.get_json()

    errors = []

    if "title" not in data:
        errors.append("Missing title")

    if "author" not in data:
        errors.append("Missing author")

    # if any `image_url` check if it's a valid url
    if "image_url" in data and not is_valid_url(data["image_url"]):
        errors.append("Invalid image_url")

    if len(errors) > 0:
        return make_error_response(400, errors)

    book = Book(**data)
    db.session.add(book)
    db.session.commit()
    return make_success_response(book, "Book created", 201)


@blueprint.route("/api/books/<int:book_id>", methods=["PATCH"])
@check_access(roles=[UserRole.SUPERADMIN, UserRole.ADMIN])
def update_book(book_id):
    """Update a book."""
    book = Book.query.get(book_id)

    if not book:
        return make_error_response(404, "Book not found")

    data = request.get_json()

    errors = []

    if "title" in data:
        book.title = data["title"]

    if "author" in data:
        book.author = data["author"]

    # if `image_url` check if it's a valid url
    if "image_url" in data and not is_valid_url(data["image_url"]):
        errors.append("Invalid image_url")

    if "image_url" in data:
        book.image_url = data["image_url"]

    if len(errors) > 0:
        return make_error_response(400, errors)

    db.session.commit()
    return make_success_response(book, "Book updated")


@blueprint.route("/api/books/<int:book_id>", methods=["DELETE"])
@check_access(roles=[UserRole.SUPERADMIN, UserRole.ADMIN])
def delete_book(book_id):
    """Delete a book."""
    book = Book.query.get(book_id)

    if not book:
        return make_error_response(404, "Book not found")

    db.session.delete(book)
    db.session.commit()
    return make_success_response(True, "Book deleted")
