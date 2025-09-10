"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { OrganizationSwitcher, SignInButton, UserButton } from "@clerk/nextjs";


export default function Page() {
  const users  = useQuery(api.users.getMany);
  const Add = useMutation(api.users.add);
  return (
    <>
    
      <div className="flex items-center justify-center min-h-svh">
        <div className="flex flex-col items-center justify-center">
        apps/web
        <UserButton />
        <OrganizationSwitcher hidePersonal/>
        <Button onClick={() => Add()}>Add</Button>
          <div className="max-w-sm w-full mx-auto gap-y-4">
          {JSON.stringify(users, null, 2)}
          </div>
        </div>
      </div>
   
  </>
  )
}
