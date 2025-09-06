import os
import uuid
import asyncio
from typing import List, Optional, Dict, Any, Tuple
from pathlib import Path
import logging
from fastapi import HTTPException, UploadFile
import PyPDF2
from PyPDF2.errors import PdfReadError, PdfWriteError, PdfStreamError
import fitz  # PyMuPDF
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.utils import ImageReader
from PIL import Image
import io
import tempfile
import subprocess
import shutil

# Configure logging
logger = logging.getLogger(__name__)

class PDFProcessor:
    """Main PDF processing class with all PDF operations"""
    
    def __init__(self):
        self.temp_dir = Path(tempfile.gettempdir()) / "pdf_processor"
        self.temp_dir.mkdir(exist_ok=True)
    
    async def compress_pdf(self, input_path: str, output_path: str, quality: int = 50) -> Dict[str, Any]:
        """Compress PDF file with specific error handling"""
        try:
            # Validate input file exists
            if not os.path.exists(input_path):
                raise HTTPException(status_code=404, detail="Input PDF file not found")
            
            # Validate quality parameter
            if not 1 <= quality <= 100:
                raise HTTPException(status_code=400, detail="Quality must be between 1 and 100")
            
            with open(input_path, 'rb') as input_file:
                try:
                    pdf_reader = PyPDF2.PdfReader(input_file)
                except PdfReadError as e:
                    raise HTTPException(status_code=400, detail=f"Invalid PDF file: {str(e)}")
                except PdfStreamError as e:
                    raise HTTPException(status_code=400, detail=f"Corrupted PDF file: {str(e)}")
                
                pdf_writer = PyPDF2.PdfWriter()
                
                try:
                    for page in pdf_reader.pages:
                        # Compress page content
                        page.compress_content_streams()
                        pdf_writer.add_page(page)
                except PdfReadError as e:
                    raise HTTPException(status_code=400, detail=f"Error reading PDF pages: {str(e)}")
                
                try:
                    with open(output_path, 'wb') as output_file:
                        pdf_writer.write(output_file)
                except PdfWriteError as e:
                    raise HTTPException(status_code=500, detail=f"Error writing compressed PDF: {str(e)}")
                except IOError as e:
                    raise HTTPException(status_code=500, detail=f"File system error: {str(e)}")
            
            # Calculate compression ratio
            original_size = os.path.getsize(input_path)
            compressed_size = os.path.getsize(output_path)
            compression_ratio = (1 - compressed_size / original_size) * 100
            
            return {
                "success": True,
                "compression_ratio": round(compression_ratio, 2),
                "original_size": original_size,
                "compressed_size": compressed_size
            }
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Unexpected error in compress_pdf: {e}")
            raise HTTPException(status_code=500, detail="PDF compression failed due to unexpected error")
    
    async def merge_pdfs(self, input_paths: List[str], output_path: str) -> Dict[str, Any]:
        """Merge multiple PDF files with specific error handling"""
        try:
            # Validate input files
            for path in input_paths:
                if not os.path.exists(path):
                    raise HTTPException(status_code=404, detail=f"Input file not found: {path}")
            
            pdf_writer = PyPDF2.PdfWriter()
            total_pages = 0
            
            for input_path in input_paths:
                try:
                    with open(input_path, 'rb') as input_file:
                        pdf_reader = PyPDF2.PdfReader(input_file)
                        
                        for page in pdf_reader.pages:
                            pdf_writer.add_page(page)
                            total_pages += 1
                            
                except PdfReadError as e:
                    raise HTTPException(status_code=400, detail=f"Invalid PDF file {input_path}: {str(e)}")
                except PdfStreamError as e:
                    raise HTTPException(status_code=400, detail=f"Corrupted PDF file {input_path}: {str(e)}")
                except IOError as e:
                    raise HTTPException(status_code=500, detail=f"File system error reading {input_path}: {str(e)}")
            
            try:
                with open(output_path, 'wb') as output_file:
                    pdf_writer.write(output_file)
            except PdfWriteError as e:
                raise HTTPException(status_code=500, detail=f"Error writing merged PDF: {str(e)}")
            except IOError as e:
                raise HTTPException(status_code=500, detail=f"File system error writing output: {str(e)}")
            
            return {
                "success": True,
                "total_pages": total_pages,
                "files_merged": len(input_paths)
            }
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Unexpected error in merge_pdfs: {e}")
            raise HTTPException(status_code=500, detail="PDF merge failed due to unexpected error")
    
    async def split_pdf(self, input_path: str, output_dir: str, pages: str) -> Dict[str, Any]:
        """Split PDF by pages with specific error handling"""
        try:
            # Validate input file
            if not os.path.exists(input_path):
                raise HTTPException(status_code=404, detail="Input PDF file not found")
            
            # Parse pages parameter
            try:
                page_numbers = self._parse_page_numbers(pages)
            except ValueError as e:
                raise HTTPException(status_code=400, detail=f"Invalid page specification: {str(e)}")
            
            # Read PDF
            try:
                with open(input_path, 'rb') as input_file:
                    pdf_reader = PyPDF2.PdfReader(input_file)
                    total_pages = len(pdf_reader.pages)
            except PdfReadError as e:
                raise HTTPException(status_code=400, detail=f"Invalid PDF file: {str(e)}")
            except PdfStreamError as e:
                raise HTTPException(status_code=400, detail=f"Corrupted PDF file: {str(e)}")
            
            # Validate page numbers
            for page_num in page_numbers:
                if page_num < 1 or page_num > total_pages:
                    raise HTTPException(
                        status_code=400, 
                        detail=f"Page {page_num} is out of range (1-{total_pages})"
                    )
            
            # Create output directory
            os.makedirs(output_dir, exist_ok=True)
            
            output_files = []
            for i, page_num in enumerate(page_numbers):
                try:
                    pdf_writer = PyPDF2.PdfWriter()
                    pdf_writer.add_page(pdf_reader.pages[page_num - 1])  # Convert to 0-based index
                    
                    output_file = os.path.join(output_dir, f"page_{page_num}.pdf")
                    with open(output_file, 'wb') as f:
                        pdf_writer.write(f)
                    
                    output_files.append(output_file)
                    
                except PdfWriteError as e:
                    raise HTTPException(status_code=500, detail=f"Error writing page {page_num}: {str(e)}")
                except IOError as e:
                    raise HTTPException(status_code=500, detail=f"File system error writing page {page_num}: {str(e)}")
            
            return {
                "success": True,
                "pages_extracted": len(page_numbers),
                "output_files": output_files
            }
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Unexpected error in split_pdf: {e}")
            raise HTTPException(status_code=500, detail="PDF split failed due to unexpected error")
    
    def _parse_page_numbers(self, pages: str) -> List[int]:
        """Parse page specification string into list of page numbers"""
        page_numbers = []
        
        for part in pages.split(','):
            part = part.strip()
            if '-' in part:
                # Range specification (e.g., "1-5")
                try:
                    start, end = map(int, part.split('-'))
                    page_numbers.extend(range(start, end + 1))
                except ValueError:
                    raise ValueError(f"Invalid range format: {part}")
            else:
                # Single page number
                try:
                    page_numbers.append(int(part))
                except ValueError:
                    raise ValueError(f"Invalid page number: {part}")
        
        return sorted(list(set(page_numbers)))  # Remove duplicates and sort
    
    async def rotate_pdf(self, input_path: str, output_path: str, angle: int) -> Dict[str, Any]:
        """Rotate PDF pages with specific error handling"""
        try:
            # Validate input file
            if not os.path.exists(input_path):
                raise HTTPException(status_code=404, detail="Input PDF file not found")
            
            # Validate angle
            if angle not in [90, 180, 270]:
                raise HTTPException(status_code=400, detail="Angle must be 90, 180, or 270 degrees")
            
            try:
                with open(input_path, 'rb') as input_file:
                    pdf_reader = PyPDF2.PdfReader(input_file)
                    pdf_writer = PyPDF2.PdfWriter()
                    
                    for page in pdf_reader.pages:
                        page.rotate(angle)
                        pdf_writer.add_page(page)
                    
                    with open(output_path, 'wb') as output_file:
                        pdf_writer.write(output_file)
                        
            except PdfReadError as e:
                raise HTTPException(status_code=400, detail=f"Invalid PDF file: {str(e)}")
            except PdfWriteError as e:
                raise HTTPException(status_code=500, detail=f"Error writing rotated PDF: {str(e)}")
            except IOError as e:
                raise HTTPException(status_code=500, detail=f"File system error: {str(e)}")
            
            return {
                "success": True,
                "rotation_angle": angle,
                "pages_rotated": len(pdf_reader.pages)
            }
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Unexpected error in rotate_pdf: {e}")
            raise HTTPException(status_code=500, detail="PDF rotation failed due to unexpected error")
    
    async def add_watermark(self, input_path: str, output_path: str, watermark_text: str) -> Dict[str, Any]:
        """Add watermark to PDF with specific error handling"""
        try:
            # Validate input file
            if not os.path.exists(input_path):
                raise HTTPException(status_code=404, detail="Input PDF file not found")
            
            # Validate watermark text
            if not watermark_text or len(watermark_text.strip()) == 0:
                raise HTTPException(status_code=400, detail="Watermark text is required")
            
            try:
                with open(input_path, 'rb') as input_file:
                    pdf_reader = PyPDF2.PdfReader(input_file)
                    pdf_writer = PyPDF2.PdfWriter()
                    
                    # Create watermark PDF
                    watermark_path = self._create_watermark_pdf(watermark_text)
                    
                    try:
                        with open(watermark_path, 'rb') as watermark_file:
                            watermark_reader = PyPDF2.PdfReader(watermark_file)
                            watermark_page = watermark_reader.pages[0]
                            
                            for page in pdf_reader.pages:
                                page.merge_page(watermark_page)
                                pdf_writer.add_page(page)
                            
                            with open(output_path, 'wb') as output_file:
                                pdf_writer.write(output_file)
                                
                    finally:
                        # Clean up watermark file
                        if os.path.exists(watermark_path):
                            os.unlink(watermark_path)
                            
            except PdfReadError as e:
                raise HTTPException(status_code=400, detail=f"Invalid PDF file: {str(e)}")
            except PdfWriteError as e:
                raise HTTPException(status_code=500, detail=f"Error writing watermarked PDF: {str(e)}")
            except IOError as e:
                raise HTTPException(status_code=500, detail=f"File system error: {str(e)}")
            
            return {
                "success": True,
                "watermark_text": watermark_text,
                "pages_watermarked": len(pdf_reader.pages)
            }
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Unexpected error in add_watermark: {e}")
            raise HTTPException(status_code=500, detail="PDF watermarking failed due to unexpected error")
    
    def _create_watermark_pdf(self, text: str) -> str:
        """Create a watermark PDF with the given text"""
        watermark_path = os.path.join(self.temp_dir, f"watermark_{uuid.uuid4()}.pdf")
        
        try:
            c = canvas.Canvas(watermark_path, pagesize=A4)
            width, height = A4
            
            # Set font and color
            c.setFont("Helvetica", 50)
            c.setFillColorRGB(0.7, 0.7, 0.7, alpha=0.3)
            
            # Rotate text and position
            c.rotate(45)
            c.drawString(200, -100, text)
            
            c.save()
            return watermark_path
            
        except Exception as e:
            logger.error(f"Error creating watermark PDF: {e}")
            raise HTTPException(status_code=500, detail="Failed to create watermark")
    
    async def protect_pdf(self, input_path: str, output_path: str, password: str) -> Dict[str, Any]:
        """Password protect PDF with specific error handling"""
        try:
            # Validate input file
            if not os.path.exists(input_path):
                raise HTTPException(status_code=404, detail="Input PDF file not found")
            
            # Validate password
            if not password or len(password.strip()) == 0:
                raise HTTPException(status_code=400, detail="Password is required")
            
            try:
                with open(input_path, 'rb') as input_file:
                    pdf_reader = PyPDF2.PdfReader(input_file)
                    pdf_writer = PyPDF2.PdfWriter()
                    
                    # Copy all pages
                    for page in pdf_reader.pages:
                        pdf_writer.add_page(page)
                    
                    # Add password protection
                    pdf_writer.encrypt(password)
                    
                    with open(output_path, 'wb') as output_file:
                        pdf_writer.write(output_file)
                        
            except PdfReadError as e:
                raise HTTPException(status_code=400, detail=f"Invalid PDF file: {str(e)}")
            except PdfWriteError as e:
                raise HTTPException(status_code=500, detail=f"Error writing protected PDF: {str(e)}")
            except IOError as e:
                raise HTTPException(status_code=500, detail=f"File system error: {str(e)}")
            
            return {
                "success": True,
                "protected": True
            }
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Unexpected error in protect_pdf: {e}")
            raise HTTPException(status_code=500, detail="PDF protection failed due to unexpected error")
    
    async def unlock_pdf(self, input_path: str, output_path: str, password: str) -> Dict[str, Any]:
        """Remove password protection from PDF with specific error handling"""
        try:
            # Validate input file
            if not os.path.exists(input_path):
                raise HTTPException(status_code=404, detail="Input PDF file not found")
            
            # Validate password
            if not password:
                raise HTTPException(status_code=400, detail="Password is required")
            
            try:
                with open(input_path, 'rb') as input_file:
                    pdf_reader = PyPDF2.PdfReader(input_file)
                    
                    # Check if PDF is encrypted
                    if not pdf_reader.is_encrypted:
                        raise HTTPException(status_code=400, detail="PDF is not password protected")
                    
                    # Try to decrypt with provided password
                    try:
                        pdf_reader.decrypt(password)
                    except Exception:
                        raise HTTPException(status_code=401, detail="Incorrect password")
                    
                    # Create unprotected PDF
                    pdf_writer = PyPDF2.PdfWriter()
                    for page in pdf_reader.pages:
                        pdf_writer.add_page(page)
                    
                    with open(output_path, 'wb') as output_file:
                        pdf_writer.write(output_file)
                        
            except PdfReadError as e:
                raise HTTPException(status_code=400, detail=f"Invalid PDF file: {str(e)}")
            except PdfWriteError as e:
                raise HTTPException(status_code=500, detail=f"Error writing unlocked PDF: {str(e)}")
            except IOError as e:
                raise HTTPException(status_code=500, detail=f"File system error: {str(e)}")
            
            return {
                "success": True,
                "unlocked": True
            }
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Unexpected error in unlock_pdf: {e}")
            raise HTTPException(status_code=500, detail="PDF unlock failed due to unexpected error")
    
    async def compare_pdfs(self, file1_path: str, file2_path: str) -> Dict[str, Any]:
        """Compare two PDF files with specific error handling"""
        try:
            # Validate input files
            if not os.path.exists(file1_path):
                raise HTTPException(status_code=404, detail="First PDF file not found")
            if not os.path.exists(file2_path):
                raise HTTPException(status_code=404, detail="Second PDF file not found")
            
            try:
                with open(file1_path, 'rb') as file1:
                    pdf1_reader = PyPDF2.PdfReader(file1)
                    pages1 = len(pdf1_reader.pages)
                
                with open(file2_path, 'rb') as file2:
                    pdf2_reader = PyPDF2.PdfReader(file2)
                    pages2 = len(pdf2_reader.pages)
                    
            except PdfReadError as e:
                raise HTTPException(status_code=400, detail=f"Invalid PDF file: {str(e)}")
            except IOError as e:
                raise HTTPException(status_code=500, detail=f"File system error: {str(e)}")
            
            # Simple comparison (can be enhanced)
            differences_found = pages1 != pages2
            similarity_score = 100 if pages1 == pages2 else 0
            
            return {
                "success": True,
                "comparison_result": "different" if differences_found else "identical",
                "differences_found": differences_found,
                "similarity_score": similarity_score,
                "file1_pages": pages1,
                "file2_pages": pages2,
                "differences": ["Page count differs"] if differences_found else []
            }
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Unexpected error in compare_pdfs: {e}")
            raise HTTPException(status_code=500, detail="PDF comparison failed due to unexpected error")
    
    async def ocr_pdf(self, input_path: str, output_path: str, language: str = "eng") -> Dict[str, Any]:
        """Perform OCR on PDF with specific error handling"""
        try:
            # Validate input file
            if not os.path.exists(input_path):
                raise HTTPException(status_code=404, detail="Input PDF file not found")
            
            # This is a placeholder implementation
            # In a real implementation, you would use Tesseract or similar OCR engine
            raise HTTPException(status_code=501, detail="OCR functionality not yet implemented")
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Unexpected error in ocr_pdf: {e}")
            raise HTTPException(status_code=500, detail="PDF OCR failed due to unexpected error")
    
    async def repair_pdf(self, input_path: str, output_path: str) -> Dict[str, Any]:
        """Repair corrupted PDF with specific error handling"""
        try:
            # Validate input file
            if not os.path.exists(input_path):
                raise HTTPException(status_code=404, detail="Input PDF file not found")
            
            # This is a placeholder implementation
            # In a real implementation, you would use specialized PDF repair tools
            raise HTTPException(status_code=501, detail="PDF repair functionality not yet implemented")
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Unexpected error in repair_pdf: {e}")
            raise HTTPException(status_code=500, detail="PDF repair failed due to unexpected error")
    
    async def crop_pdf(self, input_path: str, output_path: str, x: float, y: float, width: float, height: float) -> Dict[str, Any]:
        """Crop PDF pages with specific error handling"""
        try:
            # Validate input file
            if not os.path.exists(input_path):
                raise HTTPException(status_code=404, detail="Input PDF file not found")
            
            # This is a placeholder implementation
            # In a real implementation, you would use PyMuPDF or similar
            raise HTTPException(status_code=501, detail="PDF crop functionality not yet implemented")
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Unexpected error in crop_pdf: {e}")
            raise HTTPException(status_code=500, detail="PDF crop failed due to unexpected error")
    
    async def redact_pdf(self, input_path: str, output_path: str, redaction_areas: str) -> Dict[str, Any]:
        """Redact PDF content with specific error handling"""
        try:
            # Validate input file
            if not os.path.exists(input_path):
                raise HTTPException(status_code=404, detail="Input PDF file not found")
            
            # This is a placeholder implementation
            # In a real implementation, you would use PyMuPDF or similar
            raise HTTPException(status_code=501, detail="PDF redaction functionality not yet implemented")
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Unexpected error in redact_pdf: {e}")
            raise HTTPException(status_code=500, detail="PDF redaction failed due to unexpected error")
    
    async def sign_pdf(self, input_path: str, output_path: str, signature_text: str, x: float, y: float, width: float, height: float) -> Dict[str, Any]:
        """Add digital signature to PDF with specific error handling"""
        try:
            # Validate input file
            if not os.path.exists(input_path):
                raise HTTPException(status_code=404, detail="Input PDF file not found")
            
            # This is a placeholder implementation
            # In a real implementation, you would use digital signature libraries
            raise HTTPException(status_code=501, detail="PDF signing functionality not yet implemented")
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Unexpected error in sign_pdf: {e}")
            raise HTTPException(status_code=500, detail="PDF signing failed due to unexpected error")

# Global PDF processor instance
pdf_processor = PDFProcessor()