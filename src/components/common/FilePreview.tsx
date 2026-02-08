import React from 'react';
import { FileText, Image, File, Presentation, FileSpreadsheet, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
  onPreview?: () => void;
  className?: string;
  variant?: 'default' | 'compact';
}

// Utility function to get file icon based on extension
export const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  if (extension === 'pdf') return FileText;
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff'].includes(extension || ''))
    return Image;
  if (['doc', 'docx'].includes(extension || '')) return FileText;
  if (['ppt', 'pptx'].includes(extension || '')) return Presentation;
  if (['xls', 'xlsx'].includes(extension || '')) return FileSpreadsheet;
  return File;
};

// Utility function to format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Utility function to get file extension badge color
export const getFileColor = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf': return 'bg-red-500';
    case 'doc':
    case 'docx': return 'bg-blue-500';
    case 'ppt':
    case 'pptx': return 'bg-orange-500';
    case 'xls':
    case 'xlsx': return 'bg-green-500';
    case 'jpg':
    case 'jpeg':
    case 'png': return 'bg-purple-500';
    default: return 'bg-gray-500';
  }
};

export const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  onRemove,
  onPreview,
  className,
  variant = 'default',
}) => {
  const FileIcon = getFileIcon(file.name);
  const extension = file.name.split('.').pop()?.toUpperCase() || 'FILE';

  if (variant === 'compact') {
    return (
      <div className={cn(
        "flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200",
        className
      )}>
        <div className="flex items-center space-x-3 min-w-0">
          <div className={cn("p-2 rounded-lg", getFileColor(file.name).replace('bg-', 'bg-opacity-20 bg-'))}>
            <FileIcon className="h-5 w-5 text-gray-600" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
          aria-label={`Remove ${file.name}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn(
      "bg-white rounded-xl border border-gray-200 p-4 sm:p-6",
      className
    )}>
      <div className="flex flex-col items-center space-y-4">
        {/* File Icon and Preview */}
        <div className="relative">
          <div className="w-16 h-20 sm:w-20 sm:h-24 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
            <FileIcon className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
          </div>
          
          {/* File type badge */}
          <div className={cn(
            "absolute -top-2 -right-2 text-white text-xs px-2 py-1 rounded-full font-medium",
            getFileColor(file.name)
          )}>
            {extension}
          </div>
        </div>

        {/* File Info */}
        <div className="text-center w-full">
          <p className="text-sm sm:text-base font-medium text-gray-900 truncate px-2" title={file.name}>
            {file.name}
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {formatFileSize(file.size)}
          </p>
        </div>

        {/* Action Buttons - Responsive */}
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          {onPreview && (
            <Button
              variant="outline"
              size="sm"
              onClick={onPreview}
              className="flex-1 flex items-center justify-center space-x-2 h-10"
            >
              <Eye className="h-4 w-4" />
              <span className="text-sm">Preview</span>
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={onRemove}
            className="flex-1 flex items-center justify-center space-x-2 h-10 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          >
            <Trash2 className="h-4 w-4" />
            <span className="text-sm">Remove</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilePreview;
