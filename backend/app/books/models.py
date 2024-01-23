from app import db
from dataclasses import dataclass
from dataclasses_json import LetterCase, dataclass_json
from sqlalchemy.orm import Mapped, mapped_column


@dataclass_json(letter_case=LetterCase.CAMEL)
@dataclass
class Book(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True,autoincrement=True)
    title: Mapped[str] = mapped_column(nullable=False)
    author: Mapped[str] = mapped_column(nullable=False)
    image_url: Mapped[str] = mapped_column()
