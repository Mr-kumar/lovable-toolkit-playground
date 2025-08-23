import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Scissors, Upload, Zap, Palette, Minimize2, FileText, 
  Merge, Split, Archive, RotateCw, Droplets, Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const tools = [
  {
    id: "remove-bg",
    name: "Remove Background",
    description: "Instantly remove backgrounds from photos with AI precision",
    icon: Scissors,
    category: "Image",
    popular: true
  },
  {
    id: "upscale",
    name: "Upscale Images",
    description: "Enhance image resolution without losing quality",
    icon: Upload,
    category: "Image"
  },
  {
    id: "denoise",
    name: "Denoise Photos",
    description: "Remove noise and grain for crystal-clear images",
    icon: Zap,
    category: "Image"
  },
  {
    id: "colorize",
    name: "Colorize B&W",
    description: "Add realistic colors to black and white photos",
    icon: Palette,
    category: "Image"
  },
  {
    id: "compress-img",
    name: "Compress Images",
    description: "Reduce file size while maintaining visual quality",
    icon: Minimize2,
    category: "Image"
  },
  {
    id: "ocr",
    name: "OCR Text Extract",
    description: "Extract text from images and convert to PDF",
    icon: FileText,
    category: "PDF"
  },
  {
    id: "merge-pdf",
    name: "Merge PDFs",
    description: "Combine multiple PDF files into one document",
    icon: Merge,
    category: "PDF",
    popular: true
  },
  {
    id: "split-pdf",
    name: "Split PDFs",
    description: "Split large PDFs into smaller, manageable files",
    icon: Split,
    category: "PDF"
  },
  {
    id: "compress-pdf",
    name: "Compress PDFs",
    description: "Reduce PDF file size for easier sharing",
    icon: Archive,
    category: "PDF"
  },
  {
    id: "rotate-pdf",
    name: "Rotate Pages",
    description: "Reorder and rotate PDF pages effortlessly",
    icon: RotateCw,
    category: "PDF"
  },
  {
    id: "watermark",
    name: "Add Watermark",
    description: "Protect your documents with custom watermarks",
    icon: Droplets,
    category: "PDF"
  }
];

export const ToolGallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [processingTool, setProcessingTool] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const categories = ["All", "Image", "PDF"];
  
  const filteredTools = selectedCategory === "All" 
    ? tools 
    : tools.filter(tool => tool.category === selectedCategory);

  const handleToolClick = (toolId: string) => {
    setProcessingTool(toolId);
    setProgress(0);
    
    // Simulate processing with realistic progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setProcessingTool(null);
            setProgress(0);
          }, 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  return (
    <section id="tools" className="section-padding bg-section">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Search className="h-4 w-4 mr-2" />
            Tool Gallery
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Perfect Tool
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From PDF magic to image wizardry - we've got the tools to make your files absolutely perfect! ✨
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
          className="flex justify-center mb-12"
        >
          <div className="flex space-x-2 p-2 bg-background rounded-2xl border border-border/50">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "ghost"}
                className={`px-6 py-2 rounded-xl transition-all duration-300 ${
                  selectedCategory === category 
                    ? "bg-primary text-primary-foreground shadow-lg" 
                    : "hover:bg-muted"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Tools Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ 
                  duration: 0.4,
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <Card className="card-tool relative overflow-hidden h-full">
                  {tool.popular && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-primary text-primary-foreground">
                        Popular
                      </Badge>
                    </div>
                  )}
                  
                  <div className="flex flex-col h-full">
                    <div className="flex-1">
                      <div className="mb-4">
                        <div className="p-3 bg-primary/10 rounded-xl w-fit group-hover:bg-primary/20 transition-colors">
                          <tool.icon className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-2">{tool.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>

                    <div className="space-y-3">
                      {processingTool === tool.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2"
                        >
                          <div className="flex justify-between text-sm">
                            <span>Processing...</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </motion.div>
                      )}
                      
                      <Button
                        className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transition-all duration-300"
                        onClick={() => handleToolClick(tool.id)}
                        disabled={processingTool === tool.id}
                      >
                        {processingTool === tool.id ? "Processing..." : "Try Now"}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};