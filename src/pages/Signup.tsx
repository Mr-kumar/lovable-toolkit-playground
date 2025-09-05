import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, Mail, Lock, User, Facebook, Chrome } from "lucide-react";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Signup Form */}
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center text-3xl font-bold">
              I<Heart className="w-8 h-8 text-destructive fill-current mx-1" />PDF
            </div>
            <h1 className="text-2xl font-semibold text-foreground">Create your account</h1>
            <p className="text-muted-foreground text-sm">Join thousands of users already using our platform</p>
          </div>

          <Card className="w-full max-w-md">
            <CardHeader className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button variant="outline" className="w-full">
                  <Facebook className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Facebook</span>
                  <span className="sm:hidden">FB</span>
                </Button>
                <Button variant="outline" className="w-full">
                  <Chrome className="w-4 h-4 mr-2" />
                  Google
                </Button>
                <Button variant="outline" className="w-full">
                  <div className="w-4 h-4 mr-2 bg-foreground rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-background rounded-full"></div>
                  </div>
                  SSO
                </Button>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{" "}
                  <Link to="/terms" className="text-destructive hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-destructive hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              <Button className="w-full bg-destructive hover:bg-destructive/90">
                Create Account
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-destructive hover:underline">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Promotional Content */}
        <div className="hidden lg:flex flex-col items-center justify-center space-y-6 bg-muted/50 rounded-lg p-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold">Start your PDF journey</h2>
            <p className="text-muted-foreground max-w-md">
              Create your account to unlock powerful PDF tools and boost your productivity. Join thousands of satisfied users today.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
            <div className="aspect-square bg-destructive/10 rounded-lg flex items-center justify-center">
              <div className="text-destructive text-2xl font-bold">PDF</div>
            </div>
            <div className="aspect-square bg-primary/10 rounded-lg flex items-center justify-center">
              <div className="text-primary text-xl">✨</div>
            </div>
            <div className="aspect-square bg-secondary/10 rounded-lg flex items-center justify-center">
              <div className="text-secondary-foreground text-xl">🚀</div>
            </div>
            <div className="aspect-square bg-accent/10 rounded-lg flex items-center justify-center">
              <div className="text-accent-foreground text-xl">💼</div>
            </div>
          </div>
          <div className="space-y-2 text-center">
            <p className="text-sm text-muted-foreground">✓ Free to start</p>
            <p className="text-sm text-muted-foreground">✓ No credit card required</p>
            <p className="text-sm text-muted-foreground">✓ Access to all basic tools</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;