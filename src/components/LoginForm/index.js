"use client";

import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import AuthContext from "../../context/AuthContext";
import Button from "@/components/Button";
import Container from "@/components/Container";
import { Spinner } from "@/components/Icons/Spinner";
import Link from "next/link";

export default function LoginForm({ title, content }) {
    const { login } = useContext(AuthContext);
    const [serverError, setServerError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (formData) => {
        setServerError(null);
        setIsLoading(true);
        try {
            const response = await login({ username: formData.username, password: formData.password });
    
            // Check if login was successful
            if (!response.success) {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error("❌ Login error:", error);
            // Show specific error message if account is pending approval
            if (error.message === "Your account is pending approval. Please wait for confirmation.") {
                setServerError(error.message); // This will show the message to the user
            } else {
                setServerError("Please check your details and try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };
    

    return (
        <Container className="py-40 2xl:pt-50 relative z-10 flex flex-col lg:flex-row justify-between gap-10">
            <div className="w-full lg:w-2/5">
                {title && <h1 className="text-4xl lg:text-6xl mb-4">{title}</h1>}
                {content && <div className="text-base flex flex-col gap-4 lg:w-2/3" dangerouslySetInnerHTML={{ __html: content }} />}
            </div>
            <div className="w-full lg:w-2/5">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    {/* Username / Email */}
                    <div className="w-full flex flex-col gap-2 mb-3">
                        <label htmlFor="username" className="text-sm">Email*</label>
                        <input
                            type="text"
                            placeholder="Email"
                            {...register("username", {
                                required: "Username or email is required",
                            })}
                            className="bg-white text-blue-02 rounded-sm p-2"
                        />
                        {errors.username && <p className="text-white">{errors.username.message}</p>}
                    </div>

                    {/* Password */}
                    <div className="w-full flex flex-col gap-2 mb-5">
                        <label htmlFor="password" className="text-sm">Password*</label>
                        <input
                            type="password"
                            placeholder="Password"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters",
                                },
                            })}
                            className="bg-white text-blue-02 rounded-sm p-2"
                        />
                        {errors.password && <p className="text-white">{errors.password.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <Spinner size={16} />
                                <span>Entering...</span>
                            </div>
                        ) : (
                            "Enter"
                        )}
                    </Button>
                </form>

                {/* Server error message */}
                {serverError && <p className="text-white mt-2">{serverError}</p>}

                <div className="flex flex-col gap-2 mt-8">
                    <p className="text-sm flex items-center gap-2"><Link href="/shareholder-portal-signup" className="text-white underline">Request access</Link><span className="text-white">|</span><Link href="/forgot-password" className="text-white underline">Forgot password?</Link></p>
                </div>
            </div>
        </Container>
    );
}
