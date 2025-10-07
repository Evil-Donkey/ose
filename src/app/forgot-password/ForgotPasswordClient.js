"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Container from "@/components/Container";
import HeaderWithMeganavLinks from "@/components/Header/HeaderWithMeganavLinks";
import Button from "@/components/Button";
import { Spinner } from "@/components/Icons/Spinner";

export default function ForgotPasswordClient({ meganavLinks, meganavData }) {
    const [isLoading, setIsLoading] = useState(false);
    const [emailCheckResult, setEmailCheckResult] = useState(null);
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (formData) => {
        setIsLoading(true);
        setError("");
        setEmailCheckResult(null);

        try {
            const response = await fetch("/api/auth/check-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email }),
            });

            const result = await response.json();

            if (result.exists && result.approved) {
                const resetResponse = await fetch("/api/auth/forgot-password", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: formData.email }),
                });

                const resetResult = await resetResponse.json();

                if (resetResult.success) {
                    setEmailCheckResult("success");
                } else {
                    setError(resetResult.error || "Failed to send reset email.");
                }
            } else if (result.exists && !result.approved) {
                setEmailCheckResult("pending");
            } else {
                setEmailCheckResult("notFound");
            }
        } catch (error) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <HeaderWithMeganavLinks fixed={false} meganavLinks={meganavLinks} meganavData={meganavData} />
            <div className="bg-cover bg-center bg-[url('/gradient.png')] text-white pt-16 pb-10 relative h-full min-h-screen">
                <Container className="pt-40 pb-10 2xl:pt-50 relative z-10 flex flex-col lg:flex-row justify-between gap-10">
                    <div className="w-full lg:w-2/5">
                        <h1 className="text-4xl lg:text-6xl mb-4">Forgot Password</h1>
                        <div className="text-base flex flex-col gap-4 lg:w-4/5 2xl:w-2/3">
                            <p>If you've forgotten your password, we can help you reset it. Simply enter your email address below, and if your account is approved, we'll send you a link to create a new password.</p>
                            <p>Need assistance? Contact us at <a href="mailto:investors@oxfordsciences.com" className="text-white underline">investors@oxfordsciences.com</a>.</p>
                        </div>
                    </div>
                    <div className="w-full lg:w-2/5 lg:ps-2 2xl:ps-10 flex flex-col justify-center">
                        {emailCheckResult === "success" ? (
                            <div className="flex flex-col gap-4 text-center items-center justify-center">
                                <p className="w-full text-white text-lg text-center p-10 rounded-sm border bg-blue-02/30 border-white">Password reset email sent successfully.<br/>Check your inbox for further instructions.</p>
                                <Link href="/shareholder-portal" className="text-white underline text-center">Back to Login</Link>
                            </div>
                        ) : emailCheckResult === "pending" ? (
                            <div className="flex flex-col gap-4 text-center items-center justify-center">
                                <p className="w-full text-white text-lg text-center p-10 rounded-sm border bg-blue-02/30 border-white">Your account is pending approval.<br/>You'll receive an email once approved.</p>
                                <Link href="/shareholder-portal" className="text-white underline text-center">Back to Login</Link>
                            </div>
                        ) : emailCheckResult === "notFound" ? (
                            <div className="flex flex-col gap-4 text-center items-center justify-center">
                                <p className="w-full text-white text-lg text-center p-10 rounded-sm border bg-blue-02/30 border-white">No account found with this email.<br/>Please check your email or contact support.</p>
                                <Link href="/shareholder-portal" className="text-white underline text-center">Back to Login</Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
                                <div>
                                    <label className="text-base">Email Address:</label>
                                    <input
                                        type="email"
                                        {...register("email", {
                                            required: "Email is required.",
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: "Please enter a valid email address.",
                                            },
                                        })}
                                        className="bg-white text-blue-02 rounded-sm p-2 w-full"
                                        disabled={isLoading}
                                    />
                                    {errors.email && <p className="text-white">{errors.email.message}</p>}
                                </div>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <Spinner size={16} />
                                            <span>Sending...</span>
                                        </div>
                                    ) : (
                                        "Send Reset Link"
                                    )}
                                </Button>
                                {error && <p className="text-white">{error}</p>}
                                <div className="pt-4">
                                    <Link href="/shareholder-portal" className="text-white underline">
                                        Back to Login
                                    </Link>
                                </div>
                            </form>
                        )}
                    </div>
                </Container>
            </div>
        </>
    );
}

