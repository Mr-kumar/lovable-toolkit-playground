import os
import uuid
import asyncio
from typing import List, Optional, Dict, Any, Tuple
from pathlib import Path
import logging
from fastapi import HTTPException, UploadFile
import PyPDF2
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
        """Compress PDF file"""
        try:
            with open(input_path, 'rb') as input_file:
                pdf_reader = PyPDF2.PdfReader(input_file)
                pdf_writer = PyPDF2.PdfWriter()
                
                for page in pdf_reader.pages:
                    # Compress page content
                    page.compress_content_streams()
                    pdf_writer.add_page(page)
                
                with open(output_path, 'wb') as output_file:
                    pdf_writer.write(output_file)
            
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
            
        except Exception as e:
            logger.error(f"PDF compression failed: {e}")
            raise HTTPException(status_code=500, detail=f"PDF compression failed: {str(e)}")
    
    async def merge_pdfs(self, input_paths: List[str], output_path: str) -> Dict[str, Any]:
        """Merge multiple PDF files"""
        try:
            pdf_writer = PyPDF2.PdfWriter()
            total_pages = 0
            
            for input_path in input_paths:
                with open(input_path, 'rb') as input_file:
                    pdf_reader = PyPDF2.PdfReader(input_file)
                    for page in pdf_reader.pages:
                        pdf_writer.add_page(page)
                        total_pages += 1
            
            with open(output_path, 'wb') as output_file:
                pdf_writer.write(output_file)
            
            return {
                "success": True,
                "total_pages": total_pages,
                "files_merged": len(input_paths)
            }
            
        except Exception as e:
            logger.error(f"PDF merge failed: {e}")
            raise HTTPException(status_code=500, detail=f"PDF merge failed: {str(e)}")
    
    async def split_pdf(self, input_path: str, output_dir: str, pages: str = "1") -> Dict[str, Any]:
        """Split PDF by pages"""
        try:
            with open(input_path, 'rb') as input_file:
                pdf_reader = PyPDF2.PdfReader(input_file)
                total_pages = len(pdf_reader.pages)
                
                # Parse pages parameter
                page_numbers = self._parse_page_numbers(pages, total_pages)
                
                output_files = []
                for page_num in page_numbers:
                    pdf_writer = PyPDF2.PdfWriter()
                    pdf_writer.add_page(pdf_reader.pages[page_num - 1])
                    
                    output_filename = f"page_{page_num}.pdf"
                    output_path = os.path.join(output_dir, output_filename)
                    
                    with open(output_path, 'wb') as output_file:
                        pdf_writer.write(output_file)
                    
                    output_files.append(output_path)
                
                return {
                    "success": True,
                    "pages_extracted": len(page_numbers),
                    "output_files": output_files
                }
                
        except Exception as e:
            logger.error(f"PDF split failed: {e}")
            raise HTTPException(status_code=500, detail=f"PDF split failed: {str(e)}")
    
    async def rotate_pdf(self, input_path: str, output_path: str, angle: int) -> Dict[str, Any]:
        """Rotate PDF pages"""
        try:
            with open(input_path, 'rb') as input_file:
                pdf_reader = PyPDF2.PdfReader(input_file)
                pdf_writer = PyPDF2.PdfWriter()
                
                for page in pdf_reader.pages:
                    page.rotate(angle)
                    pdf_writer.add_page(page)
                
                with open(output_path, 'wb') as output_file:
                    pdf_writer.write(output_file)
            
            return {
                "success": True,
                "rotation_angle": angle,
                "pages_rotated": len(pdf_reader.pages)
            }
            
        except Exception as e:
            logger.error(f"PDF rotation failed: {e}")
            raise HTTPException(status_code=500, detail=f"PDF rotation failed: {str(e)}")
    
    async def add_watermark(self, input_path: str, output_path: str, watermark_text: str) -> Dict[str, Any]:
        """Add text watermark to PDF"""
        try:
            # Create watermark PDF
            watermark_path = self._create_watermark_pdf(watermark_text)
            
            with open(input_path, 'rb') as input_file, open(watermark_path, 'rb') as watermark_file:
                pdf_reader = PyPDF2.PdfReader(input_file)
                watermark_reader = PyPDF2.PdfReader(watermark_file)
                watermark_page = watermark_reader.pages[0]
                
                pdf_writer = PyPDF2.PdfWriter()
                
                for page in pdf_reader.pages:
                    page.merge_page(watermark_page)
                    pdf_writer.add_page(page)
                
                with open(output_path, 'wb') as output_file:
                    pdf_writer.write(output_file)
            
            # Clean up watermark file
            os.remove(watermark_path)
            
            return {
                "success": True,
                "watermark_text": watermark_text,
                "pages_watermarked": len(pdf_reader.pages)
            }
            
        except Exception as e:
            logger.error(f"Watermark addition failed: {e}")
            raise HTTPException(status_code=500, detail=f"Watermark addition failed: {str(e)}")
    
    async def protect_pdf(self, input_path: str, output_path: str, password: str) -> Dict[str, Any]:
        """Password protect PDF"""
        try:
            with open(input_path, 'rb') as input_file:
                pdf_reader = PyPDF2.PdfReader(input_file)
                pdf_writer = PyPDF2.PdfWriter()
                
                for page in pdf_reader.pages:
                    pdf_writer.add_page(page)
                
                # Encrypt with password
                pdf_writer.encrypt(password)
                
                with open(output_path, 'wb') as output_file:
                    pdf_writer.write(output_file)
            
            return {
                "success": True,
                "protected": True
            }
            
        except Exception as e:
            logger.error(f"PDF protection failed: {e}")
            raise HTTPException(status_code=500, detail=f"PDF protection failed: {str(e)}")
    
    async def unlock_pdf(self, input_path: str, output_path: str, password: str) -> Dict[str, Any]:
        """Remove password protection from PDF"""
        try:
            with open(input_path, 'rb') as input_file:
                pdf_reader = PyPDF2.PdfReader(input_file)
                
                # Check if PDF is encrypted
                if not pdf_reader.is_encrypted:
                    raise HTTPException(status_code=400, detail="PDF is not password protected")
                
                # Try to decrypt with password
                if not pdf_reader.decrypt(password):
                    raise HTTPException(status_code=400, detail="Incorrect password")
                
                pdf_writer = PyPDF2.PdfWriter()
                
                for page in pdf_reader.pages:
                    pdf_writer.add_page(page)
                
                with open(output_path, 'wb') as output_file:
                    pdf_writer.write(output_file)
            
            return {
                "success": True,
                "unlocked": True
            }
            
        except Exception as e:
            logger.error(f"PDF unlock failed: {e}")
            raise HTTPException(status_code=500, detail=f"PDF unlock failed: {str(e)}")
    
    async def pdf_to_images(self, input_path: str, output_dir: str, format: str = "jpg") -> Dict[str, Any]:
        """Convert PDF pages to images"""
        try:
            doc = fitz.open(input_path)
            output_files = []
            
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                pix = page.get_pixmap()
                
                output_filename = f"page_{page_num + 1}.{format}"
                output_path = os.path.join(output_dir, output_filename)
                
                pix.save(output_path)
                output_files.append(output_path)
            
            doc.close()
            
            return {
                "success": True,
                "pages_converted": len(output_files),
                "output_files": output_files
            }
            
        except Exception as e:
            logger.error(f"PDF to images conversion failed: {e}")
            raise HTTPException(status_code=500, detail=f"PDF to images conversion failed: {str(e)}")
    
    async def images_to_pdf(self, image_paths: List[str], output_path: str) -> Dict[str, Any]:
        """Convert images to PDF"""
        try:
            c = canvas.Canvas(output_path, pagesize=A4)
            width, height = A4
            
            for i, image_path in enumerate(image_paths):
                if i > 0:
                    c.showPage()
                
                # Load and resize image
                img = Image.open(image_path)
                img_width, img_height = img.size
                
                # Calculate scaling to fit page
                scale = min(width / img_width, height / img_height)
                new_width = img_width * scale
                new_height = img_height * scale
                
                # Center image on page
                x = (width - new_width) / 2
                y = (height - new_height) / 2
                
                c.drawImage(image_path, x, y, width=new_width, height=new_height)
            
            c.save()
            
            return {
                "success": True,
                "images_converted": len(image_paths)
            }
            
        except Exception as e:
            logger.error(f"Images to PDF conversion failed: {e}")
            raise HTTPException(status_code=500, detail=f"Images to PDF conversion failed: {str(e)}")
    
    def _parse_page_numbers(self, pages: str, total_pages: int) -> List[int]:
        """Parse page numbers from string"""
        page_numbers = []
        
        for part in pages.split(','):
            part = part.strip()
            if '-' in part:
                start, end = map(int, part.split('-'))
                page_numbers.extend(range(start, end + 1))
            else:
                page_numbers.append(int(part))
        
        # Validate page numbers
        for page_num in page_numbers:
            if page_num < 1 or page_num > total_pages:
                raise HTTPException(status_code=400, detail=f"Page {page_num} is out of range (1-{total_pages})")
        
        return sorted(set(page_numbers))
    
    def _create_watermark_pdf(self, text: str) -> str:
        """Create a watermark PDF"""
        watermark_path = self.temp_dir / f"watermark_{uuid.uuid4()}.pdf"
        
        c = canvas.Canvas(str(watermark_path), pagesize=letter)
        width, height = letter
        
        # Set watermark properties
        c.setFont("Helvetica", 50)
        c.setFillColorRGB(0.8, 0.8, 0.8)  # Light gray
        c.rotate(45)  # Rotate text
        
        # Center the watermark
        c.drawString(width/2 - 100, height/2, text)
        c.save()
        
        return str(watermark_path)

# Global PDF processor instance
pdf_processor = PDFProcessor()
