from app.borrowed.models import BorrowedBook
from app.rbac import check_access
from app.users.models import UserRole
from app.utils import make_success_response
from app.books.models import Book
from datetime import datetime, timedelta
from flask import Blueprint


blueprint = Blueprint("dashboard", __name__)


@blueprint.route("/api/dashboard", methods=["GET"])
@check_access(roles=[UserRole.SUPERADMIN, UserRole.ADMIN])
def get_dashboard_data():
    """Get dashboard data."""
    return make_success_response({}, "Dashboard data retrieved")


@blueprint.route("/api/dashboard/total-books", methods=["GET"])
@check_access(roles=[UserRole.SUPERADMIN, UserRole.ADMIN])
def get_total_books_data():
    """Get total books data."""
    total_books = []
    for i in range(7):
        date = datetime.now() - timedelta(days=i)
        total_books.append(
            {
                "date": date.strftime("%d-%m-%Y"),
                "total_books": Book.query.filter(
                    Book.created_at.between(date, date + timedelta(days=1))
                ).count(),
            }
        )

    total_books.reverse()

    return make_success_response(total_books, "Total books data retrieved")


@blueprint.route("/api/dashboard/total-books-count", methods=["GET"])
@check_access(roles=[UserRole.SUPERADMIN, UserRole.ADMIN])
def get_total_books_count():
    """Get total books data."""
    total_books = Book.query.count()
    return make_success_response(total_books, "Total books data retrieved")


@blueprint.route("/api/dashboard/total-borrowed-books", methods=["GET"])
@check_access(roles=[UserRole.SUPERADMIN, UserRole.ADMIN])
def get_total_borrowed_books_data():
    """Get total borrowed books data."""
    total_borrowed_books = []
    for i in range(7):
        date = datetime.now() - timedelta(days=i)
        total_borrowed_books.append(
            {
                "date": date.strftime("%d-%m-%Y"),
                "total_borrowed_books": BorrowedBook.query.filter(
                    BorrowedBook.borrow_date.between(date, date + timedelta(days=1))
                ).count(),
            }
        )

    total_borrowed_books.reverse()

    return make_success_response(
        total_borrowed_books, "Total borrowed books data retrieved"
    )


@blueprint.route("/api/dashboard/total-borrowed-books-count", methods=["GET"])
@check_access(roles=[UserRole.SUPERADMIN, UserRole.ADMIN])
def get_total_borrowed_books_count():
    """Get total borrowed books data."""
    total_borrowed_books = BorrowedBook.query.count()
    return make_success_response(
        total_borrowed_books, "Total borrowed books data retrieved"
    )


@blueprint.route("/api/dashboard/total-borrowed-books-24", methods=["GET"])
@check_access(roles=[UserRole.SUPERADMIN, UserRole.ADMIN])
def get_total_borrowed_books_24():
    """Get total borrowed books data."""
    total_borrowed_books = []
    for i in range(24):
        date = datetime.now() - timedelta(hours=i)
        total_borrowed_books.append(
            {
                "date": date.strftime("%H:%M"),
                "total_borrowed_books": BorrowedBook.query.filter(
                    BorrowedBook.borrow_date.between(date, date + timedelta(hours=1))
                ).count(),
            }
        )

    total_borrowed_books.reverse()

    return make_success_response(
        total_borrowed_books, "Total borrowed books data retrieved"
    )


@blueprint.route("/api/dashboard/total-borrowed-books-24-count", methods=["GET"])
@check_access(roles=[UserRole.SUPERADMIN, UserRole.ADMIN])
def get_total_borrowed_books_24_count():
    """Get total borrowed books data."""
    total_borrowed_books = BorrowedBook.query.filter(
        BorrowedBook.borrow_date.between(
            datetime.now() - timedelta(hours=24), datetime.now()
        )
    ).count()
    return make_success_response(
        total_borrowed_books, "Total borrowed books data retrieved"
    )


@blueprint.route("/api/dashboard/total-returned-books-24", methods=["GET"])
@check_access(roles=[UserRole.SUPERADMIN, UserRole.ADMIN])
def get_total_return_books_24():
    """Get total return books data."""
    total_return_books = []
    for i in range(24):
        date = datetime.now() - timedelta(hours=i)
        total_return_books.append(
            {
                "date": date.strftime("%H:%M"),
                "total_return_books": BorrowedBook.query.filter(
                    BorrowedBook.return_date.between(date, date + timedelta(hours=1))
                ).count(),
            }
        )

    total_return_books.reverse()

    return make_success_response(
        total_return_books, "Total return books data retrieved"
    )


@blueprint.route("/api/dashboard/total-returned-books-24-count", methods=["GET"])
@check_access(roles=[UserRole.SUPERADMIN, UserRole.ADMIN])
def get_total_return_books_24_count():
    """Get total return books data."""
    total_return_books = BorrowedBook.query.filter(
        BorrowedBook.return_date.between(
            datetime.now() - timedelta(hours=24), datetime.now()
        )
    ).count()
    return make_success_response(
        total_return_books, "Total return books data retrieved"
    )
