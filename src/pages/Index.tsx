import { useState } from "react";
import { motion } from "framer-motion";
import { HeroSection } from "@/components/HeroSection";
import { SearchSection } from "@/components/SearchSection";
import { FilterSection } from "@/components/FilterSection";
import { PromptStudio } from "@/components/PromptStudio";
import { ToolGallery } from "@/components/ToolGallery";
import { HowItWorks } from "@/components/HowItWorks";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FilterSection 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <ToolGallery selectedCategory={selectedCategory} />
        <HeroSection />
        <SearchSection />
        <PromptStudio />
        <HowItWorks />
        <FAQ />
      </motion.main>
      
      <Footer />
    </div>
  );
};

export default Index;