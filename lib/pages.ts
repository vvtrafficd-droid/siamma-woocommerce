import { siteConfig } from "./config";

export const pages = {
  about: {
    title: "About Us",
    description: `Learn more about ${siteConfig.title} — our mission, values, and the team dedicated to bringing you the best shopping experience.`,
  },
  contact: {
    title: "Contact Us",
    description: `Get in touch with ${siteConfig.title} — we're here to help with any questions, feedback, or support you may need.`,
  },
  privacy: {
    title: "Privacy Policy",
    description: `Understand how ${siteConfig.title} collects, uses, and protects your personal information.`,
  },
  terms: {
    title: "Terms & Conditions",
    description: `Read the terms and conditions of using ${siteConfig.title} and our online shopping services.`,
  },
  faq: {
    title: "FAQs",
    description: `Find quick answers to common questions about orders, shipping, and returns at ${siteConfig.title}.`,
  },
};
