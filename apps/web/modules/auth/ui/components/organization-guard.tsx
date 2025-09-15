"use client";

import { useOrganization } from "@clerk/nextjs";
import { AuthLayout } from "../layouts/auth-layout";
import { OrgSelectView } from "../views/org-select-view";

export const OrganizationGuard = ({ children }: { children: React.ReactNode }) => {
    const { organization } = useOrganization();

    if (!organization) {
        return (
            <div>
                <AuthLayout>
                    <OrgSelectView />
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