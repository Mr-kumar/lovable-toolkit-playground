import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toolsData, workflowTemplates, getToolsByCategory } from "@/data/toolsData";

interface ToolGalleryProps {
  selectedCategory: string;
}

export const ToolGallery = ({ selectedCategory }: ToolGalleryProps) => {
  const [processingTool, setProcessingTool] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const filteredTools = getToolsByCategory(selectedCategory);

  const handleToolClick = (tool: any) => {
    if (tool.isWorkflow) {
      // Handle workflow creation
      console.log("Creating workflow...");
      return;
    }
    navigate(`/${tool.id}`);
  };

  return (
    <section id="tools" className="py-8 sm:py-12 bg-white">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Tools Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
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
                  stiffness: 100,
                }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <Card className="relative overflow-hidden h-full border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300">
                  {(tool.popular || tool.new) && (
                    <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
                      <Badge
                        className={`text-xs px-2 py-1 ${
                          tool.new
                            ? "bg-orange-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {tool.new ? "New!" : "Popular"}
                      </Badge>
                    </div>
                  )}

                  <div className="flex flex-col h-full p-4 sm:p-6">
                    <div className="flex-1">
                      <div className="mb-3 sm:mb-4">
                        <div className={`p-2 sm:p-3 rounded-lg w-fit group-hover:bg-gray-200 transition-colors ${
                          tool.isWorkflow ? "bg-orange-200" : "bg-gray-100"
                        }`}>
                          <tool.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${
                            tool.isWorkflow ? "text-orange-600" : "text-gray-700"
                          }`} />
                        </div>
                      </div>

                      <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900">
                        {tool.name}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm mb-4 leading-relaxed">
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
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span>Processing...</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </motion.div>
                      )}

                      <Button
                        className={`w-full transition-all duration-300 text-xs sm:text-sm py-2 ${
                          tool.isWorkflow 
                            ? "bg-orange-500 hover:bg-orange-600 text-white" 
                            : "bg-red-500 hover:bg-red-600 text-white"
                        }`}
                        onClick={() => handleToolClick(tool)}
                      >
                        {tool.isWorkflow ? "Create workflow" : "Try Now"}
                        {tool.isWorkflow && <Plus className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Full page now handles interfaces via routes */}
    </section>
  );
};
