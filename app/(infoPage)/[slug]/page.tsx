import React from "react";
import { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import { pages } from "@/lib/pages"; // adjust import path if needed
import { Breadcrumb } from "@/components/Breadcrumb";

// ✅ Generate metadata dynamically
export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const slug = (await params).slug;
    const page = pages[slug as keyof typeof pages];

    if (!page) {
        return {
            title: `Page not found | ${siteConfig.title}`,
            description: "Sorry, the page you are looking for does not exist.",
        };
    }

    return {
        title: `${page.title} | ${siteConfig.title}`,
        description: page.description,
        openGraph: {
            title: `${page.title} | ${siteConfig.title}`,
            description: page.description,
        },
        twitter: {
            card: "summary_large_image",
            title: `${page.title} | ${siteConfig.title}`,
            description: page.description,
        },
    };
}

// ✅ Page Component
const InfoPage = async ({
    params,
}: {
    params: Promise<{ slug: string }>;
}) => {
    const slug = (await params).slug;
    const page = pages[slug as keyof typeof pages];

    if (!page) {
        return (
            <div className="max-w-3xl mx-auto py-16 text-center min-h-[70vh]">
                <h1 className="text-3xl font-semibold mb-4">Page Not Found</h1>
                <p className="text-gray-600">
                    Sorry, the page you’re looking for doesn’t exist.
                </p>
            </div>
        );
    }

    return (
        <>

            <Breadcrumb
                links={[
                    { title: 'Home', href: '/' },
                    { title: page.title, href: '#' },
                ]} />
            <div className="max-w-3xl mx-auto py-16 min-h-[70vh]">
                <h1 className="text-4xl font-semibold mb-6">{page.title}</h1>
                <p className="text-gray-700 leading-relaxed text-lg">{page.description}</p>
            </div>
        </>

    );
};

export default InfoPage;
