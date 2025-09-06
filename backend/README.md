# PDF Toolkit Backend API

A comprehensive PDF processing API built with FastAPI, providing various PDF manipulation tools including compression, merging, splitting, conversion, and more.

## Features

### PDF Operations

- **Compress PDF** - Reduce file size while maintaining quality
- **Merge PDFs** - Combine multiple PDFs into one document
- **Split PDF** - Extract pages or split by ranges
- **Rotate PDF** - Rotate pages by 90, 180, or 270 degrees
- **Add Watermark** - Add text watermarks to documents
- **Protect PDF** - Password protect documents
- **Unlock PDF** - Remove password protection
- **Convert to Images** - Convert PDF pages to JPG/PNG
- **Convert from Images** - Convert images to PDF

### User Management

- User registration and authentication
- JWT-based authentication with refresh tokens
- User profiles and settings
- API key management
- Usage tracking and limits

### Subscription System

- Multiple subscription tiers (Free, Pro, Enterprise)
- Usage limits based on subscription
- Billing and payment integration ready
- Invoice management

### Security & Privacy

- Secure file processing
- Automatic file cleanup
- GDPR compliant
- Rate limiting
- Input validation

## Quick Start

### Prerequisites

- Python 3.8+
- pip or poetry

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd backend
```

2. **Create virtual environment**

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**

```bash
pip install -r requirements.txt
```

4. **Set up environment variables**

```bash
cp env.example .env
# Edit .env with your configuration
```

5. **Initialize database**

```bash
python -c "from src.main import init_db; init_db()"
```

6. **Run the server**

```bash
python src/main.py
```

The API will be available at `http://localhost:8000`

### Using Docker

```bash
# Build the image
docker build -t pdf-toolkit-api .

# Run the container
docker run -p 8000:8000 pdf-toolkit-api
```

## API Documentation

Once the server is running, you can access:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## API Endpoints

### Authentication

- `POST /api/user/register` - Register new user
- `POST /api/user/login` - Login user
- `POST /api/user/refresh` - Refresh access token
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### PDF Operations

- `POST /api/pdf/compress` - Compress PDF
- `POST /api/pdf/merge` - Merge PDFs
- `POST /api/pdf/split` - Split PDF
- `POST /api/pdf/rotate` - Rotate PDF
- `POST /api/pdf/watermark` - Add watermark
- `POST /api/pdf/protect` - Protect PDF
- `POST /api/pdf/unlock` - Unlock PDF
- `POST /api/pdf/convert/to-jpg` - PDF to images
- `POST /api/pdf/convert/from-jpg` - Images to PDF

### Billing & Subscriptions

- `GET /api/billing/plans` - Get subscription plans
- `GET /api/billing/subscription` - Get user subscription
- `POST /api/billing/subscribe` - Subscribe to plan
- `POST /api/billing/cancel-subscription` - Cancel subscription
- `GET /api/billing/invoices` - Get invoices

## Configuration

### Environment Variables

| Variable                      | Description                | Default                      |
| ----------------------------- | -------------------------- | ---------------------------- |
| `DATABASE_URL`                | Database connection string | `sqlite:///./pdf_toolkit.db` |
| `SECRET_KEY`                  | JWT secret key             | Required                     |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Access token expiry        | `30`                         |
| `MAX_FILE_SIZE_MB`            | Maximum file size          | `100`                        |
| `HOST`                        | Server host                | `0.0.0.0`                    |
| `PORT`                        | Server port                | `8000`                       |

### Database Setup

The API supports multiple databases:

- **SQLite** (default, for development)
- **PostgreSQL** (recommended for production)
- **MySQL**

To use PostgreSQL:

```bash
pip install psycopg2-binary
export DATABASE_URL="postgresql://user:password@localhost/dbname"
```

## Development

### Project Structure

```
backend/
├── src/
│   ├── main.py              # FastAPI application
│   ├── models/              # Database models
│   │   ├── user_model.py
│   │   ├── subscription_model.py
│   │   └── job_model.py
│   ├── routes/              # API routes
│   │   ├── pdf_routes.py
│   │   ├── user_routes.py
│   │   └── billing_routes.py
│   └── services/            # Business logic
│       ├── database.py
│       ├── auth_service.py
│       ├── file_storage.py
│       ├── pdf_utils.py
│       └── cleanup.py
├── requirements.txt
├── env.example
└── README.md
```

### Running Tests

```bash
pytest
```

### Code Formatting

```bash
black src/
isort src/
```

### Database Migrations

```bash
# Generate migration
alembic revision --autogenerate -m "Description"

# Apply migration
alembic upgrade head
```

## Production Deployment

### Using Docker Compose

```yaml
version: "3.8"
services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/pdf_toolkit
    depends_on:
      - db
      - redis

  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=pdf_toolkit
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:6-alpine

volumes:
  postgres_data:
```

### Environment Setup

1. Set up PostgreSQL database
2. Configure environment variables
3. Set up file storage (local or cloud)
4. Configure reverse proxy (nginx)
5. Set up SSL certificates
6. Configure monitoring and logging

## Security Considerations

- Change default SECRET_KEY in production
- Use HTTPS in production
- Implement rate limiting
- Validate all file uploads
- Regular security updates
- Monitor for suspicious activity

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:

- Create an issue on GitHub
- Check the documentation
- Review the API docs at `/docs`
