import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Mail, Lock, Facebook, Chrome } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Login Form */}
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center text-3xl font-bold">
              I<Heart className="w-8 h-8 text-destructive fill-current mx-1" />PDF
            </div>
            <h1 className="text-2xl font-semibold text-foreground">Login to your account</h1>
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
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="text-center">
                <Link to="/forgot-password" className="text-sm text-destructive hover:underline">
                  Forgot your password?
                </Link>
              </div>
              <Button className="w-full bg-destructive hover:bg-destructive/90">
                Log in
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-destructive hover:underline">
                  Create an account
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Promotional Content */}
        <div className="hidden lg:flex flex-col items-center justify-center space-y-6 bg-muted/50 rounded-lg p-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold">Log in to your workspace</h2>
            <p className="text-muted-foreground max-w-md">
              Enter your email and password to access your iLovePDF account. You are one step closer to boosting your document productivity.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
            <div className="aspect-square bg-destructive/10 rounded-lg flex items-center justify-center">
              <div className="text-destructive text-2xl font-bold">PDF</div>
            </div>
            <div className="aspect-square bg-primary/10 rounded-lg flex items-center justify-center">
              <div className="text-primary text-xl">📄</div>
            </div>
            <div className="aspect-square bg-secondary/10 rounded-lg flex items-center justify-center">
              <div className="text-secondary-foreground text-xl">🔧</div>
            </div>
            <div className="aspect-square bg-accent/10 rounded-lg flex items-center justify-center">
              <div className="text-accent-foreground text-xl">⚡</div>
            </div>
          </div>
          <Button variant="outline" className="w-full max-w-xs">
            See all tools ↓
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;