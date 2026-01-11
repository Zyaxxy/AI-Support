"use client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@workspace/ui/components/table"
import { FileIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinitescrolltrigger";
import { usePaginatedQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import type { PublicFile } from "@workspace/backend/private/files";
import { Button } from "@workspace/ui/components/button";
export const FilesView = () => {
    const files = usePaginatedQuery(
        api.private.files.listfiles,
        {},
        {
            initialNumItems: 10
        }
    )
    const {
        topElementRef,
        handleLoadMore,
        canLoadMore,
        isLoadingMore,
        isLoadingFirstPage
    } = useInfiniteScroll({
        status: files.status,
        loadmore: files.loadMore,
        loadSize: 10,
    })
    return (
        <div className="flex min-h-screen flex-col bg-muted p-8">
            <div className="mx-auto w-full max-w-screen-md">
                <div className="space-y-2">
                    <h1 className="text-2xl md:text-4xl">Knowledge Base</h1>
                    <p className="text-muted-foreground">
                        Manage your files here
                    </p>
                </div>
                <div className="mt-8 rounded-lg border bg-background">
                    <div className="flex items-center justify-end border-b px-6 py-4">
                        <Button onClick={() => { }}><PlusIcon className="mr-2 h-4 w-4" /> Add New File</Button>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="px-6 py-4 font-medium">Name</TableHead>
                                <TableHead className="px-6 py-4 font-medium">Type</TableHead>
                                <TableHead className="px-6 py-4 font-medium">Size</TableHead>
                                <TableHead className="px-6 py-4 font-medium">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(() => {
                                if (isLoadingFirstPage) {
                                    return (
                                        <TableRow>
                                            <TableCell className="h-24  text-center" colSpan={4}>
                                                Loading...
                                            </TableCell>
                                        </TableRow>
                                    )
                                }
                                if (files.results.length === 0) {
                                    return (
                                        <TableRow>
                                            <TableCell className="h-24  text-center" colSpan={4}>
                                                No files found
                                            </TableCell>
                                        </TableRow>
                                    )
                                }

                                return files.results.map((file) => (
                                    <TableRow className="hover:bg-muted/50" key={file.id}>
                                        <TableCell className="px-6 py-4 font-medium">
                                            <div className="flex items-center gap-3">
                                                <FileIcon className="mr-2 h-4 w-4" />
                                                <span>{file.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 font-medium">
                                            <div className="flex items-center gap-3">
                                                <FileIcon className="mr-2 h-4 w-4" />
                                                <span>{file.type}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 font-medium">
                                            <div className="flex items-center gap-3">
                                                <FileIcon className="mr-2 h-4 w-4" />
                                                <span>{file.size}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <Button onClick={() => { }}><Trash2Icon className="mr-2 h-4 w-4" /> Delete</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            })()}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
