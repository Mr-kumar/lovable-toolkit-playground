## Backend Models

SQLAlchemy models define core data structures for users, jobs, subscriptions, and billing.

### `models/user_model.py`
- `User`
  - fields: `id, email, password_hash, full_name, is_active, is_verified, created_at, updated_at, last_login, avatar_url, bio, company, website, subscription_id, files_processed_this_month, last_reset_date`
  - relations: `subscription`, `jobs`, `api_keys`
  - methods: `can_process_file(file_size_mb)`, `can_process_more_files()`, `increment_usage()`
- `APIKey`
  - fields: `id, user_id, key_hash, name, is_active, last_used, created_at, expires_at`
  - methods: `is_expired()`

### `models/job_model.py`
- Enums: `JobStatus { pending, processing, completed, failed, cancelled }`, `JobType { compress, merge, split, rotate, ... }`
- `Job`
  - fields: `id, user_id, job_type, status, input_file_path, output_file_path, input_file_name, output_file_name, input_file_size, output_file_size, parameters(JSON), result_data(JSON), error_message, processing_time_seconds, started_at, completed_at, created_at, api_key_id`
  - relations: `user`, `api_key`
  - methods: `start_processing()`, `complete_job(output_path, result_data?)`, `fail_job(error_message)`, `get_compression_ratio()`, `get_processing_duration()`
- `JobQueue`
  - fields: `id, job_id, priority, scheduled_at, started_at, worker_id`
  - relations: `job`

### `models/subscription_model.py`
- Enums: `BillingCycle { monthly, yearly, lifetime }`, `SubscriptionStatus`, `PaymentStatus`
- `SubscriptionPlan`
  - fields: `id, name, description, price, currency, billing_cycle, max_files_per_month, max_file_size_mb, features, is_active, is_popular, sort_order, created_at, updated_at`
  - methods: `get_yearly_price()`
- `Subscription`
  - fields: `id, user_id, plan_id, status, start_date, end_date, auto_renew, created_at, updated_at, payment_method_id, stripe_subscription_id`
  - relations: `user`, `plan`, `invoices`
  - methods: `is_active()`, `days_remaining()`, `extend_subscription(days)`
- `Invoice`
  - fields: `id, subscription_id, amount, currency, status, due_date, paid_date, stripe_invoice_id, created_at`
  - methods: `is_overdue()`
- `PaymentMethod`
  - fields: `id, user_id, stripe_payment_method_id, type, last_four, expiry_month, expiry_year, is_default, created_at`
  - methods: `is_expired()`

