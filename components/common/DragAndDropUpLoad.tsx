import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps, RcFile } from 'antd/es/upload/interface';
import { Upload } from 'antd';

const { Dragger } = Upload;

interface DragAndDropUploadProps {
    setFileListOutside: (fileList: RcFile[]) => void;
}
const DragAndDropUpload = ({ setFileListOutside }: DragAndDropUploadProps) => {
    const [fileList, setFileList] = useState<RcFile[]>([]);

    const props: UploadProps = {
        name: 'file',
        multiple: true,
        beforeUpload: (file: RcFile) => {
            setFileList((prev) => [...prev, file]);
            setFileListOutside([...fileList, file]);
            return false;
        },
        onDrop(e) {
    
        },
        onChange(info) {

        },
    };

    return (
        <div>
            <Dragger {...props} fileList={fileList}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibited from uploading company
                    data or other banned files.
                </p>
            </Dragger>
        </div>
    );
};

export default DragAndDropUpload;
