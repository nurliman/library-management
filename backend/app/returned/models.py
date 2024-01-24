from app import db
from app.users.models import User
from app.books.models import Book
from datetime import datetime, timezone
from dataclasses import dataclass
from dataclasses_json import LetterCase, dataclass_json
from sqlalchemy import ForeignKey, Float, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship


@dataclass_json(letter_case=LetterCase.CAMEL)
@dataclass
class ReturnedBook(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    book_id: Mapped[int] = mapped_column(
        ForeignKey(Book.id, ondelete="CASCADE"), nullable=False
    )
    member_id: Mapped[int] = mapped_column(
        ForeignKey(User.id, ondelete="CASCADE"), nullable=False
    )
    return_date: Mapped[datetime] = mapped_column(
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    condition: Mapped[str] = mapped_column(Text(), nullable=False, default="Good")
    late_fee: Mapped[int] = mapped_column(Float(), default=0, nullable=False)
    book: Mapped[Book] = relationship(lazy="joined")
    member: Mapped[User] = relationship(lazy="joined")
