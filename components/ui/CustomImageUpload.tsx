import React, { useState, useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { message } from 'antd';
import type { RcFile } from 'antd/es/upload';

interface CustomImageUploadProps {
    onUploadSuccess: (file: RcFile | null) => void;
}

const CustomImageUpload: React.FC<CustomImageUploadProps> = ({ onUploadSuccess }) => {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [_selectedFile, setSelectedFile] = useState<RcFile | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            if (!(file instanceof Blob)) {
                reject(new Error('Invalid file type: File must be a Blob or File'));
                return;
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            setPreviewImage(null);
            setSelectedFile(null);
            onUploadSuccess(null);
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            message.error('You can only upload image files!');
            return;
        }

        // Validate file size (5MB)
        if (file.size / 1024 / 1024 > 5) {
            message.error('Image must be smaller than 5MB!');
            return;
        }

        try {
            const rcFile: RcFile = Object.assign({
                uid: `${Date.now()}-${file.name}`,
                lastModifiedDate: file.lastModified,
                name: file.name,
                size: file.size,
                type: file.type,
                webkitRelativePath: file.webkitRelativePath,
            });

            // Tạo preview base64
            const base64 = await getBase64(rcFile);
            setPreviewImage(base64);
            setSelectedFile(rcFile);

            // Gọi callback truyền nguyên file RcFile (chứa data đầy đủ)
            onUploadSuccess(rcFile);

            message.success('Image selected, it will be uploaded on form submission.');
        } catch (error) {
            message.error('Failed to process the selected image.');
            console.error('Error:', error);
        }
    };

    const handleRemove = () => {
        setPreviewImage(null);
        setSelectedFile(null);
        onUploadSuccess(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handlePreviewClick = () => {
        if (previewImage) {
            const win = window.open();
            if (win) {
                win.document.write(`
                    <html>
                        <body style="margin:0;display:flex;justify-content:center;align-items:center;background:#000;">
                            <img src="${previewImage}" style="max-width:100%;max-height:100vh;" />
                        </body>
                    </html>
                `);
            }
        }
    };

    return (
        <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
            {previewImage ? (
                <div className="relative w-full h-full">
                    <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-md"
                        onClick={handlePreviewClick}
                        style={{ cursor: 'pointer' }}
                    />
                    <button
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        onClick={handleRemove}
                    >
                        ×
                    </button>
                </div>
            ) : (
                <label
                    className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
                    htmlFor="image-upload"
                >
                    <PlusOutlined className="text-2xl text-gray-400" />
                    <div className="mt-2 text-sm text-gray-600">Upload Image</div>
                    <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="!hidden"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                    />
                </label>
            )}
        </div>
    );
};

export default CustomImageUpload;
