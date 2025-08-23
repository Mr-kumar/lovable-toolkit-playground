import { motion } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";

const faqs = [
  {
    question: "Are my files safe and secure?",
    answer: "Absolutely! We take your privacy seriously. All files are processed securely and automatically deleted after 1 hour. We never store or share your personal files. Your data stays yours! 🔒"
  },
  {
    question: "What file formats do you support?",
    answer: "We support all major formats! For images: JPG, PNG, GIF, WebP, TIFF, and more. For PDFs: any standard PDF document. We're constantly adding new formats based on user feedback. If you need a specific format, just let us know! 📁"
  },
  {
    question: "Is there a file size limit?",
    answer: "For the best experience, we recommend files under 50MB per upload. Need to process larger files? Our premium plans offer increased limits up to 500MB per file. We're here to handle whatever you throw at us! 💪"
  },
  {
    question: "Do I need to create an account?",
    answer: "Not at all! You can use most of our tools without signing up. Creating a free account gives you access to processing history, batch operations, and priority support. But we believe great tools should be accessible to everyone! ✨"
  }
];

export const FAQ = () => {
  const [openItems, setOpenItems] = useState<number[]>([0]); // First item open by default

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section id="faq" className="section-padding bg-section">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <HelpCircle className="h-4 w-4 mr-2" />
            FAQ
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Questions?{" "}
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              We've Got Answers
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about our lovable tools and how they work! 💡
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="card-elevated overflow-hidden">
                <motion.button
                  className="w-full p-6 text-left focus:outline-none"
                  onClick={() => toggleItem(index)}
                  whileHover={{ backgroundColor: "hsl(var(--muted))" }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg md:text-xl font-semibold pr-4">
                      {faq.question}
                    </h3>
                    <motion.div
                      animate={{ rotate: openItems.includes(index) ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="flex-shrink-0"
                    >
                      {openItems.includes(index) ? (
                        <Minus className="h-6 w-6 text-primary" />
                      ) : (
                        <Plus className="h-6 w-6 text-muted-foreground" />
                      )}
                    </motion.div>
                  </div>
                </motion.button>

                <motion.div
                  initial={false}
                  animate={{
                    height: openItems.includes(index) ? "auto" : 0,
                    opacity: openItems.includes(index) ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6">
                    <div className="h-px bg-border mb-4" />
                    <motion.p
                      initial={{ y: -10 }}
                      animate={{ y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-muted-foreground leading-relaxed"
                    >
                      {faq.answer}
                    </motion.p>
                  </div>
                </motion.div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">
            Still have questions? We'd love to help! 💬
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-hero-outline"
          >
            Contact Support
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};