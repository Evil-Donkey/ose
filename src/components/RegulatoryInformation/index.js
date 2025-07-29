"use client";

import { Document, Download } from "@/components/Icons/Portal";

const RegulatoryInformation = ({ documents = [] }) => {
    const handleDownload = (document) => {
        if (document.fileUrl) {
            const link = document.createElement('a');
            link.href = document.fileUrl;
            link.download = document.fileName || 'document';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="w-full bg-white rounded-lg p-6 lg:p-12">
            <h2 className="text-2xl font-medium text-blue-02 mb-6">Regulatory Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documents.map((doc, index) => (
                    <a
                        key={index}
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-100 hover:bg-gray-200 transition-colors duration-200 cursor-pointer rounded-lg p-6 flex flex-col h-full relative group"
                    >
                        <div className="flex flex-col gap-3 mb-4">
                            <Document />
                            <h3 className="text-lg font-bold text-blue-02">{doc.title}</h3>
                        </div>
                        <p className="text-gray-700 text-sm mb-6 flex-grow">
                            {doc.description}
                        </p>
                        <div className="flex justify-end">
                            <div className="group-hover:scale-110 transition-transform duration-200">
                                <Download />
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default RegulatoryInformation; 