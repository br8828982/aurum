// src/app/(auth)/register/page.tsx
"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { RegisterInput } from "@/lib/validations";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterInput>();
  const password = watch("password");

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "Registration failed"); setLoading(false); return; }

      await signIn("credentials", { email: data.email, password: data.password, redirect: false });
      router.push("/");
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="font-serif text-3xl font-light mb-1">Create Account</h1>
      <p className="text-stone-500 text-sm mb-8">Join AURUM and discover beautiful jewellery</p>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 text-red-600 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="Priya Sharma"
          error={errors.name?.message}
          {...register("name", { required: "Name is required", minLength: { value: 2, message: "Min 2 chars" } })}
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email", { required: "Email is required" })}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Min 6 characters"
          error={errors.password?.message}
          {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })}
        />
        <Input
          label="Confirm Password"
          type="password"
          placeholder="Repeat password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (v) => v === password || "Passwords do not match",
          })}
        />
        <Button type="submit" className="w-full" loading={loading}>Create Account</Button>
      </form>

      <div className="mt-6 pt-6 border-t border-stone-100">
        <p className="text-sm text-stone-500 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-stone-900 font-medium hover:text-gold">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
