'use client'

import { useState } from "react";
import { useForm } from "react-hook-form";

export default function SignupForm() {
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    // Remove the 'terms' field from the payload before sending it to the server
    const { terms, ...dataWithoutTerms } = formData;
  
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataWithoutTerms),
    });
  
    const data = await response.json();
    setMessage(data.message || "Error signing up");
  };
  

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        
        {/* First Name */}
        <div>
          <input
            type="text"
            placeholder="First Name"
            {...register("firstName", {
              required: "First name is required",
            })}
            className="border border-gray-300 rounded-md p-2 w-full"
          />
          {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
        </div>

        {/* Last Name */}
        <div>
          <input
            type="text"
            placeholder="Last Name"
            {...register("lastName", {
              required: "Last name is required",
            })}
            className="border border-gray-300 rounded-md p-2 w-full"
          />
          {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email format",
              },
            })}
            className="border border-gray-300 rounded-md p-2 w-full"
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>

        {/* Organisation */}
        <div>
          <input
            type="text"
            placeholder="Organisation"
            {...register("organisation", {
              required: "Organisation is required",
            })}
            className="border border-gray-300 rounded-md p-2 w-full"
          />
          {errors.organisation && <p className="text-red-500">{errors.organisation.message}</p>}
        </div>

        {/* Role */}
        <div>
          <input
            type="text"
            placeholder="Role"
            {...register("organisationRole", {
              required: "Role is required",
            })}
            className="border border-gray-300 rounded-md p-2 w-full"
          />
          {errors.organisationRole && <p className="text-red-500">{errors.organisationRole.message}</p>}
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register("terms", {
              required: "You must agree to the terms and conditions",
            })}
          />
          <label>
            I agree to the website's{" "}
            <a href="/terms-and-conditions" target="_blank" className="text-blue-500">Terms & Conditions</a> and{" "}
            <a href="/privacy-policy" target="_blank" className="text-blue-500">Privacy Policy</a>, and consent to the collection and use of my personal data as outlined in the Privacy Policy.
          </label>
        </div>
        {errors.terms && <p className="text-red-500">{errors.terms.message}</p>}

        {/* Submit Button */}
        <button type="submit" className="bg-blue-500 text-white rounded-md p-2 w-full cursor-pointer">
          Sign Up
        </button>
      </form>

      {message && <p className="mt-2 text-green-600">{message}</p>}
    </div>
  );
}
