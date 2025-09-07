## Backend Services

### `services/auth_service.py`
- Class `AuthService`
  - `verify_password(plain, hashed) -> bool`
  - `get_password_hash(password) -> str`
  - `create_access_token(data, expires_delta?) -> str`
  - `create_refresh_token(data) -> str`
  - `verify_token(token, token_type='access') -> dict`
  - `create_user(db, email, password, full_name) -> User`
  - `authenticate_user(db, email, password) -> Optional[User]`
  - `generate_api_key(user_id, name) -> (api_key, key_hash)`
  - `verify_api_key(db, api_key) -> Optional<User]`
- Dependency helpers (FastAPI `Depends`):
  - `get_current_user`, `get_current_user_optional`
  - `require_verified_user`, `require_active_subscription`, `require_pro_user`, `require_enterprise_user`, `require_admin_user`
  - API-key helpers: `get_api_key_user`, `require_api_key_or_jwt`

Usage example:
```python
from services.auth_service import auth_service
token = auth_service.create_access_token({"sub": str(user.id), "email": user.email})
```

### `services/database.py`
- `get_db()` — yields a SQLAlchemy `Session`
- `create_tables()`, `drop_tables()`, `init_db()` — schema lifecycle and seed plans
- `DatabaseManager` (`db_manager` instance)
  - `get_session() -> Session`
  - `execute_raw_sql(sql, params?)`
  - `backup_database(backup_path)`
  - `get_database_stats() -> dict`

### `services/file_storage.py`
- Class `FileStorageService` (`file_storage` instance)
  - `save_uploaded_file(file, user_id, job_id?) -> info`
  - `save_temp_file(file) -> info`
  - `save_processed_file(path, user_id, job_id, original_filename) -> info`
  - `get_file_info(path) -> info`
  - `delete_file(path) -> bool`
  - `delete_user_files(user_id) -> int`
  - `cleanup_old_files() -> { uploads_deleted, downloads_deleted, temp_deleted }`
  - `get_storage_stats() -> dict`

Info object fields: `{ path, filename, size, size_mb, type, hash, created_at, modified_at }`

### `services/pdf_utils.py` (PDFProcessor)
Public async methods (some are placeholders returning HTTP 501 until implemented):
- `compress_pdf(input_path, output_path, quality) -> { compression_ratio, original_size, compressed_size }`
- `merge_pdfs(input_paths, output_path) -> { total_pages, files_merged }`
- `split_pdf(input_path, output_dir, pages) -> { pages_extracted, output_files[] }`
- `rotate_pdf(input_path, output_path, angle) -> { rotation_angle, pages_rotated }`
- `add_watermark(input_path, output_path, watermark_text) -> { watermark_text, pages_watermarked }`
- `protect_pdf(input_path, output_path, password) -> { protected: true }`
- `unlock_pdf(input_path, output_path, password) -> { unlocked: true }`
- `compare_pdfs(file1_path, file2_path) -> { comparison_result, differences_found, similarity_score, file1_pages, file2_pages, differences[] }`
- Placeholders: `ocr_pdf`, `repair_pdf`, `crop_pdf`, `redact_pdf`, `sign_pdf`

### `services/cleanup.py`
- Class `CleanupService` (`cleanup_service` instance)
  - `cleanup_old_files() -> Dict[str,int]`
  - `cleanup_old_jobs(days_old=30) -> int`
  - `cleanup_expired_sessions() -> int`
  - `full_cleanup() -> Dict[str, Any]`
- `scheduled_cleanup()` — to be wired to a scheduler if needed

