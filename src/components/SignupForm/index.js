'use client'

import { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@/components/Button";
import Container from "@/components/Container";
import { Spinner } from "@/components/Icons/Spinner";

export default function SignupForm({ title, content }) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    // Remove the 'terms' field from the payload before sending it to the server
    setIsLoading(true);
    const { terms, ...dataWithoutTerms } = formData;
  
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataWithoutTerms),
      });
    
      const data = await response.json();
      setMessage(data.message || "Error signing up");
    } catch (error) {
      console.error("❌ Signup error:", error);
      setMessage("Error signing up");
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
            {errors.firstName && <p className="text-white">{errors.firstName.message}</p>}
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
            {errors.lastName && <p className="text-white">{errors.lastName.message}</p>}
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
            {errors.email && <p className="text-white">{errors.email.message}</p>}
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
            {errors.organisation && <p className="text-white">{errors.organisation.message}</p>}
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
            {errors.organisationRole && <p className="text-white">{errors.organisationRole.message}</p>}
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
              I agree to the website&apos;s{" "}
              <a href="/terms-and-conditions" target="_blank" className="text-white underline">Terms & Conditions</a> and{" "}
              <a href="/privacy-policy" target="_blank" className="text-white underline">Privacy Policy</a>, and consent to the collection and use of my personal data as outlined in the Privacy Policy.
            </label>
          </div>
          {errors.terms && <p className="text-white">{errors.terms.message}</p>}

          {/* Submit Button */}
          <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                  <div className="flex items-center gap-2">
                      <Spinner size={16} />
                      <span>Sending...</span>
                  </div>
              ) : (
                  "Request Access"
              )}
          </Button>
        </form>

        {message && <p className="mt-8 text-white">{message}</p>}
      </div>
    </Container>
  );
}
