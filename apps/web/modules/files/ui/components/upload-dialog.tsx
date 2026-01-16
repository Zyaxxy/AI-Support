"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { useAction } from "convex/react";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@workspace/ui/components/dropzone";
import { api } from "@workspace/backend/_generated/api";
interface UploadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onFileUploaded?: () => void;
}
export const UploadDialog = ({ open, onOpenChange, onFileUploaded }: UploadDialogProps) => {
    const addFile = useAction(api.private.files.addFile);
    const [ uploadedFile, setUploadedFiles ] = useState<File[]>([]);
    const [ isUploading, setIsUploading ] = useState(false);
    const [ uploadForm , setUploadForms ] = useState({
        category : "",
        filename :"",
        
    });
    const handleFileDrop = (files: File[]) => {
        const file = files[0];
        if(file) {
            setUploadedFiles([file]);
            if(!uploadForm.filename){
                setUploadForms((prev) => ({
                    ...prev,
                    filename : file.name
                }));
            }
        }
    };

    const handleUpload = async () => {
        setIsUploading(true);
        try {
            const blob = uploadedFile[0];
            if(!blob) return;
            const filename = uploadForm.filename || blob.name;
            await addFile({
                bytes: await blob.arrayBuffer(),
                filename,
                mimeType: blob.type,
                category: uploadForm.category,
            });
            onOpenChange(false);
            setUploadedFiles([]);
            setUploadForms({
                category: "",
                filename: "",
            });
            onFileUploaded?.();
            handleCancel();
        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleCancel = () => {
        onOpenChange(false);
        setUploadedFiles([]);
        setUploadForms({
            category: "",
            filename: "",
        });
    };
    return (
        <> 
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Upload File</DialogTitle>
                    <DialogDescription>
                        Upload a file to the knowledge base for AI Powered Search and Retrieval.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="filename">File Name{" "}<span className="text-muted-foreground text-xs">(Optional)</span>
                        </Label>
                        <Input
                            className="w-full"  
                            id="filename"
                            value={uploadForm.filename}
                            onChange={(e) => setUploadForms((prev) => ({ ...prev, filename: e.target.value }))}
                            placeholder="Override Default Filename"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input
                            className="w-full"  
                            id="category"
                            value={uploadForm.category}
                            onChange={(e) => setUploadForms((prev) => ({ ...prev, category: e.target.value }))}
                            placeholder="e.g. Documentation,Support,FAQs"
                        />
    
                    </div>
                    <Dropzone  accept={{
                        "application/pdf": [".pdf"],
                        "text/markdown": [".md"],
                        "text/plain": [".txt"],
                        "text/csv": [".csv"],
                        "application/msword": [".doc"],
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
                        "application/vnd.ms-excel": [".xls"],
                        "application/vnd.ms-powerpoint": [".ppt"],
                        "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
                    }}
                    disabled={isUploading}
                    maxFiles={1}
                    onDrop={handleFileDrop}
                    src={uploadedFile}
                    >
                        <DropzoneEmptyState />
                        <DropzoneContent>
                        </DropzoneContent>
                    </Dropzone>
                </div>
                <DialogFooter>
                    <Button disabled={isUploading} variant="outline" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button
                        disabled={isUploading || uploadedFile.length === 0 || !uploadForm.category}
                        onClick={handleUpload}
                    >
                        {isUploading ? "Uploading..." : "Upload"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    );
};