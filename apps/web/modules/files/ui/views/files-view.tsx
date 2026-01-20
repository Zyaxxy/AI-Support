"use client";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@workspace/ui/components/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@workspace/ui/components/table"
import { 
    FileIcon, 
    MoreHorizontalIcon, 
    PlusIcon, 
    Trash2Icon, 
    DownloadIcon, 
    ExternalLinkIcon,
    SearchIcon,
    FilterIcon,
    CheckCircle2Icon,
    ClockIcon,
    XCircleIcon,
    FileTextIcon,
    ImageIcon,
    FileSpreadsheetIcon,
} from "lucide-react";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinitescrolltrigger";
import { usePaginatedQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import type { PublicFile } from "@workspace/backend/private/files";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Input } from "@workspace/ui/components/input";
import { UploadDialog } from "../components/upload-dialog";
import { useState, useMemo } from "react";
import { DeleteFileDialog } from "../components/delete-file-dialog";
import { cn } from "@workspace/ui/lib/utils";

// Get icon based on file type
const getFileIcon = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('pdf') || lowerType.includes('doc')) return FileTextIcon;
    if (lowerType.includes('png') || lowerType.includes('jpg') || lowerType.includes('jpeg') || lowerType.includes('gif')) return ImageIcon;
    if (lowerType.includes('xls') || lowerType.includes('csv')) return FileSpreadsheetIcon;
    return FileIcon;
};

