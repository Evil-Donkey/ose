"use client";

import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext"; 
import LoginForm from "../../components/LoginForm";
import Logout from "../../components/Logout";
import Container from "@/components/Container";
import { Folder, Document, Download } from "@/components/Icons/Portal";
import AuthDebugger from "../../components/AuthDebugger";
import { downloadFile } from "@/lib/downloadFile";

export default function InvestorPortalClient({ title, content, investorPortal }) {
    const { user, checkAuthStatus } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [expandedFolders, setExpandedFolders] = useState(new Set());
    const { folders } = investorPortal;

    useEffect(() => {
        const fetchUser = async () => {
            await checkAuthStatus();
            setLoading(false);
        };

        fetchUser();
    }, []);

    const toggleFolder = (folderIndex) => {
        const newExpanded = new Set(expandedFolders);
        if (newExpanded.has(folderIndex)) {
            newExpanded.delete(folderIndex);
        } else {
            newExpanded.add(folderIndex);
        }
        setExpandedFolders(newExpanded);
    };

    const renderFolderItem = (item, index, level = 0, parentKey = '') => {
        const uniqueKey = parentKey ? `${parentKey}-${index}` : `root-${index}`;
        const isExpanded = expandedFolders.has(uniqueKey);
        
        return (
            <div key={uniqueKey} className="w-full">
                <div 
                    className={`bg-gray-100 hover:bg-gray-200 transition-colors duration-200 cursor-pointer rounded-lg p-4 mb-2 flex items-center justify-between ${level > 0 ? 'ml-6' : ''}`}
                    onClick={() => toggleFolder(uniqueKey)}
                >
                    <div className="flex items-center gap-3">
                        <Folder />
                        <span className="text-gray-800 font-medium">{item.folderName || item.subfolderName}</span>
                    </div>
                </div>
                
                {isExpanded && item.contents && (
                    <div className="w-full">
                        {item.contents.map((contentItem, contentIndex) => {
                            // Determine item type - default to 'file' if not specified
                            const itemType = contentItem.itemType || (contentItem.fileName ? 'file' : 'folder');
                            
                            if (itemType === 'folder') {
                                return renderFolderItem(contentItem, contentIndex, level + 1, uniqueKey);
                            } else if (itemType === 'file') {
                                return (
                                    <div 
                                        key={`${uniqueKey}-file-${contentIndex}`}
                                        onClick={() => downloadFile(contentItem.fileUpload?.mediaItemUrl || contentItem.fileUpload?.link, contentItem.fileName)}
                                        className={`bg-gray-100 hover:bg-gray-200 transition-colors duration-200 cursor-pointer rounded-lg p-4 mb-2 flex items-center justify-between ${level > 0 ? 'ml-12' : 'ml-6'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Document />
                                            <span className="text-gray-800 font-medium">{contentItem.fileName}</span>
                                        </div>
                                        <Download />
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return <Container className="py-50 relative z-10 flex flex-col gap-10"><div className="w-full flex justify-center items-center h-full"><p className="text-2xl">Loading...</p></div></Container>;
    }

    if (!user) {
        return <LoginForm title={title} content={content} />;
    }

    return (
        <>
            <Container className="py-40 2xl:pt-50 relative z-10 flex flex-col gap-10">
                <div className="w-full flex justify-between items-center gap-10 mb-4">
                    {title && <h1 className="text-4xl lg:text-6xl">{title}</h1>}
                    <Logout />
                </div>
                <div className="w-full bg-white rounded-lg p-6">
                    {folders.map((folder, index) => renderFolderItem(folder, index))}
                </div>
            </Container>
        </>
    );
} 