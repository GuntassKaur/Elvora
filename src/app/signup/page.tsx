"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const signupSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
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

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
        },
      },
    });

    if (error) {
      setAuthError(error.message);
      setIsSubmitting(false);
    } else {
      // By default, if email confirmations are off, the user is logged in.
      router.push("/profile");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="text-center">
          <h2 className="text-3xl font-serif text-zinc-900 tracking-wide">Create Account</h2>
          <p className="mt-2 text-sm text-zinc-500 uppercase tracking-widest">
            Join the world of ELVORA
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 border border-zinc-200 shadow-sm sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {authError && (
                <div className="bg-red-50 border border-red-100 p-3 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-red-800 leading-relaxed">{authError}</p>
                </div>
              )}

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-zinc-900 mb-2">
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    {...register("fullName")}
                    type="text"
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
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-zinc-900 mb-2">
                  Email Address
                </label>
                <div className="mt-1">
                  <input
                    {...register("email")}
                    type="email"
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
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-zinc-900 mb-2">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    className="appearance-none block w-full px-4 py-3 border border-zinc-200 bg-[#FAF9F6] text-zinc-900 text-sm placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 focus:outline-none"
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
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center gap-2 bg-black text-white py-3.5 px-4 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Sign Up
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-zinc-500 uppercase tracking-widest">
                    Already have an account?
                  </span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="w-full flex justify-center items-center bg-[#FAF9F6] border border-zinc-200 text-zinc-900 py-3.5 px-4 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-zinc-100 transition-colors"
                >
                  Sign In Instead
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
