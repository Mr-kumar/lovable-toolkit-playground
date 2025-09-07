import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import UploadSection from "@/components/UploadSection";
import ToolSelection from "@/components/ToolSelection";

// UI States
type UIState = "upload" | "tool-selection";

const Index = () => {
  const [uiState, setUiState] = useState<UIState>("upload");
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleFilesSelected = async (validFiles: File[]) => {
    setIsUploading(true);
    
    // Simulate upload delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    setFiles((prev) => [...prev, ...validFiles]);
    setUiState("tool-selection");
    setIsUploading(false);
  };

  const clearErrors = () => {
    setErrors([]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (files.length === 1) {
      setUiState("upload");
    }
  };

  const selectTool = (toolId: string) => {
    // Validate tool-specific requirements
    const toolRequirements: Record<string, { minFiles: number; message: string }> = {
      "merge-pdf": {
        minFiles: 2,
        message: "Merge PDF requires at least 2 files",
      },
      "compare-pdf": {
        minFiles: 2,
        message: "Compare PDF requires exactly 2 files",
      },
    };

    const requirement = toolRequirements[toolId];
    if (requirement && files.length < requirement.minFiles) {
      setErrors([requirement.message]);
      return;
    }

    if (toolId === "compare-pdf" && files.length > 2) {
      setErrors([
        "Compare PDF requires exactly 2 files. Please remove extra files.",
      ]);
      return;
    }

    // Store files in sessionStorage to pass to tool page
    const filesData = files.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    }));

    sessionStorage.setItem("uploadedFiles", JSON.stringify(filesData));
    sessionStorage.setItem("fileCount", files.length.toString());
    sessionStorage.setItem(
      "fileTypes",
      JSON.stringify(files.map((f) => {
        const extension = f.name.split(".").pop()?.toLowerCase();
        if (extension === "pdf") return "pdf";
        if (["jpg", "jpeg", "png", "gif", "bmp", "webp", "tiff"].includes(extension || "")) return "image";
        if (["doc", "docx"].includes(extension || "")) return "document";
        if (["ppt", "pptx"].includes(extension || "")) return "presentation";
        if (["xls", "xlsx"].includes(extension || "")) return "spreadsheet";
        return "mixed";
      }))
    );

    navigate(`/tool/${toolId}?files=${files.length}`);
  };

  const resetUpload = () => {
    setFiles([]);
    setUiState("upload");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow">
        {uiState === "upload" ? (
          <UploadSection
            onFilesSelected={handleFilesSelected}
            isUploading={isUploading}
            errors={errors}
            clearErrors={clearErrors}
          />
        ) : (
          <ToolSelection
            files={files}
            onRemoveFile={removeFile}
            onSelectTool={selectTool}
            onReset={resetUpload}
            errors={errors}
            clearErrors={clearErrors}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
