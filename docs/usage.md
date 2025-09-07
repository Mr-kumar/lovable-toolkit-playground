## Getting Started & Usage

### Authenticate
1) Register, then login to get tokens.
```bash
curl -s -X POST http://localhost:8000/api/user/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","password":"secret","full_name":"User"}'

curl -s -X POST http://localhost:8000/api/user/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","password":"secret"}'
```

### Call an API (example: Compress PDF)
```bash
curl -s -X POST http://localhost:8000/api/pdf/compress/ \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -F file=@input.pdf -F quality=60
```

### Frontend: calling the backend
```ts
async function compress(file: File, token: string) {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('quality', '60')
  const res = await fetch('/api/pdf/compress/', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
```

### Download processed files
Responses include a `download_url` like `/storage/downloads/{userId}/{jobId}/{filename}` that can be linked directly in the UI.

### Notes
- Some optimize/edit operations are placeholders until implemented in `services/pdf_utils.py`.
- File size and monthly limits are enforced by user subscription.

