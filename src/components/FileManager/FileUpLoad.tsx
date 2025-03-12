'use client';
import React, { useRef, useState, SyntheticEvent } from 'react';
import { Toast } from 'primereact/toast';
import { FileUpload, FileUploadHeaderTemplateOptions, FileUploadSelectEvent, FileUploadUploadEvent, FileUploadHandlerEvent } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';
import { Image } from 'primereact/image';
import { ItemTemplateOptions } from 'primereact/fileupload';
import type { FolderType } from '@/lib/types';

type Folder = {
    folder: FolderType;
}

export default function FileUpLoad({ folder }: Folder) {
    const toast = useRef<Toast>(null);
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef<FileUpload>(null);

    const onTemplateSelect = (e: FileUploadSelectEvent) => {
        let _totalSize = totalSize;
        const files = e.files;

        // Using proper indexing for FileList-like objects
        for (let i = 0; i < files.length; i++) {
            _totalSize += files[i].size || 0;
        }

        setTotalSize(_totalSize);
    };

    const onTemplateUpload = (e: FileUploadUploadEvent) => {
        let _totalSize = 0;
        e.files.forEach((file: File) => {
            _totalSize += file.size || 0;
        });
        setTotalSize(_totalSize);
        toast.current?.show({
            severity: 'info',
            summary: 'Success',
            detail: 'File Uploaded',
        });
    };

    // Updated callback signature to match PrimeReact's expectation
    const onTemplateRemove = (file: File, callback: (event: SyntheticEvent) => void) => {
        setTotalSize(totalSize - file.size);
        // Pass a synthetic event or create a mock one if needed
        const mockEvent = new Event('mock') as unknown as SyntheticEvent;
        callback(mockEvent);
    };

    const onTemplateClear = () => {
        setTotalSize(0);
    };

    const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const value = totalSize / 1024 / 1024;
        const formatedValue =
            fileUploadRef && fileUploadRef.current
                ? fileUploadRef.current.formatSize(totalSize)
                : '0 B';
        return (
            <div
                className={`flex ${className}`}
            >
                {chooseButton}
                {uploadButton}
                {cancelButton}
                <div className="flex align-items-center gap-3 ml-auto">
                    <span>{formatedValue} / 50 MB</span>
                    <ProgressBar
                        value={value}
                        showValue={true}
                        style={{ width: '10rem', height: '20px' }}
                        color={value > 50 ? 'red' : 'blue'}
                    ></ProgressBar>
                </div>
            </div>
        );
    };

    const itemTemplate = (file: object, options: ItemTemplateOptions) => {
        const fileObj = file as File;

        let url = '';
        switch (fileObj.type) {
            case 'image/jpeg':
            case 'image/png':
            case 'image/jpg':
            case 'image/gif':
            case 'image/svg+xml':
            case 'image/webp':
                url = URL.createObjectURL(fileObj);
                break;
            case 'application/pdf':
                url = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FF0000"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM13 15c0 .55-.45 1-1 1H9v2H7v-6h5c.55 0 1 .45 1 1v2zm-1-8V3.5L17.5 9H14c-.55 0-1-.45-1-1z"/><text x="7" y="14" fill="white" font-size="5">PDF</text></svg>';
                break;
            case 'text/plain':
                url = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23808080"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><text x="7" y="14" fill="white" font-size="5">TXT</text></svg>';
                break;
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            case 'application/msword':
                url = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%232B579A"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><text x="7" y="14" fill="white" font-size="5">DOC</text></svg>';
                break;
            case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
            case 'application/vnd.ms-powerpoint':
                url = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23C43E1C"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><text x="7" y="14" fill="white" font-size="5">PPT</text></svg>';
                break;
            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            case 'application/vnd.ms-excel':
                url = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23217346"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><text x="7" y="14" fill="white" font-size="5">XLS</text></svg>';
                break;
            case 'text/markdown':
                url = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23000000"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><text x="7" y="14" fill="white" font-size="5">MD</text></svg>';
                break;
            default:
                url = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/svg+xml" viewBox="0 0 24 24" fill="gray"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/></svg>';
                break;
        }
        return (
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 w-9/12" >
                    <Image
                        alt={fileObj.name}
                        role="presentation"
                        src={url}
                    />
                    <span className="flex px-2 items-center w-full justify-between">
                        {fileObj.name}
                        <small className='text-lg'>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <div className='flex h-20 items-center gap-3'>
                    <Tag
                        value={options.formatSize}
                        severity="warning"
                        className="px-3 py-4"
                    />
                    <Button
                        type="button"
                        icon="pi pi-times"
                        className="p-button-outlined p-button-rounded p-button-danger ml-auto"
                        onClick={(e) => {
                            // Use the actual event from the button click
                            onTemplateRemove(fileObj, () => options.onRemove(e));
                        }}
                    />
                </div>
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <div className="flex flex-col items-center justify-center">
                <i
                    className="pi pi-file mt-3 p-5"
                    style={{
                        fontSize: '5em',
                        borderRadius: '50%',
                        backgroundColor: 'var(--surface-b)',
                        color: 'var(--surface-d)',
                    }}
                ></i>
                <span
                    style={{ fontSize: '1.2em', color: 'yellow' }}
                    className="my-5"
                >
                    Arraste e solte o arquvo aqui
                </span>
            </div>
        );
    };

    const chooseOptions = {
        icon: 'pi pi-fw pi-file',
        iconOnly: true,
        className: '',
    };
    const uploadOptions = {
        icon: 'pi pi-fw pi-cloud-upload',
        iconOnly: true,
        className:
            'custom-upload-btn p-button-success p-button-rounded p-button-outlined',
    };
    const cancelOptions = {
        icon: 'pi pi-fw pi-times',
        iconOnly: true,
        className:
            'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined',
    };

    const customUploader = async (event: FileUploadHandlerEvent) => {
        const formData = new FormData();

        // Adiciona os arquivos
        for (const file of event.files) {
            formData.append('file', file);
        }

        // Adiciona parâmetros extras
        formData.append('userId', '123');
        formData.append('folderKey', folder?.key || '');

        // Faz a requisição manualmente
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            console.error('Erro no upload');
        }
    };

    return (
        <div>
            <Toast ref={toast}></Toast>

            <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
            <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
            <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

            <FileUpload
                name="file"
                ref={fileUploadRef}
                customUpload
                uploadHandler={customUploader}
                accept="image/*,application/pdf,.txt,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                maxFileSize={50_000_000} // 5_000_000 = 5MB
                itemTemplate={itemTemplate}
                emptyTemplate={emptyTemplate}
                headerTemplate={headerTemplate}
                multiple={false}
                onUpload={onTemplateUpload}
                onSelect={onTemplateSelect}
                onError={onTemplateClear}
                onClear={onTemplateClear}
                chooseOptions={chooseOptions}
                uploadOptions={uploadOptions}
                cancelOptions={cancelOptions}
            />
        </div>
    );
}
