import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const data = await request.json();
        
        // Prepare log entry
        const logEntry = {
            timestamp: data.timestamp || new Date().toISOString(),
            fileName: data.fileName,
            fileSize: data.fileSize,
            fileSizeMB: data.fileSizeMB,
            reason: data.reason,
        };
        
        // Send to WordPress endpoint
        const wordpressEndpoint = `${process.env.NEXT_PUBLIC_WORDPRESS_ENDPOINT}/wp-json/file-logging/v1/rejection`;
        
        const response = await fetch(wordpressEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(logEntry),
        });
        
        if (!response.ok) {
            throw new Error(`WordPress API returned ${response.status}`);
        }
        
        const result = await response.json();
        
        return NextResponse.json({ 
            success: true, 
            message: 'File rejection logged successfully to WordPress' 
        });
        
    } catch (error) {
        console.error('Error logging file rejection to WordPress:', error);
        
        // Fallback: log locally if WordPress is unavailable
        try {
            const fs = await import('fs');
            const path = await import('path');
            
            const logsDir = path.join(process.cwd(), 'logs');
            if (!fs.existsSync(logsDir)) {
                fs.mkdirSync(logsDir, { recursive: true });
            }
            
            const logFilePath = path.join(logsDir, 'file-rejections.log');
            const logEntry = {
                timestamp: data.timestamp || new Date().toISOString(),
                fileName: data.fileName,
                fileSize: data.fileSize,
                fileSizeMB: data.fileSizeMB,
                reason: data.reason,
                userAgent: request.headers.get('user-agent'),
                ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
                note: 'Logged locally - WordPress unavailable'
            };
            
            const logLine = JSON.stringify(logEntry) + '\n';
            fs.appendFileSync(logFilePath, logLine, 'utf8');
            
            return NextResponse.json({ 
                success: true, 
                message: 'File rejection logged locally (WordPress unavailable)' 
            });
        } catch (fallbackError) {
            console.error('Fallback logging also failed:', fallbackError);
            return NextResponse.json(
                { success: false, error: 'Failed to log file rejection' },
                { status: 500 }
            );
        }
    }
}

