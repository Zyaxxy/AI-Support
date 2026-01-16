"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Upload File</DialogTitle>
                    <DialogDescription>
                        Upload a file to the knowledge base for AI Powered Search and Retrieval.
                    </DialogDescription>
                </DialogHeader>
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
                <Dropzone onDrop={handleFileDrop}>
                    <DropzoneContent>
                        
                    </DropzoneContent>
                </Dropzone>
            </DialogContent>
        </Dialog>
    );
};