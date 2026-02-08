import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonicalUrl?: string;
  noIndex?: boolean;
}

// Default SEO values
const DEFAULT_TITLE = 'PDF Tools - Free Online PDF Converter & Editor';
const DEFAULT_DESCRIPTION = 'Free online PDF tools. Convert, merge, split, compress, edit PDF files. No registration required. Secure and fast.';
const DEFAULT_KEYWORDS = 'PDF converter, PDF editor, merge PDF, split PDF, compress PDF, PDF to Word, Word to PDF, free PDF tools';

export const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  ogImage = '/og-image.png',
  ogType = 'website',
  canonicalUrl,
  noIndex = false,
}) => {
  const fullTitle = title ? `${title} | PDF Tools` : DEFAULT_TITLE;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      {ogImage && <meta property="twitter:image" content={ogImage} />}
    </Helmet>
  );
};

// Tool-specific SEO configurations
export interface ToolSEOConfig {
  title: string;
  description: string;
  keywords: string;
}

export const toolSEOConfig: Record<string, ToolSEOConfig> = {
  'compress-pdf': {
    title: 'Compress PDF - Reduce PDF File Size Free',
    description: 'Compress PDF files online for free. Reduce PDF size up to 99% while maintaining quality. No registration required.',
    keywords: 'compress PDF, reduce PDF size, PDF compressor, shrink PDF, optimize PDF',
  },
  'merge-pdf': {
    title: 'Merge PDF - Combine PDF Files Free Online',
    description: 'Merge multiple PDF files into one document. Free online PDF merger. Drag and drop to reorder pages. No registration required.',
    keywords: 'merge PDF, combine PDF, join PDF, PDF merger, unite PDF files',
  },
  'split-pdf': {
    title: 'Split PDF - Separate PDF Pages Free Online',
    description: 'Split PDF into multiple files. Extract pages from PDF. Free online PDF splitter. No registration required.',
    keywords: 'split PDF, separate PDF, extract PDF pages, PDF splitter, divide PDF',
  },
  'pdf-to-word': {
    title: 'PDF to Word - Convert PDF to DOCX Free Online',
    description: 'Convert PDF to editable Word document. Free online PDF to DOCX converter. Preserve formatting. No registration required.',
    keywords: 'PDF to Word, PDF to DOCX, convert PDF to Word, PDF converter, editable Word',
  },
  'word-to-pdf': {
    title: 'Word to PDF - Convert DOCX to PDF Free Online',
    description: 'Convert Word documents to PDF format. Free online Word to PDF converter. Preserve fonts and formatting. No registration required.',
    keywords: 'Word to PDF, DOCX to PDF, convert Word to PDF, Word converter',
  },
  'protect-pdf': {
    title: 'Protect PDF - Password Protect PDF Free Online',
    description: 'Add password protection to PDF files. Encrypt PDF documents. Free online PDF protection tool. No registration required.',
    keywords: 'protect PDF, password PDF, encrypt PDF, secure PDF, PDF security',
  },
  'unlock-pdf': {
    title: 'Unlock PDF - Remove PDF Password Free Online',
    description: 'Remove password from PDF files. Unlock protected PDF documents. Free online PDF unlocker. No registration required.',
    keywords: 'unlock PDF, remove PDF password, decrypt PDF, PDF unlocker',
  },
  'rotate-pdf': {
    title: 'Rotate PDF - Rotate PDF Pages Free Online',
    description: 'Rotate PDF pages 90, 180, or 270 degrees. Free online PDF rotation tool. No registration required.',
    keywords: 'rotate PDF, turn PDF, flip PDF, PDF rotation, change PDF orientation',
  },
  'watermark': {
    title: 'Add Watermark to PDF - Free Online',
    description: 'Add text or image watermark to PDF. Customize opacity and position. Free online PDF watermark tool. No registration required.',
    keywords: 'PDF watermark, add watermark, stamp PDF, watermark PDF online',
  },
  'repair-pdf': {
    title: 'Repair PDF - Fix Corrupted PDF Files Free',
    description: 'Repair damaged or corrupted PDF files. Recover data from broken PDFs. Free online PDF repair tool. No registration required.',
    keywords: 'repair PDF, fix PDF, recover PDF, corrupted PDF, PDF recovery',
  },
  'ocr-pdf': {
    title: 'OCR PDF - Extract Text from Scanned PDF Free',
    description: 'Extract text from scanned PDFs using OCR. Make PDFs searchable. Free online OCR tool. No registration required.',
    keywords: 'OCR PDF, extract text, searchable PDF, scanned PDF, text recognition',
  },
  'compare-pdf': {
    title: 'Compare PDF - Find Differences Between PDFs Free',
    description: 'Compare two PDF documents side by side. Highlight differences. Free online PDF comparison tool. No registration required.',
    keywords: 'compare PDF, PDF differences, PDF comparison, compare documents',
  },
  'pdf-to-jpg': {
    title: 'PDF to JPG - Convert PDF to Images Free Online',
    description: 'Convert PDF pages to JPG images. Free online PDF to image converter. High quality output. No registration required.',
    keywords: 'PDF to JPG, PDF to image, convert PDF to JPG, PDF to JPEG',
  },
  'jpg-to-pdf': {
    title: 'JPG to PDF - Convert Images to PDF Free Online',
    description: 'Convert JPG images to PDF document. Combine multiple images into one PDF. Free online converter. No registration required.',
    keywords: 'JPG to PDF, image to PDF, convert JPG to PDF, photo to PDF',
  },
};

// Helper to get SEO config for a tool
export const getToolSEO = (toolId: string): ToolSEOConfig => {
  return toolSEOConfig[toolId] || {
    title: 'PDF Tools',
    description: DEFAULT_DESCRIPTION,
    keywords: DEFAULT_KEYWORDS,
  };
};

export default SEO;
