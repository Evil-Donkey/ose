"use client";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import AuthContext from "../../context/AuthContext";
import Header from "../Header/index";

export default function LoginForm() {
    const { login } = useContext(AuthContext);
    const [serverError, setServerError] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (formData) => {
        setServerError(null);
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
        }
    };
    

    return (
        <div className="container mx-auto p-4">
            <Header portal={false} />
            <h2 className="text-2xl font-bold mb-4 pt-40">Login</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                {/* Username / Email */}
                <div>
                    <input
                        type="text"
                        placeholder="Username or Email"
                        {...register("username", {
                            required: "Username or email is required",
                        })}
                        className="border border-gray-300 rounded-md p-2 w-full"
                    />
                    {errors.username && <p className="text-red-500">{errors.username.message}</p>}
                </div>

                {/* Password */}
                <div>
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
                        className="border border-gray-300 rounded-md p-2 w-full"
                    />
                    {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                </div>

                {/* Submit Button */}
                <button type="submit" className="bg-blue-500 text-white rounded-md p-2 w-full cursor-pointer">
                    Log In
                </button>
            </form>

            {/* Server error message */}
            {serverError && <p className="text-red-500 mt-2">{serverError}</p>}
        </div>
    );
}
