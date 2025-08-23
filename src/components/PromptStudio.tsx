import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Smile, Target, Copy, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const tones = [
  {
    id: "lovable",
    name: "Lovable",
    icon: Heart,
    emoji: "💖",
    description: "Warm, caring, and delightful",
    color: "text-primary"
  },
  {
    id: "friendly",
    name: "Friendly",
    icon: Smile,
    emoji: "😊",
    description: "Approachable and conversational",
    color: "text-blue-500"
  },
  {
    id: "professional",
    name: "Professional",
    icon: Target,
    emoji: "🎯",
    description: "Clear, direct, and efficient",
    color: "text-slate-600"
  }
];

const promptTemplates = {
  lovable: "Please help me {task} with lots of care and attention to detail. I'd love it to be absolutely perfect and beautiful! 💖",
  friendly: "Hey there! Could you help me {task}? I'd really appreciate your assistance! 😊",
  professional: "Please {task} efficiently and accurately. Ensure high-quality results."
};

export const PromptStudio = () => {
  const [selectedTone, setSelectedTone] = useState("lovable");
  const [customPrompt, setCustomPrompt] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const { toast } = useToast();

  const generatePrompt = () => {
    const task = customPrompt || "process my files";
    const template = promptTemplates[selectedTone as keyof typeof promptTemplates];
    const result = template.replace("{task}", task);
    setGeneratedPrompt(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    toast({
      title: "Copied to clipboard! 📋",
      description: "Your lovable prompt is ready to use anywhere.",
    });
  };

  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Sparkles className="h-4 w-4 mr-2" />
            Prompt Studio
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Generate{" "}
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Lovable
            </span>{" "}
            AI Prompts
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform your AI interactions with prompts that have personality. Choose your tone and 
            let us craft the perfect prompt for any tool! ✨
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-semibold mb-6">Choose Your Tone</h3>
              <div className="grid gap-4">
                {tones.map((tone, index) => (
                  <motion.div
                    key={tone.id}
                    initial={{ x: -30, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    viewport={{ once: true }}
                    className={`card-elevated p-6 cursor-pointer transition-all duration-300 ${
                      selectedTone === tone.id ? 'ring-2 ring-primary border-primary/50' : ''
                    }`}
                    onClick={() => setSelectedTone(tone.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full bg-background ${tone.color}`}>
                        <tone.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="text-lg font-semibold">{tone.name}</h4>
                          <span className="text-2xl">{tone.emoji}</span>
                        </div>
                        <p className="text-muted-foreground">{tone.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4">Describe Your Task</h3>
              <Textarea
                placeholder="What do you want the AI to help you with? (e.g., 'compress my images', 'merge these PDFs')"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>

            <Button 
              onClick={generatePrompt}
              className="btn-hero w-full"
              disabled={!customPrompt.trim()}
            >
              Generate Lovable Prompt ✨
            </Button>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-semibold">Your Generated Prompt</h3>
                {generatedPrompt && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="flex items-center space-x-2"
                  >
                    <Copy className="h-4 w-4" />
                    <span>Copy</span>
                  </Button>
                )}
              </div>
              
              <div className="card-elevated p-6 min-h-[200px] flex items-center justify-center">
                {generatedPrompt ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    <div className="flex items-center space-x-2 mb-4">
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {tones.find(t => t.id === selectedTone)?.name} Tone
                      </Badge>
                    </div>
                    <p className="text-lg leading-relaxed">{generatedPrompt}</p>
                  </motion.div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Your beautiful prompt will appear here! ✨</p>
                    <p className="text-sm mt-2">Choose a tone and describe your task to get started.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};