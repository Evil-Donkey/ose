"use client";

import { useState } from "react";
import Link from "next/link";
import Container from "@/components/Container";
import HeaderWithMeganavLinks from "@/components/Header/HeaderWithMeganavLinks";
import Button from "@/components/Button";
import { Spinner } from "@/components/Icons/Spinner";
import { useForgotPassword } from "@/hooks/useForgotPassword";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const { sendResetPasswordEmail, status, error, isResolving, isResolved, hasError } = useForgotPassword();

    const onReset = (e) => {
        e.preventDefault();
        sendResetPasswordEmail(email);
    };

    return (
        <>
            <HeaderWithMeganavLinks fixed={false} />
            <div className="bg-cover bg-center bg-[url('/gradient.png')] text-white pt-16 pb-10 relative h-full min-h-screen">
                <Container className="py-40 2xl:pt-50 relative z-10 flex flex-col lg:flex-row justify-between gap-10">
                    <div className="w-full lg:w-1/2">
                        <h1 className="text-4xl lg:text-6xl mb-3">Forgot Password</h1>
                        <div className="text-base flex flex-col gap-4 lg:w-2/3">
                            <p>Enter your approved email address and we'll send you a link to reset your password.</p>
                        </div>
                    </div>
                    <div className="w-full lg:w-2/5">
                        {isResolved && !hasError ? (
                            <div className="flex flex-col gap-4">
                                <p className="text-white text-lg">
                                    Instructions have been emailed to you. Check your inbox.
                                </p>
                                <Link href="/investor-portal" className="text-white underline">
                                    Back to login
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={onReset} className="flex flex-col gap-4 w-full">
                                {hasError && error && (
                                    <div className="error-notice bg-red-500 bg-opacity-20 border border-red-300 rounded p-3">
                                        <p className="text-white">{error}</p>
                                    </div>
                                )}
                                
                                <div>
                                    <label className="block text-sm mb-2">Email Address:</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isResolving}
                                        className="bg-white text-blue-02 rounded-sm p-2 w-full"
                                        placeholder="Enter your email address"
                                        required
                                    />
                                </div>

                                <Button 
                                    type="submit" 
                                    disabled={isResolving}
                                    className="w-full"
                                >
                                    {isResolving ? (
                                        <div className="flex items-center gap-2">
                                            <Spinner size={16} />
                                            <span>Sending...</span>
                                        </div>
                                    ) : (
                                        "Reset Password"
                                    )}
                                </Button>
                                
                                <div className="mt-4">
                                    <Link href="/investor-portal" className="text-white underline">
                                        Back to login
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
