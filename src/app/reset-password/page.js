"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Container from "@/components/Container";
import HeaderWithMeganavLinks from "@/components/Header/HeaderWithMeganavLinks";
import Button from "@/components/Button";
import { Spinner } from "@/components/Icons/Spinner";
import EyeIcon from "@/components/Icons/EyeIcon";

export default function ResetPassword() {
    const [tokenData, setTokenData] = useState(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const rawToken = urlParams.get("token");

            if (!rawToken) {
                setError("No reset token provided.");
                return;
            }

            const decoded = JSON.parse(atob(decodeURIComponent(rawToken)));

            // Check if the token is expired
            if (decoded.expires < Math.floor(Date.now() / 1000)) {
                setError("This reset link has expired. Please request a new one.");
                return;
            }

            setTokenData(decoded);
        } catch (e) {
            setError("Invalid or expired reset link.");
        }
    }, []);

    const onSubmit = async (data) => {
        setIsLoading(true);
        if (!tokenData?.key || !tokenData?.login) {
            setMessage("Invalid reset request.");
            return;
        }

        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    key: tokenData.key,
                    login: tokenData.login,
                    newPassword: data.password,
                }),
            });

            const result = await response.json();
            if (result.success) {
                setMessage("success");
            } else {
                setMessage(result.error || "Failed to reset password.");
            }
        } catch (error) {
            setMessage("Something went wrong. Please try again.");
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
                        <h1 className="text-4xl lg:text-6xl mb-4">Create Password</h1>
                        <div className="text-base flex flex-col gap-4 lg:w-4/5 2xl:w-2/3">
                            <p>Hi {tokenData?.login || 'there'}, you&apos;ve been directed here from your registration email. Please create a secure password to complete your account setup.</p>
                        </div>
                    </div>
                    <div className="w-full lg:w-2/5 lg:ps-2 2xl:ps-10">
                        {error ? (
                            <p className="text-white">{error}</p>
                        ) : message === "success" ? (
                            <div className="flex flex-col gap-4">
                                <p className="text-white text-lg">
                                    Password reset successfully. You can now{" "}
                                    <Link href="/shareholder-portal" className="text-blue-300 hover:text-blue-200 underline">
                                        log in
                                    </Link>
                                    .
                                </p>
                            </div>
                        ) : (
                            tokenData && (
                                <div className="flex flex-col gap-4 w-full">
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
                                        <div>
                                            <label>New Password:</label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    {...register("password", {
                                                        required: "Password is required.",
                                                        minLength: {
                                                            value: 8,
                                                            message: "Password must be at least 8 characters long.",
                                                        },
                                                        pattern: {
                                                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                                            message: "Must include uppercase, lowercase, number, and symbol.",
                                                        },
                                                    })}
                                                    className="bg-white text-blue-02 rounded-sm p-2 w-full"
                                                />
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                    <EyeIcon
                                                        isOpen={showPassword}
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        size={20}
                                                    />
                                                </div>
                                            </div>
                                            {errors.password && <p className="text-white">{errors.password.message}</p>}
                                        </div>

                                        <div>
                                            <label>Confirm Password:</label>
                                            <div className="relative">
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    {...register("confirmPassword", {
                                                        required: "Please confirm your password.",
                                                        validate: (value) =>
                                                            value === watch("password") || "Passwords do not match.",
                                                    })}
                                                    className="bg-white text-blue-02 rounded-sm p-2 w-full"
                                                />
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                    <EyeIcon
                                                        isOpen={showConfirmPassword}
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        size={20}
                                                    />
                                                </div>
                                            </div>
                                            {errors.confirmPassword && <p className="text-white">{errors.confirmPassword.message}</p>}
                                        </div>

                                        <Button type="submit" disabled={isLoading}>
                                            {isLoading ? (
                                                <div className="flex items-center gap-2">
                                                    <Spinner size={16} />
                                                    <span>Resetting...</span>
                                                </div>
                                            ) : (
                                                "Reset Password"
                                            )}
                                        </Button>
                                    </form>
                                    {message && <p className="text-white">{message}</p>}
                                </div>
                            )
                        )}
                    </div>
                </Container>
            </div>
        </>
    );
}
