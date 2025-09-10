"use client";

import { useOrganization } from "@clerk/nextjs";
import { AuthLayout } from "../layouts/auth-layout";

export const OrganizationGuard = ({ children }: { children: React.ReactNode }) => {
    const { organization } = useOrganization();

    if (!organization) {
        return (
            <div>
                <AuthLayout>
                <h1>Create an organization</h1>
                <p>You must be part of an organization to access this page.</p>
                </AuthLayout>
            </div>
        );
    }
    return (
        <>
         {children}
        </>
    );
};