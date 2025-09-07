import React from 'react';
import { FileText, Image, File, Presentation, FileSpreadsheet, X, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileFilePreviewProps {
  file: File;
  onRemove: () => void;
  onPreview?: () => void;
}

export const MobileFilePreview: React.FC<MobileFilePreviewProps> = ({
  file,
  onRemove,
  onPreview,
}) => {
  const getFileIcon = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') return FileText;
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff'].includes(extension || ''))
      return Image;
    if (['doc', 'docx'].includes(extension || '')) return FileText;
    if (['ppt', 'pptx'].includes(extension || '')) return Presentation;
    if (['xls', 'xlsx'].includes(extension || '')) return FileSpreadsheet;
    return File;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const FileIcon = getFileIcon(file);

  return (
    <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-4 sm:p-6">
      {/* Mobile-optimized file preview */}
      <div className="flex flex-col items-center space-y-4">
        {/* File Icon and Preview */}
        <div className="relative">
          <div className="w-20 h-24 sm:w-24 sm:h-28 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
            <FileIcon className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
          </div>
          
          {/* File type badge */}
          <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            {file.name.split('.').pop()?.toUpperCase()}
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

        {/* Mobile Action Buttons */}
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

export default MobileFilePreview;
