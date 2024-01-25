"""add due date

Revision ID: 7c22720e6a45
Revises: b44ac56ca9b3
Create Date: 2024-01-25 07:04:17.350187

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7c22720e6a45'
down_revision = 'b44ac56ca9b3'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('borrowed_book', schema=None) as batch_op:
        batch_op.add_column(sa.Column('due_date', sa.DateTime(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('borrowed_book', schema=None) as batch_op:
        batch_op.drop_column('due_date')

    # ### end Alembic commands ###