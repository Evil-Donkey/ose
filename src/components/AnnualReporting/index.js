"use client";

import { Document, Download, ExternalLink } from "@/components/Icons/Portal";

const getExternalHref = (url) =>
    typeof url === "string" && url.trim() ? url.trim() : null;

const AnnualReporting = ({ documents = [], description }) => {
    const descriptionText =
        typeof description === "string"
            ? description
            : description != null && !Array.isArray(description)
              ? String(description)
              : "";

    return (
        <div className="w-full bg-white rounded-lg p-6 lg:p-12">
            <h2 className="text-2xl font-medium text-blue-02 mb-4">Annual Reporting</h2>
            {descriptionText.trim() ? (
                <p className="text-gray-700 mb-8">{descriptionText}</p>
            ) : null}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documents.map((doc, index) => {
                    const externalHref = getExternalHref(doc.url);
                    const fileHref =
                        typeof doc.fileUrl === "string" && doc.fileUrl.trim()
                            ? doc.fileUrl.trim()
                            : null;

                    return (
                        <div
                            key={index}
                            className="bg-gray-100 rounded-lg p-6 flex flex-col h-full relative"
                        >
                            <div className="flex flex-col gap-3 mb-4">
                                <Document />
                                <h3 className="text-lg font-bold text-blue-02">{doc.title}</h3>
                            </div>
                            <p className="text-gray-700 text-sm mb-6 flex-grow">
                                {doc.description}
                            </p>
                            {(fileHref || externalHref) && (
                                <div className="flex justify-end items-center gap-4">
                                    {fileHref ? (
                                        <a
                                            href={fileHref}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            download={doc.fileName || undefined}
                                            className="hover:scale-110 transition-transform duration-200"
                                            aria-label={`Download ${doc.title}`}
                                        >
                                            <Download />
                                        </a>
                                    ) : null}
                                    {externalHref ? (
                                        <a
                                            href={externalHref}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:scale-110 transition-transform duration-200"
                                            aria-label={`Open ${doc.title} externally`}
                                        >
                                            <ExternalLink />
                                        </a>
                                    ) : null}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AnnualReporting;
