from app import db
from app.users.models import User
from app.books.models import Book
from datetime import datetime, timedelta, timezone
from dataclasses import dataclass
from dataclasses_json import LetterCase, dataclass_json
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship


@dataclass_json(letter_case=LetterCase.CAMEL)
@dataclass
class BorrowedBook(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    book_id: Mapped[int] = mapped_column(ForeignKey(Book.id), nullable=False)
    member_id: Mapped[int] = mapped_column(ForeignKey(User.id), nullable=False)
    borrow_date: Mapped[datetime] = mapped_column(
        default=lambda: datetime.now(timezone.utc),
        nullable=True,
    )
    due_date: Mapped[datetime] = mapped_column(
        default=lambda: datetime.now(timezone.utc) + timedelta(days=7),
        nullable=True,
    )
    return_date: Mapped[datetime] = mapped_column(
        default=None,
        nullable=True,
    )
    extended: Mapped[bool] = mapped_column(default=False)

    is_lost: Mapped[bool] = mapped_column(default=False)
    is_damaged: Mapped[bool] = mapped_column(default=False)
    late_fee: Mapped[float] = mapped_column(default=0.0)
    additional_fee: Mapped[float] = mapped_column(default=0.0)

    book: Mapped[Book] = relationship(lazy="joined")
    member: Mapped[User] = relationship(lazy="joined")
