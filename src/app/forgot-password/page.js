"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Container from "@/components/Container";
import HeaderWithMeganavLinks from "@/components/Header/HeaderWithMeganavLinks";
import Button from "@/components/Button";
import { Spinner } from "@/components/Icons/Spinner";

export default function ForgotPassword() {
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
                body: JSON.stringify({
                    email: formData.email,
                }),
            });

            const result = await response.json();
            
            if (result.success) {
                // Display the status-specific message from the API
                setEmailCheckResult({
                    type: result.status === 'approved' ? 'success' : 
                          result.status === 'not_found' ? 'error' : 'warning',
                    message: result.message,
                    user: result.user,
                    status: result.status
                });
            } else {
                setError(result.message || "Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("❌ Email check error:", error);
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <HeaderWithMeganavLinks fixed={false} />
            <div className="bg-cover bg-center bg-[url('/gradient.png')] text-white pt-16 pb-10 relative h-full min-h-screen">
                <Container className="pt-40 pb-10 2xl:pt-50 relative z-10 flex flex-col lg:flex-row justify-between gap-10">
                    <div className="w-full lg:w-2/5">
                        <h1 className="text-4xl lg:text-6xl mb-4">Forgot Password</h1>
                        <div className="text-base flex flex-col gap-4 lg:w-4/5 2xl:w-2/3">
                            <p>Enter your email address and we&apos;ll check if it exists in our system. If it does, we&apos;ll send you an email to reset your password.</p>
                        </div>
                    </div>
                    <div className="w-full lg:w-2/5 lg:ps-2 2xl:ps-10">
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                            {/* Email */}
                            <div className="w-full flex flex-col gap-2">
                                <label htmlFor="email" className="text-sm">Email Address*</label>
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Please enter a valid email address",
                                        },
                                    })}
                                    className="bg-white text-blue-02 rounded-sm p-2"
                                />
                                {errors.email && <p className="text-white">{errors.email.message}</p>}
                            </div>

                            {/* Submit Button */}
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <Spinner size={16} />
                                        <span>Checking...</span>
                                    </div>
                                ) : (
                                    "Check Email"
                                )}
                            </Button>
                        </form>

                        {/* Error message */}
                        {error && (
                            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded">
                                <p className="text-white">{error}</p>
                            </div>
                        )}

                        {/* Email check result */}
                        {emailCheckResult && (
                            <div className={`mt-8 p-4 rounded ${
                                emailCheckResult.type === "success" 
                                    ? "bg-green-500/20 border border-green-500/50" 
                                    : emailCheckResult.type === "warning"
                                    ? "bg-yellow-500/20 border border-yellow-500/50"
                                    : "bg-red-500/20 border border-red-500/50"
                            }`}>
                                <p className="text-white font-medium">{emailCheckResult.message}</p>
                                
                                {/* Show additional info for approved users */}
                                {emailCheckResult.status === 'approved' && emailCheckResult.user && (
                                    <div className="mt-3 p-3 bg-green-500/10 rounded border border-green-500/30">
                                        <p className="text-sm text-green-200">
                                            <strong>Email:</strong> {emailCheckResult.user.email}
                                        </p>
                                        <p className="text-sm text-green-200 mt-1">
                                            <strong>Status:</strong> {emailCheckResult.user.userStatus}
                                        </p>
                                    </div>
                                )}
                                
                                {/* Show contact info for denied/pending users */}
                                {/* {emailCheckResult.status === 'denied' || emailCheckResult.status === 'pending' ? (
                                    <div className="mt-3">
                                        <p className="text-base">
                                            <strong>Contact:</strong> investors@oxfordsciences.com
                                        </p>
                                    </div>
                                ) : null} */}
                                
                                {/* Show signup link for non-existent emails */}
                                {/* {emailCheckResult.status === 'not_found' && (
                                    <div className="mt-3">
                                        <p className="text-base text-white">
                                            <Link href="/shareholder-portal-signup" className="underline">
                                                Click here to sign up
                                            </Link>
                                        </p>
                                    </div>
                                )} */}
                            </div>
                        )}

                        <div className="flex flex-col gap-2 mt-8">
                            <p className="text-sm flex items-center gap-2">
                                <Link href="/shareholder-portal" className="text-white underline">Back to login</Link>
                                <span className="text-white">|</span>
                                <Link href="/shareholder-portal-signup" className="text-white underline">Request access</Link>
                            </p>
                        </div>
                    </div>
                </Container>
            </div>
        </>
    );
}
