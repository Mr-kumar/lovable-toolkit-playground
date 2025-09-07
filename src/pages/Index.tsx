import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import UploadSection from "@/components/UploadSection";
import ToolSelection from "@/components/ToolSelection";
import { useFileHandler } from "@/hooks/useFileHandler";
import { Toast } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";

// UI States
type UIState = "upload" | "tool-selection";

const Index = () => {
  const [uiState, setUiState] = useState<UIState>("upload");
  const navigate = useNavigate();

  // Use the custom hook for file handling
  const {
    files,
    errors,
    isUploading,
    handleFiles,
    removeFile,
    clearErrors,
    setFiles,
    setErrors,
  } = useFileHandler();

  // Handle file selection and UI state change
  const handleFilesSelected = useCallback(
    async (validFiles: File[]) => {
      if (validFiles.length > 0) {
        // Simulate upload delay for better UX
        await new Promise((resolve) => setTimeout(resolve, 500));

        setFiles((prev) => [...prev, ...validFiles]);
        setUiState("tool-selection");
      }
    },
    [setFiles]
  );

  // Enhanced removeFile that also handles UI state
  const handleRemoveFile = useCallback(
    (index: number) => {
      removeFile(index);
      if (files.length <= 1) {
        setUiState("upload");
      }
    },
    [files.length, removeFile]
  );

  const selectTool = useCallback(
    (toolId: string) => {
      // Require at least one file to proceed to a tool
      if (files.length === 0) {
        clearErrors();
        setTimeout(() => {
          setErrors([
            "Please upload at least one file before selecting a tool.",
          ]);
        }, 10);
        return;
      }

      // Compare requires exactly 2 files -- block if too many
      if (toolId === "compare-pdf" && files.length > 2) {
        clearErrors();
        setTimeout(() => {
          setErrors([
            "Compare PDF requires exactly 2 files. Please remove extra files.",
          ]);
        }, 10);
        return;
      }

      // Store files in sessionStorage to pass to tool page
      // Note: In a production app, consider using React Context or a state management library
      // instead of sessionStorage for better type safety
      const filesData = files.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
      }));

      sessionStorage.setItem("uploadedFiles", JSON.stringify(filesData));
      sessionStorage.setItem("fileCount", files.length.toString());

      // Get file types using the hook's getFileType function if available
      // or use inline logic as before
      sessionStorage.setItem(
        "fileTypes",
        JSON.stringify(
          files.map((f) => {
            const extension = f.name.split(".").pop()?.toLowerCase();
            if (extension === "pdf") return "pdf";
            if (
              ["jpg", "jpeg", "png", "gif", "bmp", "webp", "tiff"].includes(
                extension || ""
              )
            )
              return "image";
            if (["doc", "docx"].includes(extension || "")) return "document";
            if (["ppt", "pptx"].includes(extension || ""))
              return "presentation";
            if (["xls", "xlsx"].includes(extension || "")) return "spreadsheet";
            return "mixed";
          })
        )
      );

      navigate(`/tool/${toolId}?files=${files.length}`);
    },
    [files, clearErrors, navigate, setErrors]
  );

  const resetUpload = useCallback(() => {
    setFiles([]);
    clearErrors();
    setUiState("upload");
  }, [setFiles, clearErrors]);

  // Function to dismiss a specific error by index
  const dismissError = useCallback(
    (index: number) => {
      setErrors((prev) => prev.filter((_, i) => i !== index));
    },
    [setErrors]
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow">
        {uiState === "upload" && (
          <UploadSection
            onFilesSelected={handleFilesSelected}
            isUploading={isUploading}
            errors={errors}
            onDismissError={dismissError}
          />
        )}

        {uiState === "tool-selection" && (
          <ToolSelection
            files={files}
            onRemoveFile={handleRemoveFile}
            onSelectTool={selectTool}
            onReset={resetUpload}
            errors={errors}
            clearErrors={clearErrors}
            onDismissError={dismissError}
          />
        )}
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Index;
