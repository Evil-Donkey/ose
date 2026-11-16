"use client";

import Button from "@/components/Button";
import { usePageTheme, getButtonColourClasses } from "@/components/PageTheme";
import { useCtaFormModal } from "@/components/CtaFormModal";

const isEmail = (url) => {
  if (!url) return false;
  return url.includes("@") && !url.startsWith("http") && !url.startsWith("/");
};

const formatEmailUrl = (email) => {
  if (!email) return "#";
  if (email.startsWith("mailto:")) return email;
  return `mailto:${email}`;
};

/**
 * Shared CTA button for the flexible layouts.
 * - On a page wrapped in <CtaFormModalProvider> it opens the form panel (the URL is ignored).
 * - Everywhere else it behaves like before: email -> mailto link, otherwise a normal link.
 */
export function useHasCtaModal() {
  return Boolean(useCtaFormModal());
}

const CtaButton = ({ label, href, variant }) => {
  const modal = useCtaFormModal();
  const theme = usePageTheme();

  if (!label) return null;

  if (modal) {
    return (
      <Button type="button" className="" onClick={() => modal.open(label)}>
        {label}
      </Button>
    );
  }

  if (isEmail(href)) {
    return (
      <a
        href={formatEmailUrl(href)}
        className={`${getButtonColourClasses(theme)} text-white text-sm lg:text-xs xl:text-base font-normal px-6 py-3 rounded-full shadow text-center transition-colors cursor-pointer w-max uppercase inline-block`}
      >
        {label}
      </a>
    );
  }

  return (
    <Button href={href} variant={variant}>
      {label}
    </Button>
  );
};

export default CtaButton;
