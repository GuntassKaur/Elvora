"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { ArrowUpRight, Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginFormData = z.infer<typeof loginSchema>;

// Map Supabase error messages to user-friendly equivalents
function mapAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("invalid login credentials") || lower.includes("invalid credentials")) {
    return "Incorrect email or password. Please try again.";
  }
  if (lower.includes("email not confirmed")) {
    return "Please verify your email address before signing in. Check your inbox for a confirmation link.";
  }
  if (lower.includes("user not found") || lower.includes("no user found")) {
    return "No account found with this email. Please sign up first.";
  }
  if (lower.includes("rate limit") || lower.includes("too many")) {
    return "Too many login attempts. Please wait a moment and try again.";
  }
  if (lower.includes("network") || lower.includes("fetch")) {
    return "Network error. Please check your connection and try again.";
  }
  // Show the real Supabase error for all other cases
  return message;
}

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setAuthError("");

    const normalizedEmail = data.email.trim().toLowerCase();

    const { error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password: data.password,
    });

    if (error) {
      setAuthError(mapAuthError(error.message));
      setIsSubmitting(false);
    } else {
      router.push("/profile");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] grid grid-cols-1 lg:grid-cols-2">
      {/* Left: Editorial Image */}
      <div className="hidden lg:block relative overflow-hidden">
        <Image
          src="https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="ELVORA Login"
          fill
          priority
          className="object-cover object-[center_30%]"
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-12 left-12 right-12">
          <p className="font-serif text-4xl text-white leading-tight italic font-light">
            &ldquo;Wear Confidence.&rdquo;
          </p>
          <p className="text-[9px] uppercase tracking-[0.4em] font-bold text-white/50 mt-4">
            — ELVORA
          </p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex flex-col justify-center items-center px-6 sm:px-12 lg:px-16 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm"
        >
          {/* Logo */}
          <Link href="/" className="block mb-10">
            <span className="font-serif text-2xl tracking-[0.45em] uppercase text-[#0a0a0a]">
              ELVORA
            </span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-4xl sm:text-5xl text-[#0a0a0a] leading-tight">
              Welcome Back.
            </h1>
            <p className="text-[9px] uppercase tracking-[0.3em] font-semibold text-zinc-400 mt-4">
              Sign in to your ELVORA account
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Error Banner */}
            {authError && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-sm">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-red-700 leading-relaxed">{authError}</p>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-[9px] uppercase tracking-[0.3em] font-bold text-zinc-500">
                Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                autoComplete="email"
                className="w-full bg-transparent border-b border-zinc-300 py-3 text-sm text-[#0a0a0a] placeholder:text-zinc-300 focus:outline-none focus:border-[#0a0a0a] transition-colors"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-[10px] text-red-500 flex items-center gap-1.5">
                  <AlertCircle className="w-3 h-3" />{errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-[9px] uppercase tracking-[0.3em] font-bold text-zinc-500">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="w-full bg-transparent border-b border-zinc-300 py-3 text-sm text-[#0a0a0a] placeholder:text-zinc-300 focus:outline-none focus:border-[#0a0a0a] transition-colors pr-8"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-3 text-zinc-400 hover:text-zinc-700 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[10px] text-red-500 flex items-center gap-1.5">
                  <AlertCircle className="w-3 h-3" />{errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#0a0a0a] text-[#faf9f6] py-4 flex justify-center items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Signing In...</>
                ) : (
                  <>Sign In <ArrowUpRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="my-7 flex items-center gap-4">
            <div className="flex-1 h-[1px] bg-zinc-200" />
            <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-400 font-medium">Or</span>
            <div className="flex-1 h-[1px] bg-zinc-200" />
          </div>

          {/* Sign Up Link */}
          <Link
            href="/signup"
            className="w-full border border-zinc-300 py-4 flex justify-center items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[#0a0a0a] hover:border-[#0a0a0a] hover:bg-zinc-50 transition-colors"
          >
            Create an Account
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
