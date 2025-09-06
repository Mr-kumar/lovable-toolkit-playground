"""
Main API Router
Consolidates all API endpoints into a single router
"""

from fastapi import APIRouter
from api.user import auth, profile, history
from api.pdf import compress, merge, split
from api.pdf.convert import word_to_pdf, excel_to_pdf, html_to_pdf, pdf_to_word, pdf_to_excel, ppt_to_pdf, pdf_to_ppt
from api.pdf.edit import rotate, add_watermark, crop, redact, sign
from api.pdf.security import protect, unlock, compare
from api.pdf.optimize import ocr, repair

# Create main API router
api_router = APIRouter()

# User API routes
api_router.include_router(
    auth.router,
    prefix="/user/auth",
    tags=["User Authentication"]
)

api_router.include_router(
    profile.router,
    prefix="/user/profile",
    tags=["User Profile"]
)

api_router.include_router(
    history.router,
    prefix="/user/history",
    tags=["User History"]
)

# PDF Core Operations
api_router.include_router(
    compress.router,
    prefix="/pdf/compress",
    tags=["PDF Compression"]
)

api_router.include_router(
    merge.router,
    prefix="/pdf/merge",
    tags=["PDF Merge"]
)

api_router.include_router(
    split.router,
    prefix="/pdf/split",
    tags=["PDF Split"]
)

# PDF Conversion Operations
api_router.include_router(
    word_to_pdf.router,
    prefix="/pdf/convert/word-to-pdf",
    tags=["Word to PDF"]
)

api_router.include_router(
    excel_to_pdf.router,
    prefix="/pdf/convert/excel-to-pdf",
    tags=["Excel to PDF"]
)

api_router.include_router(
    html_to_pdf.router,
    prefix="/pdf/convert/html-to-pdf",
    tags=["HTML to PDF"]
)

api_router.include_router(
    pdf_to_word.router,
    prefix="/pdf/convert/pdf-to-word",
    tags=["PDF to Word"]
)

api_router.include_router(
    pdf_to_excel.router,
    prefix="/pdf/convert/pdf-to-excel",
    tags=["PDF to Excel"]
)

api_router.include_router(
    ppt_to_pdf.router,
    prefix="/pdf/convert/ppt-to-pdf",
    tags=["PowerPoint to PDF"]
)

api_router.include_router(
    pdf_to_ppt.router,
    prefix="/pdf/convert/pdf-to-ppt",
    tags=["PDF to PowerPoint"]
)

# PDF Edit Operations
api_router.include_router(
    rotate.router,
    prefix="/pdf/edit/rotate",
    tags=["PDF Rotate"]
)

api_router.include_router(
    add_watermark.router,
    prefix="/pdf/edit/watermark",
    tags=["PDF Watermark"]
)

api_router.include_router(
    crop.router,
    prefix="/pdf/edit/crop",
    tags=["PDF Crop"]
)

api_router.include_router(
    redact.router,
    prefix="/pdf/edit/redact",
    tags=["PDF Redact"]
)

api_router.include_router(
    sign.router,
    prefix="/pdf/edit/sign",
    tags=["PDF Sign"]
)

# PDF Security Operations
api_router.include_router(
    protect.router,
    prefix="/pdf/security/protect",
    tags=["PDF Protection"]
)

api_router.include_router(
    unlock.router,
    prefix="/pdf/security/unlock",
    tags=["PDF Unlock"]
)

api_router.include_router(
    compare.router,
    prefix="/pdf/security/compare",
    tags=["PDF Compare"]
)

# PDF Optimization Operations
api_router.include_router(
    ocr.router,
    prefix="/pdf/optimize/ocr",
    tags=["PDF OCR"]
)

api_router.include_router(
    repair.router,
    prefix="/pdf/optimize/repair",
    tags=["PDF Repair"]
)
