'use client'

import { useForm } from "react-hook-form";
import { useState } from "react";
import Button from "@/components/Button";
import Link from "next/link";

const Form = () => {

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
        formData.append("_wpcf7", process.env.NEXT_PUBLIC_CF7_FORM_ID || "1568");
        formData.append("_wpcf7_version", "6.0.5");
        formData.append("_wpcf7_locale", "en_UK");
        formData.append("_wpcf7_unit_tag", `wpcf7-f${process.env.NEXT_PUBLIC_CF7_FORM_ID || "1568"}-p1566-o1`);
        formData.append("_wpcf7_container_post", "1566");

        // Form fields - match exactly with WordPress Contact Form 7 field names
        formData.append("first-name", data.firstName);
        formData.append("last-name", data.lastName);
        formData.append("email", data.email);
        formData.append("connection", data.connection);
        formData.append("other-connection", data.otherConnection || "");
        formData.append("university-department", data.universityDepartment || "");
        formData.append("summary", data.summary || "");
        formData.append("challenge", data.challenge || "");
        formData.append("conversation", data.conversation || "");
        
        // Handle sectors as comma-separated string for text field
        let sectorsValue = "";
        if (data.sectors) {
            if (Array.isArray(data.sectors)) {
                sectorsValue = data.sectors.join(", ");
            } else {
                sectorsValue = data.sectors;
            }
        }
        
        // Validate that at least one sector is selected
        if (!sectorsValue) {
            setError("Please select at least one sector");
            setIsSubmitting(false);
            return;
        }
        
        // Send sectors as a single comma-separated string
        formData.append("sectors", sectorsValue);

        // Handle file upload
        if (data.file && data.file[0]) {
            formData.append("file", data.file[0]);
        }

        // Debug: Log the FormData contents
        console.log("FormData contents:");
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        try {
            const endpoint = `${process.env.NEXT_PUBLIC_WORDPRESS_ENDPOINT}/wp-json/contact-form-7/v1/contact-forms/${process.env.NEXT_PUBLIC_CF7_FORM_ID || "1568"}/feedback`;
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
        <div className="w-full flex flex-col gap-2 mb-2 px-4">
            <div className="text-sm font-bold">Personal information</div>
        </div>
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
            <label htmlFor="connection" className="text-sm">Connection to Oxford*</label>
            <select className="bg-white text-blue-02 border-blue-02 border-1 rounded-sm p-2" {...register("connection", { required: "Connection to Oxford is required" })} defaultValue="">
                <option value="" disabled>Select</option>
                <option value="Professor, University of Oxford">Professor, University of Oxford</option>
                <option value="Researcher, University of Oxford">Researcher, University of Oxford</option>
                <option value="Post-doctoral Student, University of Oxford">Post-doctoral Student, University of Oxford</option>
                <option value="Postgraduate Student, University of Oxford">Postgraduate Student, University of Oxford</option>
                <option value="Undergraduate Student, University of Oxford">Undergraduate Student, University of Oxford</option>
                <option value="Researcher, Harwell Science Park">Researcher, Harwell Science Park</option>
                <option value="Researcher, Culham Science Park">Researcher, Culham Science Park</option>
                <option value="Other">Other</option>
            </select>
            {errors.connection && <p className="text-red-500 text-sm">{errors.connection.message}</p>}
        </div>

        {watch("connection") === "Other" && (
            <div className="w-full flex flex-col gap-2 mb-5 px-4">
                <label htmlFor="otherConnection" className="text-sm">Other (please specify)</label>
                <input type="text" className="bg-white text-blue-02 border-blue-02 border-1 rounded-sm p-2" {...register("otherConnection")} />
                {errors.otherConnection && <p className="text-red-500 text-sm">{errors.otherConnection.message}</p>}
            </div>
        )}

        <div className="w-full flex flex-col gap-2 mb-5 px-4">
            <label htmlFor="universityDepartment" className="text-sm">Department (if applicable)</label>
            <input type="text" className="bg-white text-blue-02 border-blue-02 border-1 rounded-sm p-2" {...register("universityDepartment")} />
            {errors.universityDepartment && <p className="text-red-500 text-sm">{errors.universityDepartment.message}</p>}
        </div>
        
        <div className="w-full flex flex-col gap-2 mb-5 px-4">
            <div className="text-sm font-bold mt-4">Research summary</div>
            <label htmlFor="summary" className="text-sm">Brief description of your research*</label>
            <textarea rows="5" className="bg-white text-blue-02 border-blue-02 border-1 rounded-sm p-2" {...register("summary", { required: "Summary of your research is required" })} />
            {errors.summary && <p className="text-red-500 text-sm">{errors.summary.message}</p>}
        </div>
        
        <div className="w-full flex flex-col gap-2 mb-5 px-4">
            <label htmlFor="challenge" className="text-sm">What challenge does your work aim to solve?</label>
            <textarea rows="5" className="bg-white text-blue-02 border-blue-02 border-1 rounded-sm p-2" {...register("challenge")} />
            {errors.challenge && <p className="text-red-500 text-sm">{errors.challenge.message}</p>}
        </div>
        
        <div className="w-full flex flex-col gap-2 mb-5 px-4">
            <label htmlFor="conversation" className="text-sm">What do you hope to explore through a conversation with OSE?</label>
            <textarea rows="5" className="bg-white text-blue-02 border-blue-02 border-1 rounded-sm p-2" {...register("conversation")} />
            {errors.conversation && <p className="text-red-500 text-sm">{errors.conversation.message}</p>}
        </div>

        <div className="w-full flex flex-col gap-2 mb-5 px-4">
            <label htmlFor="sectors" className="text-sm">Relevant Sector (select one)*</label>
            <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm">
                    <input type="radio" {...register("sectors")} value="Deep Tech" />
                    <span>Deep Tech</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                    <input type="radio" {...register("sectors")} value="Health Tech" />
                    <span>HealthTech</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                    <input type="radio" {...register("sectors")} value="Life Sciences" />
                    <span>Life Sciences</span>
                </label>
                {errors.sectors && <p className="text-red-500 text-sm">{errors.sectors.message}</p>}
            </div>
        </div>

        <div className="w-full flex flex-col gap-2 mb-5 px-4">
            <div className="text-sm font-bold mt-4">Supporting materials</div>
            <label htmlFor="file" className="text-sm">Upload any relevant non-confidential material</label>
            <input 
                type="file" 
                className="bg-lightblue text-white font-normal px-6 py-3 rounded-full shadow hover:bg-darkblue text-center transition-colors cursor-pointer self-start uppercase" 
                accept=".txt,.pdf"
                {...register("file", { 
                    validate: {
                        fileSize: (files) => {
                            if (files && files[0]) {
                                const maxSize = 3 * 1024 * 1024; // 3MB
                                return files[0].size <= maxSize || "File size must be less than 3MB";
                            }
                            return true;
                        },
                        fileType: (files) => {
                            if (files && files[0]) {
                                const allowedTypes = ['text/plain', 'application/pdf'];
                                return allowedTypes.includes(files[0].type) || "Only .txt and .pdf files are allowed";
                            }
                            return true;
                        }
                    }
                })} 
            />
            {errors.file && <p className="text-red-500 text-sm">{errors.file.message}</p>}
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
                {isSubmitting ? "Submitting..." : "Start the conversation"}
            </Button>
        </div>

        <div className="w-full flex flex-col gap-2 mt-5 mt-md-0 px-4">
            {success && <p className="text-white font-medium">Thank you for sharing your research! Our team will review your submission and be in touch soon.</p>}
            {error && <p className="text-red-500 font-medium">{error}</p>}
        </div>
    </form>
  );
}

export default Form;
