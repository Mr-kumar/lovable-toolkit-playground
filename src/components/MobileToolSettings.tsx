import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Settings, FileText, Lock, RotateCw, Scissors, Download, Image, Merge } from 'lucide-react';

interface ToolSettings {
  compressionLevel: string;
  imageQuality: number;
  targetFileSize?: number;
  dpi?: number;
  colorMode?: string;
  password?: string;
  confirmPassword?: string;
  permissions?: string[];
  mergeOrder?: string;
  pageRange?: string;
  splitMethod?: string;
  pagesPerFile?: number;
  watermarkText?: string;
  watermarkPosition?: string;
  watermarkOpacity?: number;
  watermarkSize?: number;
  rotationAngle?: number;
  pageSelection?: string;
  outputFormat?: string;
  conversionQuality?: string;
  pageSize?: string;
  orientation?: string;
}

interface MobileToolSettingsProps {
  toolId: string;
  settings: ToolSettings;
  onSettingsChange: (key: string, value: string | number | string[] | undefined) => void;
}

export const MobileToolSettings: React.FC<MobileToolSettingsProps> = ({
  toolId,
  settings,
  onSettingsChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const renderCompressionSettings = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Compression Level
        </label>
        <select
          value={settings.compressionLevel}
          onChange={(e) => onSettingsChange('compressionLevel', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
          aria-label="Compression Level"
        >
          <option value="low">Low Compression (Better Quality)</option>
          <option value="medium">Medium Compression (Balanced)</option>
          <option value="high">High Compression (Smaller Size)</option>
          <option value="extreme">Extreme Compression (Minimum Size)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Target File Size (MB)
        </label>
        <input
          type="number"
          min="0.1"
          max="100"
          step="0.1"
          value={settings.targetFileSize || ''}
          onChange={(e) => onSettingsChange('targetFileSize', Number(e.target.value))}
          placeholder="Auto (leave empty)"
          className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
          aria-label="Target File Size in MB"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image Quality ({settings.imageQuality}%)
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="range"
            min="10"
            max="100"
            value={settings.imageQuality}
            onChange={(e) => onSettingsChange('imageQuality', Number(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            aria-label="Image Quality Percentage"
          />
          <span className="text-sm font-medium text-gray-600 min-w-[3rem]">
            {settings.imageQuality}%
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          DPI (Dots Per Inch)
        </label>
        <select
          value={settings.dpi || 150}
          onChange={(e) => onSettingsChange('dpi', Number(e.target.value))}
          className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
          aria-label="DPI (Dots Per Inch)"
        >
          <option value={72}>72 DPI (Web)</option>
          <option value={150}>150 DPI (Standard)</option>
          <option value={300}>300 DPI (Print Quality)</option>
          <option value={600}>600 DPI (High Quality)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Color Mode
        </label>
        <select
          value={settings.colorMode || 'no-change'}
          onChange={(e) => onSettingsChange('colorMode', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
          aria-label="Color Mode"
        >
          <option value="no-change">No Change</option>
          <option value="grayscale">Convert to Grayscale</option>
          <option value="monochrome">Convert to Monochrome</option>
        </select>
      </div>
    </div>
  );

  const renderMergeSettings = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Merge Order
        </label>
        <select
          value={settings.mergeOrder || 'upload-order'}
          onChange={(e) => onSettingsChange('mergeOrder', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
          aria-label="Merge Order"
        >
          <option value="upload-order">Upload Order</option>
          <option value="alphabetical">Alphabetical</option>
          <option value="size-ascending">Size (Small to Large)</option>
          <option value="size-descending">Size (Large to Small)</option>
          <option value="custom">Custom Order</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Page Range (Optional)
        </label>
        <input
          type="text"
          value={settings.pageRange || ''}
          onChange={(e) => onSettingsChange('pageRange', e.target.value)}
          placeholder="e.g., 1-5, 10, 15-20"
          className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
          aria-label="Page Range"
        />
        <p className="text-xs text-gray-500 mt-1">Leave empty to merge all pages</p>
      </div>
    </div>
  );

  const renderSplitSettings = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Split Method
        </label>
        <select
          value={settings.splitMethod || 'pages'}
          onChange={(e) => onSettingsChange('splitMethod', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
          aria-label="Split Method"
        >
          <option value="pages">Split by Pages</option>
          <option value="size">Split by File Size</option>
          <option value="bookmarks">Split by Bookmarks</option>
          <option value="ranges">Split by Page Ranges</option>
        </select>
      </div>

      {settings.splitMethod === 'pages' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pages per File
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={settings.pagesPerFile || 1}
            onChange={(e) => onSettingsChange('pagesPerFile', Number(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
            aria-label="Pages per File"
          />
        </div>
      )}
    </div>
  );

  const renderPasswordSettings = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <input
          type="password"
          value={settings.password || ''}
          onChange={(e) => onSettingsChange('password', e.target.value)}
          placeholder="Enter password"
          className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
          aria-label="Password"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password
        </label>
        <input
          type="password"
          value={settings.confirmPassword || ''}
          onChange={(e) => onSettingsChange('confirmPassword', e.target.value)}
          placeholder="Confirm password"
          className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
          aria-label="Confirm Password"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Permissions
        </label>
        <div className="space-y-2">
          {['printing', 'copying', 'editing', 'commenting'].map((permission) => (
            <label key={permission} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.permissions?.includes(permission) || false}
                onChange={(e) => {
                  const current = settings.permissions || [];
                  const updated = e.target.checked
                    ? [...current, permission]
                    : current.filter(p => p !== permission);
                  onSettingsChange('permissions', updated);
                }}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700 capitalize">{permission}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWatermarkSettings = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Watermark Text
        </label>
        <input
          type="text"
          value={settings.watermarkText || ''}
          onChange={(e) => onSettingsChange('watermarkText', e.target.value)}
          placeholder="Enter watermark text"
          className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
          aria-label="Watermark Text"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Position
        </label>
        <select
          value={settings.watermarkPosition || 'center'}
          onChange={(e) => onSettingsChange('watermarkPosition', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
          aria-label="Watermark Position"
        >
          <option value="center">Center</option>
          <option value="top-left">Top Left</option>
          <option value="top-right">Top Right</option>
          <option value="bottom-left">Bottom Left</option>
          <option value="bottom-right">Bottom Right</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Opacity ({settings.watermarkOpacity || 50}%)
        </label>
        <input
          type="range"
          min="10"
          max="100"
          value={settings.watermarkOpacity || 50}
          onChange={(e) => onSettingsChange('watermarkOpacity', Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          aria-label="Watermark Opacity Percentage"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Size ({settings.watermarkSize || 24}px)
        </label>
        <input
          type="range"
          min="12"
          max="72"
          value={settings.watermarkSize || 24}
          onChange={(e) => onSettingsChange('watermarkSize', Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          aria-label="Watermark Size in Pixels"
        />
      </div>
    </div>
  );

  const renderRotationSettings = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rotation Angle
        </label>
        <select
          value={settings.rotationAngle || 90}
          onChange={(e) => onSettingsChange('rotationAngle', Number(e.target.value))}
          className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
          aria-label="Rotation Angle"
        >
          <option value={90}>90° Clockwise</option>
          <option value={180}>180° (Upside Down)</option>
          <option value={270}>270° (90° Counter-clockwise)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Page Selection
        </label>
        <select
          value={settings.pageSelection || 'all'}
          onChange={(e) => onSettingsChange('pageSelection', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
          aria-label="Page Selection"
        >
          <option value="all">All Pages</option>
          <option value="odd">Odd Pages Only</option>
          <option value="even">Even Pages Only</option>
          <option value="custom">Custom Range</option>
        </select>
      </div>
    </div>
  );

  const renderConversionSettings = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Output Format
        </label>
        <select
          value={settings.outputFormat || 'docx'}
          onChange={(e) => onSettingsChange('outputFormat', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
          aria-label="Output Format"
        >
          <option value="docx">DOCX (Word 2007+)</option>
          <option value="doc">DOC (Word 97-2003)</option>
          <option value="rtf">RTF (Rich Text)</option>
          <option value="txt">Plain Text</option>
          <option value="jpg">JPG Image</option>
          <option value="png">PNG Image</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Conversion Quality
        </label>
        <select
          value={settings.conversionQuality || 'high'}
          onChange={(e) => onSettingsChange('conversionQuality', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
          aria-label="Conversion Quality"
        >
          <option value="high">High Quality</option>
          <option value="medium">Medium Quality</option>
          <option value="low">Low Quality (Faster)</option>
        </select>
      </div>

      {(settings.outputFormat === 'jpg' || settings.outputFormat === 'png') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Page Size
          </label>
          <select
            value={settings.pageSize || 'a4'}
            onChange={(e) => onSettingsChange('pageSize', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
            aria-label="Page Size"
          >
            <option value="a4">A4</option>
            <option value="letter">Letter</option>
            <option value="legal">Legal</option>
            <option value="a3">A3</option>
          </select>
        </div>
      )}
    </div>
  );

  const renderDefaultSettings = () => (
    <div className="text-center py-6">
      <Settings className="h-12 w-12 mx-auto mb-3 text-gray-400" />
      <p className="text-gray-600">No additional settings required for this tool.</p>
      <p className="text-gray-500 text-sm mt-1">Ready to process your files.</p>
    </div>
  );

  const getSettingsContent = () => {
    switch (toolId) {
      case 'compress-pdf':
        return renderCompressionSettings();
      case 'merge-pdf':
        return renderMergeSettings();
      case 'split-pdf':
        return renderSplitSettings();
      case 'protect-pdf':
        return renderPasswordSettings();
      case 'unlock-pdf':
        return renderPasswordSettings();
      case 'watermark':
        return renderWatermarkSettings();
      case 'rotate-pdf':
        return renderRotationSettings();
      case 'pdf-to-word':
      case 'pdf-to-jpg':
      case 'word-to-pdf':
      case 'jpg-to-pdf':
        return renderConversionSettings();
      default:
        return renderDefaultSettings();
    }
  };

  const getToolIcon = () => {
    switch (toolId) {
      case 'compress-pdf': return <Download className="h-5 w-5 text-gray-600" />;
      case 'merge-pdf': return <Merge className="h-5 w-5 text-gray-600" />;
      case 'split-pdf': return <Scissors className="h-5 w-5 text-gray-600" />;
      case 'protect-pdf': return <Lock className="h-5 w-5 text-gray-600" />;
      case 'unlock-pdf': return <Lock className="h-5 w-5 text-gray-600" />;
      case 'watermark': return <Image className="h-5 w-5 text-gray-600" />;
      case 'rotate-pdf': return <RotateCw className="h-5 w-5 text-gray-600" />;
      case 'pdf-to-word':
      case 'pdf-to-jpg':
      case 'word-to-pdf':
      case 'jpg-to-pdf': return <FileText className="h-5 w-5 text-gray-600" />;
      default: return <Settings className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center space-x-2">
          {getToolIcon()}
          <span className="font-medium text-gray-900">Tool Settings</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-600" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-600" />
        )}
      </button>
      
      {isExpanded && (
        <div className="p-4">
          {getSettingsContent()}
        </div>
      )}
    </div>
  );
};
