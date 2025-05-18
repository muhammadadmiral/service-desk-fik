"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Tab } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { loginWithEmail, loginWithNIM } from "@/lib/auth";

// Form validation schemas
const emailLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const nimLoginSchema = z.object({
  nim: z.string().min(8, "Please enter a valid NIM"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type EmailLoginValues = z.infer<typeof emailLoginSchema>;
type NIMLoginValues = z.infer<typeof nimLoginSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  
  // Get callbackUrl from query parameters
  const callbackUrl = searchParams?.get("callbackUrl") || "/";
  
  // Email login form
  const emailForm = useForm<EmailLoginValues>({
    resolver: zodResolver(emailLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  // NIM login form
  const nimForm = useForm<NIMLoginValues>({
    resolver: zodResolver(nimLoginSchema),
    defaultValues: {
      nim: "",
      password: "",
    },
  });
  
  // Handle email login
  const onEmailSubmit = async (values: EmailLoginValues) => {
    setIsLoading(true);
    
    try {
      const response = await loginWithEmail(values.email, values.password);
      
      // Save token and user to localStorage
      localStorage.setItem("auth_token", response.access_token);
      localStorage.setItem("auth_user", JSON.stringify(response.user));
      
      toast({
        title: "Login successful",
        variant: "success",
      });
      
      // Redirect based on user role
      const role = response.user.role;
      router.push(callbackUrl !== "/" ? callbackUrl : `/${role}/dashboard`);
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle NIM login
  const onNIMSubmit = async (values: NIMLoginValues) => {
    setIsLoading(true);
    
    try {
      const response = await loginWithNIM(values.nim, values.password);
      
      // Save token and user to localStorage
      localStorage.setItem("auth_token", response.access_token);
      localStorage.setItem("auth_user", JSON.stringify(response.user));
      
      toast({
        title: "Login successful",
        variant: "success",
      });
      
      // Redirect based on user role
      const role = response.user.role;
      router.push(callbackUrl !== "/" ? callbackUrl : `/${role}/dashboard`);
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md space-y-6 p-6 bg-background rounded-lg shadow-md"
    >
      <div className="text-center">
        <h1 className="text-2xl font-bold">Welcome Back</h1>
        <p className="text-muted-foreground mt-2">
          Login to your Service Desk FIK account
        </p>
      </div>
      
      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <Tab.List className="flex space-x-1 rounded-xl bg-muted p-1">
          <Tab
            className={({ selected }) =>
              cn(
                "w-full rounded-lg py-2.5 text-sm font-medium transition-all",
                "focus:outline-none focus:ring-2 focus:ring-primary/50",
                selected
                  ? "bg-primary text-white shadow"
                  : "text-muted-foreground hover:bg-muted-foreground/20"
              )
            }
          >
            Email Login
          </Tab>
          <Tab
            className={({ selected }) =>
              cn(
                "w-full rounded-lg py-2.5 text-sm font-medium transition-all",
                "focus:outline-none focus:ring-2 focus:ring-primary/50",
                selected
                  ? "bg-primary text-white shadow"
                  : "text-muted-foreground hover:bg-muted-foreground/20"
              )
            }
          >
            NIM Login
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-4">
          <Tab.Panel>
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-foreground"
                >
                  Email
                </label>
                <Input
                  id="email"
                  placeholder="your@email.com"
                  type="email"
                  autoComplete="email"
                  disabled={isLoading}
                  {...emailForm.register("email")}
                  error={emailForm.formState.errors.email?.message}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label 
                    htmlFor="email-password" 
                    className="block text-sm font-medium text-foreground"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="email-password"
                  type="password"
                  autoComplete="current-password"
                  disabled={isLoading}
                  {...emailForm.register("password")}
                  error={emailForm.formState.errors.password?.message}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
              >
                Sign in with Email
              </Button>
            </form>
          </Tab.Panel>
          <Tab.Panel>
            <form onSubmit={nimForm.handleSubmit(onNIMSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label 
                  htmlFor="nim" 
                  className="block text-sm font-medium text-foreground"
                >
                  NIM / NIP
                </label>
                <Input
                  id="nim"
                  placeholder="21105101001"
                  disabled={isLoading}
                  {...nimForm.register("nim")}
                  error={nimForm.formState.errors.nim?.message}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label 
                    htmlFor="nim-password" 
                    className="block text-sm font-medium text-foreground"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="nim-password"
                  type="password"
                  autoComplete="current-password"
                  disabled={isLoading}
                  {...nimForm.register("password")}
                  error={nimForm.formState.errors.password?.message}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
              >
                Sign in with NIM
              </Button>
            </form>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      
      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          Don&apos;t have an account?{" "}
          <a href="/register" className="font-medium text-primary hover:underline">
            Register here
          </a>
        </p>
      </div>
    </motion.div>
  );
}