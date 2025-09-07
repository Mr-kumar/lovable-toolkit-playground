import { useState, useCallback } from 'react';

// File type detection
export type FileType =
  | "pdf"
  | "image"
  | "document"
  | "presentation"
  | "spreadsheet"
  | "mixed";

interface FileValidationResult {
  validFiles: File[];
  errors: string[];
}

export const useFileHandler = (initialFiles: File[] = []) => {
  const [files, setFiles] = useState<File[]>(initialFiles);
  const [errors, setErrors] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // File validation constants
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  const ALLOWED_EXTENSIONS = [
    "pdf",
    "doc",
    "docx",
    "ppt",
    "pptx",
    "xls",
    "xlsx",
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "webp",
    "tiff",
  ];

  // File type detection
  const getFileType = (file: File): FileType => {
    const extension = file.name.split(".").pop()?.toLowerCase();

    if (extension === "pdf") return "pdf";
    if (["jpg", "jpeg", "png", "gif", "bmp", "webp", "tiff"].includes(extension || ""))
      return "image";
    if (["doc", "docx"].includes(extension || "")) return "document";
    if (["ppt", "pptx"].includes(extension || "")) return "presentation";
    if (["xls", "xlsx"].includes(extension || "")) return "spreadsheet";

    return "mixed";
  };

  const getFilesType = (files: File[]): FileType => {
    if (files.length === 0) return "mixed";

    const types = files.map(getFileType);
    const uniqueTypes = [...new Set(types)];

    if (uniqueTypes.length === 1) return uniqueTypes[0];
    return "mixed";
  };

  // File validation functions
  const validateFile = (file: File): string[] => {
    const errors: string[] = [];

    // Check file extension
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
      errors.push(
        `${file.name}: Unsupported file format (.${extension}). Please upload PDF, Word, Excel, PowerPoint, or image files.`
      );
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      errors.push(`${file.name}: File too large. Maximum size is 50MB.`);
    }

    // Check for empty files
    if (file.size === 0) {
      errors.push(`${file.name}: File is empty.`);
    }

    return errors;
  };

  const validateMultipleFiles = (fileList: File[]): FileValidationResult => {
    const allErrors: string[] = [];
    const validFiles: File[] = [];

    fileList.forEach((file) => {
      const fileErrors = validateFile(file);
      if (fileErrors.length === 0) {
        validFiles.push(file);
      } else {
        allErrors.push(...fileErrors);
      }
    });

    return { validFiles, errors: allErrors };
  };

  const handleFiles = useCallback(async (list: FileList | null): Promise<File[]> => {
    if (!list) return [];

    setIsUploading(true);
    setErrors([]);

    const fileList = Array.from(list);
    const { validFiles, errors: validationErrors } = validateMultipleFiles(fileList);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setIsUploading(false);
      return [];
    }

    if (validFiles.length === 0) {
      setErrors(["No valid files selected."]);
      setIsUploading(false);
      return [];
    }

    // Simulate upload delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    setFiles((prev) => [...prev, ...validFiles]);
    setIsUploading(false);
    return validFiles;
  }, []);

  const onDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    return await handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  // File metadata helper
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const resetFiles = useCallback(() => {
    setFiles([]);
  }, []);

  return {
    files,
    errors,
    isUploading,
    isDragOver,
    handleFiles,
    onDrop,
    onDragOver,
    onDragLeave,
    getFileType,
    getFilesType,
    formatFileSize,
    clearErrors,
    removeFile,
    resetFiles,
    setFiles,
    setErrors,
    setIsUploading,
  };
};