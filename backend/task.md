# URL Shortener - Phase 2 Backend Tasks

- [x] 1. Add `passlib[bcrypt]` and `python-jose[cryptography]` to requirements.txt and install them.
- [x] 2. Create `User` model (`app/models/user.py`).
- [x] 3. Update `Link` model (`app/models/link.py`) with `owner_id` (ForeignKey) and `is_custom_alias` (Boolean).
- [x] 4. Create `app/schemas/user.py` and `app/services/auth.py` (JWT and hashing).
- [x] 5. Create `app/routers/auth.py` for `/signup`, `/login`, and `/me`. Register it in `main.py`.
- [x] 6. Update `app/routers/links.py` to support auth (optional for create, required for list/edit/delete), handle custom aliases, and add `PATCH` and `DELETE` endpoints for links.
- [x] 7. Drop the existing `links` table in the SQL Server database so it can be recreated cleanly on the next startup.

# Phase 3 Backend Tasks

- [x] 1. Add user-agents package to requirements.txt and install it.
- [x] 2. Create Click model (pp/models/click.py).
- [x] 3. Update pp/routers/redirect.py to parse headers and insert Click.
- [x] 4. Create pp/schemas/analytics.py.
- [x] 5. Create pp/routers/analytics.py for /api/v1/analytics/{short_code}.
- [x] 6. Run drop_tables.py script.
