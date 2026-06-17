"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { isAxiosError, type AxiosError } from "axios";
import { register } from "@/lib/api/clientApi";
import { useAuthStore, type AuthState } from "@/lib/store/authStore";
import type { AuthCredentials } from "@/types/auth";
import css from "./page.module.css";

const isValidEmail = (value: string) => /.+@.+\..+/.test(value);

const SignUpPage = () => {
  const searchParams = useSearchParams();
  const setUser = useAuthStore((state: AuthState) => state.setUser);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = ((formData.get("email") ?? "") as string).trim();
    const password = (formData.get("password") as string) ?? "";

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (!isValidEmail(email)) {
      setError(" Invalid email format.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    const payload: AuthCredentials = { email, password };

    try {
      setIsSubmitting(true);
      const user = await register(payload);
      setUser(user);

      await new Promise((resolve) => setTimeout(resolve, 300));

      const redirectTarget = searchParams?.get("redirect");
      const destination =
        redirectTarget && redirectTarget.startsWith("/")
          ? redirectTarget
          : "/profile";

      window.location.href = destination;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const axiosError = error as AxiosError<{
          message?: string;
          error?: string;
          validation?: { body?: { message?: string } };
        }>;
        const responseData = axiosError.response?.data;

        if (axiosError.response?.status === 400) {
          const validationMessage = responseData?.validation?.body?.message;
          if (validationMessage) {
            setError(validationMessage);
            return;
          }
          const conflictMessage =
            responseData?.message ||
            responseData?.error ||
            "This account already exists or the provided information is invalid. Kindly verify your details.";
          setError(conflictMessage);
          return;
        }

        if (axiosError.response?.status === 409) {
          const conflictMessage =
            responseData?.message ||
            responseData?.error ||
            "A user with this email already exists. Please try logging in..";
          setError(conflictMessage);
          return;
        }

        const message =
          responseData?.message ||
          responseData?.error ||
          axiosError.message ||
          "Login failed. Please try again..";
        setError(message);
      } else {
        setError("Login failed. Please try again..");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit} noValidate>
        <h1 className={css.formTitle}>Sign up</h1>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        {error && <p className={css.error}>{error}</p>}

        <div className={css.actions}>
          <button
            type="submit"
            className={css.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sign upping..." : "Sign up"}
          </button>
        </div>
      </form>
    </main>
  );
};

export default SignUpPage;
