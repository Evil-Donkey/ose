"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Header from "@/components/Header/index";

export default function ResetPassword() {
    const [tokenData, setTokenData] = useState(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

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
                setMessage("Password reset successfully. You can now log in.");
            } else {
                setMessage(result.error || "Failed to reset password.");
            }
        } catch (error) {
            setMessage("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <Header />
            <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
            {error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : (
                tokenData && (
                    <>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label>New Password:</label>
                                <input
                                    type="password"
                                    {...register("password", {
                                        required: "Password is required.",
                                        minLength: {
                                            value: 12,
                                            message: "Password must be at least 12 characters long.",
                                        },
                                        pattern: {
                                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/,
                                            message: "Must include uppercase, lowercase, number, and symbol.",
                                        },
                                    })}
                                    className="border border-gray-300 rounded-md p-2 w-full"
                                />
                                {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                            </div>

                            <div>
                                <label>Confirm Password:</label>
                                <input
                                    type="password"
                                    {...register("confirmPassword", {
                                        required: "Please confirm your password.",
                                        validate: (value) =>
                                            value === watch("password") || "Passwords do not match.",
                                    })}
                                    className="border border-gray-300 rounded-md p-2 w-full"
                                />
                                {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
                            </div>

                            <button
                                type="submit"
                                className="bg-blue-500 text-white rounded-md p-2 w-full cursor-pointer"
                            >
                                Reset Password
                            </button>
                        </form>
                        {message && <p>{message}</p>}
                    </>
                )
            )}
        </div>
    );
}
