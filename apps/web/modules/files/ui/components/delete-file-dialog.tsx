"use client"
import { Dialog, DialogContent,DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@workspace/ui/components/dialog"
import { useMutation } from "convex/react"
import { api } from "@workspace/backend/_generated/api"
import { useState } from "react"
import type { PublicFile } from "@workspace/backend/private/files"
import { Button } from "@workspace/ui/components/button"
import { FileIcon } from "lucide-react"

interface DeleteFileDialogProps {
    file: PublicFile | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onDeleted?: () => void
}

export const DeleteFileDialog = ({ file, open, onOpenChange, onDeleted }: DeleteFileDialogProps) => {
    const deleteFile = useMutation(api.private.files.deleteFile)
    const [isDeleting, setIsDeleting] = useState(false)
    const handleDelete = async () => {
        if (!file) return
        setIsDeleting(true)
        try {
            await deleteFile({entryId: file.id})
            onDeleted?.()
            onOpenChange(false)
        } catch (error) {
            console.error(error)
        } finally {
            setIsDeleting(false)
        }
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Delete File</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this file?.This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                {file && (<div className="py-4">
                    <div className="rounded-lg border bg-muted/50 p-4">
                        <div className="flex items-center gap-2">
                            <FileIcon className="mr-2 h-4 w-4" />
                            <p className="font-medium">{file.name}</p>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            Type:{file.type.toLocaleUpperCase()} | Size:{file.size}
                        </p>
                    </div>
                </div>)}
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
                        Cancel
                    </Button>
                    <Button variant="destructive" disabled={isDeleting || !file} onClick={handleDelete}>
                        {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}       