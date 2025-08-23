import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface FilterSectionProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const FilterSection = ({ selectedCategory, onCategoryChange }: FilterSectionProps) => {
  const categories = ["All", "Image", "PDF", "PPT"];

  return (
    <section className="section-padding bg-background border-b border-border/50">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Filter className="h-4 w-4 mr-2" />
            Filter Tools
          </div>
          
          <div className="flex justify-center">
            <div className="flex flex-wrap gap-2 p-2 bg-muted/30 rounded-2xl border border-border/50">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "ghost"}
                  className={`px-6 py-2 rounded-xl transition-all duration-300 ${
                    selectedCategory === category 
                      ? "bg-primary text-primary-foreground shadow-lg" 
                      : "hover:bg-muted"
                  }`}
                  onClick={() => onCategoryChange(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};