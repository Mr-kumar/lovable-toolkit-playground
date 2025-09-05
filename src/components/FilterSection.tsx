import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface FilterSectionProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const FilterSection = ({
  selectedCategory,
  onCategoryChange,
}: FilterSectionProps) => {
  const categories = [
    "All",
    "Workflows",
    "Organize PDF",
    "Optimize PDF",
    "Convert PDF",
    "Edit PDF",
    "PDF Security",
  ];

  return (
    <section className="py-6 sm:py-8 bg-white border-b border-gray-200">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex justify-center">
            <div className="flex flex-wrap gap-2 p-2 bg-gray-100 rounded-2xl max-w-full overflow-x-auto">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "ghost"}
                  className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 font-medium text-xs sm:text-sm whitespace-nowrap ${
                    selectedCategory === category
                      ? "bg-gray-900 text-white shadow-lg"
                      : "hover:bg-gray-200 text-gray-700"
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
