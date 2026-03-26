# Old CRM auth/user field inventory (source: Laravel migrations)

This document is derived from `save_net/database/migrations` and is used as the **source of truth** for preserving fields while we redesign the schema cleanly.

## Auth-related tables found

- **`users`**: base user table + many later “add_*_to_users” migrations.
- **`password_resets`**: legacy Laravel reset table (`email`, `token`, `created_at`).
- **`personal_access_tokens`**: Sanctum-style API tokens (`tokenable_type/id`, `name`, `token`, `abilities`, `last_used_at`).

## `users` table (base migration)

Source: `save_net/database/migrations/2014_10_12_000000_create_users_table.php`

- `id` (bigint, pk)
- `full_name` (string(55), nullable)
- `email` (string(55), required) — **note**: old migration does not add unique index
- `verified_at` (timestamp, nullable)
- `password` (string) — hashed in a healthy system, but old DB may contain mixed state
- `my_password` (string) — **insecure legacy plaintext**; do not carry forward
- `api_token` (string, nullable) — legacy token field
- `status` (tinyint, default 1) — comment: `1 Pending, 2 Active, 3 Inactive`
- `role` (tinyint, default 1) — comment: `4 Admin, 3 Employee, 2 Customer, 1 Customer Service`
- `remember_token` (string, nullable)
- `created_at`, `updated_at`
- `last_logged_in_at` (timestamp, nullable)
- `customers` (string, nullable) — legacy “Customer Permissions” blob
- `is_email` (bool, default false, nullable) — legacy email send flag
- `updated_by_user_id` (int, nullable) — legacy audit-ish link (not a foreign key)

## Additional `users` columns seen (non-exhaustive, auth-adjacent/high-signal)

These come from later migrations; we’ll keep the fields (if still needed) but normalize structure.

- `avatar` (string, default `/assets/images/users/default.png`) — from `2021_08_02_170234_add_ip_to_users.php`
- `ip_address` (string, nullable) — same file
- `owner` (string, nullable) — same file
- `userType` (string(50), default `User`) — from `2021_10_20_225833_add_user_type_to_users_table.php`
- `is_deleted` (int, default 1) — comment: `1 Normal, 2 Deleted` — from `2021_12_23_074852_add_is_deleted_to_users.php`
- `pin` (string, nullable) and `is_clock` (int, default 0) — from `2022_01_26_141718_add_pin_to_users.php`
- address fields: `personal_email`, `address`, `city`, `state`, `zip` — from `2023_08_30_222636_add_address_info_to_users.php`
- (Many more HR/ops fields exist; we’ll inventory fully as we migrate module-by-module.)

## Legacy permissions flags (`acl_*`)

Source example: `save_net/database/migrations/2021_09_07_015057_add_permission_to_users_table.php`

- Old CRM stores a large matrix of booleans directly on `users` (e.g. `acl_admin_inventory_view`, `acl_fulfillment_pending_add`, etc.).
- This is hard to maintain and does not normalize well.

### New CRM approach (planned)

- **RBAC tables** for maintainability:
  - `roles`
  - `permissions`
  - `role_permissions`
  - `user_roles`
- **Legacy compatibility** while we rebuild:
  - store the legacy `acl_*` flags in a separate `user_legacy_acl_flags` table (wide) **or** `users.legacy_acl` (JSONB).
  - map old flags → new permission codes gradually, keeping behavior stable.

## Security decisions (non-negotiable)

- Never store plaintext passwords (`my_password`) in the new system.
- Password reset tokens must be **hashed at rest**, single-use, and expiring.
- `email` should become unique; for case-insensitive matching use normalized lowercase in app code or a MySQL unique index on a generated/stored lowercase column.

