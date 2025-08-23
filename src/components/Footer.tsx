import { motion } from "framer-motion";
import { Heart, Mail, Twitter, Github } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = [
    {
      title: "Product",
      items: [
        { name: "All Tools", href: "#tools" },
        { name: "Prompt Studio", href: "#prompt-studio" },
        { name: "How it Works", href: "#how-it-works" },
        { name: "Pricing", href: "#pricing" }
      ]
    },
    {
      title: "Support",
      items: [
        { name: "Help Center", href: "#help" },
        { name: "Contact Us", href: "#contact" },
        { name: "FAQ", href: "#faq" },
        { name: "Status", href: "#status" }
      ]
    },
    {
      title: "Legal",
      items: [
        { name: "Privacy Policy", href: "#privacy" },
        { name: "Terms of Service", href: "#terms" },
        { name: "Cookie Policy", href: "#cookies" },
        { name: "GDPR", href: "#gdpr" }
      ]
    }
  ];

  const socialLinks = [
    { icon: Twitter, href: "#twitter", label: "Twitter" },
    { icon: Github, href: "#github", label: "GitHub" },
    { icon: Mail, href: "#email", label: "Email" }
  ];

  return (
    <footer className="bg-background border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-8 w-8 text-primary fill-current" />
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  Lovable Tools
                </span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
                Making file processing delightful, one tool at a time. 
                Join thousands of creators who've discovered the joy of effortless workflows! ✨
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Link Sections */}
            {links.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="font-semibold text-foreground mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.items.map((item) => (
                    <li key={item.name}>
                      <motion.a
                        href={item.href}
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {item.name}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
          className="py-6 border-t border-border/50"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>© {currentYear} Lovable Tools.</span>
              <span>Made with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Heart className="h-4 w-4 text-primary fill-current" />
              </motion.div>
              <span>for creators everywhere.</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <motion.a
                href="#privacy"
                whileHover={{ scale: 1.05 }}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy
              </motion.a>
              <motion.a
                href="#terms"
                whileHover={{ scale: 1.05 }}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Terms
              </motion.a>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Contact
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};