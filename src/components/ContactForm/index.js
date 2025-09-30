'use client'

import { useForm } from "react-hook-form";
import { useState } from "react";
import Button from "@/components/Button";
import Link from "next/link";

const ContactForm = () => {

    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setError("");
        setSuccess(false);

        console.log("Form data being submitted:", data);

        const formData = new FormData();

        // Contact Form 7 required fields
        formData.append("_wpcf7", process.env.NEXT_PUBLIC_CF7_FORM_ID || "3365");
        formData.append("_wpcf7_version", "6.0.5");
        formData.append("_wpcf7_locale", "en_UK");
        formData.append("_wpcf7_unit_tag", `wpcf7-f${process.env.NEXT_PUBLIC_CF7_CONTACT_FORM_ID || "3365"}-p3366-o1`);
        formData.append("_wpcf7_container_post", "3366");

        // Form fields - match exactly with WordPress Contact Form 7 field names
        formData.append("first-name", data.firstName);
        formData.append("last-name", data.lastName);
        formData.append("email", data.email);
        formData.append("message", data.message);

        // Debug: Log the FormData contents
        console.log("FormData contents:");
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        try {
            const endpoint = `${process.env.NEXT_PUBLIC_WORDPRESS_ENDPOINT}/wp-json/contact-form-7/v1/contact-forms/${process.env.NEXT_PUBLIC_CF7_CONTACT_FORM_ID || "3365"}/feedback`;
            console.log("Submitting to endpoint:", endpoint);

            const response = await fetch(endpoint, {
                method: "POST",
                body: formData,
            });

            console.log("Response status:", response.status);
            console.log("Response headers:", [...response.headers.entries()]);

            const responseText = await response.text();
            console.log("Response text:", responseText);
            
            let result;
            try {
                result = JSON.parse(responseText);
                console.log("Response result:", result);
            } catch (parseError) {
                console.error("JSON parse error:", parseError);
                setError("Invalid response from server");
                setIsSubmitting(false);
                return;
            }

            if (result.status === "mail_sent") {
                setSuccess(true);
                reset(); // Clear all form fields after successful submission
            } else {
                // Handle different types of errors
                let errorMessage = "Submission failed. Please try again.";
                
                if (result.messages && result.messages.validation_error) {
                    errorMessage = result.messages.validation_error.join(", ");
                } else if (result.messages && result.messages.mail_failed) {
                    errorMessage = result.messages.mail_failed.join(", ");
                } else if (result.message) {
                    errorMessage = result.message;
                }
                
                setError(errorMessage);
            }
        } catch (err) {
            console.error("Form submission error:", err);
            setError("An error occurred. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex -mx-4 flex-col md:flex-row flex-wrap">
        <div className="md:w-1/2 flex flex-col gap-2 mb-5 px-4">
            <label htmlFor="firstName" className="text-sm">First Name*</label>
            <input type="text" className="bg-white text-blue-02 border-blue-02 border-1 rounded-sm p-2" {...register("firstName", { required: "First name is required" })} />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
        </div>

        <div className="md:w-1/2 flex flex-col gap-2 mb-5 px-4">
            <label htmlFor="lastName" className="text-sm">Last Name*</label>
            <input type="text" className="bg-white text-blue-02 border-blue-02 border-1 rounded-sm p-2" {...register("lastName", { required: "Last name is required" })} />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
        </div>

        <div className="w-full flex flex-col gap-2 mb-5 px-4">
            <label htmlFor="email" className="text-sm">Email*</label>
            <input type="email" className="bg-white text-blue-02 border-blue-02 border-1 rounded-sm p-2" {...register("email", { 
                required: "Email is required",
                pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                }
            })} />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>
        
        <div className="w-full flex flex-col gap-2 mb-5 px-4">
            <label htmlFor="message" className="text-sm">Message*</label>
            <textarea rows="5" className="bg-white text-blue-02 border-blue-02 border-1 rounded-sm p-2" {...register("message", { required: "Message is required" })} />
            {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}
        </div>

        <div className="w-full flex flex-col gap-2 mb-5 px-4">
            <label htmlFor="privacyPolicy" className="text-white rounded-md bg-blue-02 p-4 flex items-start gap-2 text-sm">
                <input type="checkbox" className="mt-1" {...register("privacyPolicy", { required: "You must accept the Privacy Policy" })} />
                <span>By submitting this form, I agree to the <Link href="/privacy-policy">Privacy Policy</Link> and consent to the collection, use, and storage of my information as described.</span>
            </label>
            {errors.privacyPolicy && <p className="text-red-500 text-sm">{errors.privacyPolicy.message}</p>}
        </div>

        <div className="w-full flex flex-col items-end gap-2 px-4">
            <Button disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
        </div>

        <div className="w-full flex flex-col gap-2 mt-5 mt-md-0 px-4">
            {success && <p className="text-white font-medium">Thank you for your message! Our team will be in touch soon.</p>}
            {error && <p className="text-red-500 font-medium">{error}</p>}
        </div>
    </form>
  );
}

export default ContactForm;
