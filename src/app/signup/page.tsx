"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type SignupFormData = z.infer<typeof signupSchema>;

// Map Supabase error messages to user-friendly equivalents
function mapAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("user already registered") || lower.includes("already been registered")) {
    return "An account with this email already exists. Please sign in instead.";
  }
  if (lower.includes("invalid email")) {
    return "Please enter a valid email address.";
  }
  if (lower.includes("password")) {
    return "Password must be at least 6 characters.";
  }
  if (lower.includes("rate limit") || lower.includes("too many")) {
    return "Too many attempts. Please wait a moment and try again.";
  }
  if (lower.includes("network") || lower.includes("fetch")) {
    return "Network error. Please check your connection and try again.";
  }
  // Return the real Supabase error message as-is for all other cases
  return message;
}

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);
    setAuthError("");
    setSuccessMessage("");

    const normalizedEmail = data.email.trim().toLowerCase();

    const { data: signupData, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName.trim(),
        },
      },
    });

    if (error) {
      setAuthError(mapAuthError(error.message));
      setIsSubmitting(false);
      return;
    }

    router.push("/");
    return;
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-6">
            <span className="font-serif text-2xl tracking-[0.45em] uppercase text-[#0a0a0a]">
              ELVORA
            </span>
          </Link>
          <h1 className="text-3xl font-serif text-zinc-900 tracking-wide">Create Account</h1>
          <p className="mt-2 text-sm text-zinc-500 uppercase tracking-widest">
            Join the world of ELVORA
          </p>
        </div>

        <div className="bg-white py-8 px-6 border border-zinc-200 shadow-sm sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Error message */}
            {authError && (
              <div className="bg-red-50 border border-red-100 p-4 flex items-start gap-3 rounded-sm">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-red-800 leading-relaxed">{authError}</p>
              </div>
            )}

            {/* Success message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 p-4 flex items-start gap-3 rounded-sm">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-green-800 leading-relaxed">{successMessage}</p>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-zinc-900 mb-2">
                Full Name
              </label>
              <input
                {...register("fullName")}
                type="text"
                autoComplete="name"
                className="appearance-none block w-full px-4 py-3 border border-zinc-200 bg-[#FAF9F6] text-zinc-900 text-sm placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
                placeholder="Jane Doe"
              />
              {errors.fullName && (
                <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-zinc-900 mb-2">
                Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                autoComplete="email"
                className="appearance-none block w-full px-4 py-3 border border-zinc-200 bg-[#FAF9F6] text-zinc-900 text-sm placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-zinc-900 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className="appearance-none block w-full px-4 py-3 border border-zinc-200 bg-[#FAF9F6] text-zinc-900 text-sm placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password.message}
                </p>
              )}
              <p className="mt-1.5 text-[10px] text-zinc-400">Minimum 6 characters.</p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || !!successMessage}
              className="w-full flex justify-center items-center gap-2 bg-black text-white py-3.5 px-4 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-zinc-100 text-center">
            <p className="text-xs text-zinc-500">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-zinc-900 underline underline-offset-2 hover:text-zinc-600 transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
