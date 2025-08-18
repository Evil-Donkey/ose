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
                <Container className="py-40 2xl:pt-50 relative z-10 flex flex-col lg:flex-row justify-between gap-10">
                    <h1 className="text-4xl lg:text-6xl">Reset Password</h1>
                    {error ? (
                        <p className="text-white">{error}</p>
                    ) : message === "success" ? (
                        <div className="flex flex-col gap-4">
                            <p className="text-white text-lg">
                                Password reset successfully. You can now{" "}
                                <Link href="/investor-portal" className="text-blue-300 hover:text-blue-200 underline">
                                    log in
                                </Link>
                                .
                            </p>
                        </div>
                    ) : (
                        tokenData && (
                            <div className="flex flex-col gap-4">
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                                                className="border border-gray-300 rounded-md p-2 w-full pr-10"
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
                                                className="border border-gray-300 rounded-md p-2 w-full pr-10"
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
                </Container>
            </div>
        </>
    );
}
