import { motion } from "framer-motion";
import { Upload, Wrench, Heart, Download, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload",
    description: "Simply drag and drop your files or click to browse. We support all major formats!",
    color: "text-blue-500",
    bgColor: "bg-blue-50"
  },
  {
    icon: Wrench,
    title: "Pick a Tool",
    description: "Choose from our curated collection of PDF and image tools. Each one is designed for perfection.",
    color: "text-green-500",
    bgColor: "bg-green-50"
  },
  {
    icon: Heart,
    title: "Make it Lovable",
    description: "Our AI-powered tools work their magic with care and attention to every detail.",
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    icon: Download,
    title: "Download",
    description: "Get your beautifully processed files instantly. Share them with pride!",
    color: "text-purple-500",
    bgColor: "bg-purple-50"
  }
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="section-padding bg-background">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Heart className="h-4 w-4 mr-2" />
            How It Works
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Simple Steps to{" "}
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Perfect Results
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We've made file processing as easy as 1-2-3-4. No complicated settings, 
            no confusing interfaces - just beautiful results every time! ✨
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-300 via-green-300 to-purple-300 transform -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                viewport={{ once: true }}
                className="relative"
              >
                <motion.div
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="card-elevated p-8 text-center h-full"
                >
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-background border-4 border-primary/20 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                  </div>

                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`mx-auto mb-6 p-4 rounded-2xl w-fit ${step.bgColor}`}
                  >
                    <step.icon className={`h-8 w-8 ${step.color}`} />
                  </motion.div>

                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>

                  {/* Arrow for desktop */}
                  {index < steps.length - 1 && (
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-muted-foreground"
                    >
                      <ArrowRight className="h-6 w-6" />
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="p-8 bg-gradient-to-r from-primary/5 to-primary-glow/5 rounded-3xl border border-primary/20">
            <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of happy users who've discovered the joy of effortless file processing! 💖
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-hero"
            >
              Try Your First Tool
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};