// Skeleton loader component
const FileRowSkeleton = () => (
    <TableRow>
        <TableCell className="px-6 py-4">
            <div className="flex items-center gap-3">
                <div className="h-4 w-4 animate-pulse rounded bg-muted" />
                <div className="h-4 w-32 animate-pulse rounded bg-muted md:w-48" />
            </div>
        </TableCell>
        <TableCell className="px-6 py-4">
            <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
        </TableCell>
        <TableCell className="px-6 py-4">
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
        </TableCell>
        <TableCell className="px-6 py-4">
            <div className="h-6 w-16 animate-pulse rounded bg-muted" />
        </TableCell>
        <TableCell className="px-6 py-4">
            <div className="h-8 w-8 animate-pulse rounded bg-muted" />
        </TableCell>
    </TableRow>
);

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
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<PublicFile | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

    // Filter files based on search and category
    const filteredFiles = useMemo(() => {
        let result = files.results || [];
        
        if (searchQuery) {
            result = result.filter(file => 
                file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                file.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                file.category?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        
        if (categoryFilter) {
            result = result.filter(file => file.category === categoryFilter);
        }
        
        return result;
    }, [files.results, searchQuery, categoryFilter]);

    // Get unique categories
    const categories = useMemo(() => {
        const cats = new Set<string>();
        files.results?.forEach(file => {
            if (file.category) cats.add(file.category);
        });
        return Array.from(cats);
    }, [files.results]);

    const handleDeleteClick = (file: PublicFile) => {
        setSelectedFile(file);
        setDeleteDialogOpen(true);
    }
    
    const handleFileDeleted = () => {
        setSelectedFile(null);
    }

    const handleDownload = (file: PublicFile) => {
        if (file.url) {
            window.open(file.url, '_blank');
        }
    };

    const getStatusBadge = (status: "ready" | "processing" | "error") => {
        switch (status) {
            case "ready":
                return (
                    <Badge variant="outline" className="border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400">
                        <CheckCircle2Icon className="mr-1 h-3 w-3" />
                        Ready
                    </Badge>
                );
            case "processing":
                return (
                    <Badge variant="outline" className="border-blue-500/50 bg-blue-500/10 text-blue-700 dark:text-blue-400">
                        <ClockIcon className="mr-1 h-3 w-3" />
                        Processing
                    </Badge>
                );
            case "error":
                return (
                    <Badge variant="outline" className="border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400">
                        <XCircleIcon className="mr-1 h-3 w-3" />
                        Error
                    </Badge>
                );
        }
    };

    return (
        <>
        <DeleteFileDialog file={selectedFile} open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} onDeleted={handleFileDeleted} />
        <UploadDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} />
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-muted/30 via-background to-muted/30 p-4 md:p-8">
            <div className="mx-auto w-full max-w-7xl">
                {/* Header Section */}
                <div className="space-y-4">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <h1 className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-3xl font-bold text-transparent md:text-5xl">
                                Knowledge Base
                            </h1>
                            <p className="text-sm text-muted-foreground md:text-base">
                                Manage your files and documents with AI-powered search
                            </p>
                        </div>
                        <Button 
                            onClick={() => { setUploadDialogOpen(true) }}
                            className="group relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 shadow-lg transition-all hover:shadow-xl"
                        >
                            <PlusIcon className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" /> 
                            <span className="hidden sm:inline">Upload File</span>
                            <span className="sm:hidden">Upload</span>
                        </Button>
                    </div>
                </div>
                {/* Search and Filter Section */}
                <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                    <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input 
                            placeholder="Search files by name, type, or category..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    {categories.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant={categoryFilter === null ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCategoryFilter(null)}
                            >
                                All
                            </Button>
                            {categories.map((category) => (
                                <Button
                                    key={category}
                                    variant={categoryFilter === category ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setCategoryFilter(category)}
                                >
                                    {category}
                                </Button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Files Table */}
                <div className="mt-6 overflow-hidden rounded-xl border bg-background/50 shadow-lg backdrop-blur-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b bg-muted/50">
                                <TableHead className="px-6 py-4 font-semibold">Name</TableHead>
                                <TableHead className="px-6 py-4 font-semibold">Type</TableHead>
                                <TableHead className="px-6 py-4 font-semibold">Size</TableHead>
                                <TableHead className="px-6 py-4 font-semibold">Status</TableHead>
                                <TableHead className="px-6 py-4 font-semibold">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(() => {
                                if (isLoadingFirstPage) {
                                    return Array.from({ length: 5 }).map((_, i) => (
                                        <FileRowSkeleton key={i} />
                                    ));
                                }
                                
                                if (filteredFiles.length === 0) {
                                    return (
                                        <TableRow>
                                            <TableCell className="h-64 text-center" colSpan={5}>
                                                <div className="flex flex-col items-center justify-center space-y-3">
                                                    <div className="rounded-full bg-muted p-4">
                                                        <FileIcon className="h-8 w-8 text-muted-foreground" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="font-medium">
                                                            {searchQuery || categoryFilter ? "No files found" : "No files uploaded yet"}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {searchQuery || categoryFilter 
                                                                ? "Try adjusting your search or filters" 
                                                                : "Upload your first file to get started"
                                                            }
                                                        </p>
                                                    </div>
                                                    {!searchQuery && !categoryFilter && (
                                                        <Button
                                                            onClick={() => setUploadDialogOpen(true)}
                                                            variant="outline"
                                                        >
                                                            <PlusIcon className="mr-2 h-4 w-4" />
                                                            Upload File
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }

                                return filteredFiles.map((file) => {
                                    const FileIconComponent = getFileIcon(file.type);
                                    return (
                                        <TableRow 
                                            className="group transition-colors hover:bg-muted/50" 
                                            key={file.id}
                                        >
                                            <TableCell className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="rounded-md bg-primary/10 p-2 transition-colors group-hover:bg-primary/20">
                                                        <FileIconComponent className="h-4 w-4 text-primary" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="font-medium">{file.name}</p>
                                                        {file.category && (
                                                            <p className="text-xs text-muted-foreground">
                                                                {file.category}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <Badge className="uppercase" variant="outline">
                                                    {file.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-muted-foreground">
                                                {file.size}
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                {getStatusBadge(file.status)}
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button 
                                                            className="size-8 p-0 transition-all hover:bg-muted" 
                                                            variant="ghost" 
                                                            size="sm"
                                                        >
                                                            <MoreHorizontalIcon className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        {file.url && (
                                                            <>
                                                                <DropdownMenuItem 
                                                                    onClick={() => handleDownload(file)}
                                                                >
                                                                    <DownloadIcon className="mr-2 size-4" />
                                                                    Download
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem 
                                                                    onClick={() => window.open(file.url!, '_blank')}
                                                                >
                                                                    <ExternalLinkIcon className="mr-2 size-4" />
                                                                    Open in New Tab
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                            </>
                                                        )}
                                                        <DropdownMenuItem 
                                                            className="text-destructive focus:text-destructive"
                                                            onClick={() => { handleDeleteClick(file) }}
                                                        >
                                                            <Trash2Icon className="mr-2 size-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            })()}
                        </TableBody>
                    </Table>
                    {!isLoadingFirstPage && filteredFiles.length > 0 && (
                        <InfiniteScrollTrigger
                            ref={topElementRef}
                            canLoadMore={canLoadMore}
                            isLoadingMore={isLoadingMore}
                            onLoadMore={handleLoadMore}
                        />
                    )}
                </div>
            </div>
        </div>
        </>
    );
}
