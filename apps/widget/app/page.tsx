"use client";

import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

export default function Page() {
  const users  = useQuery(api.users.getMany);
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center">
        apps/wigdet
        <div className="max-w-sm w-full mx-auto gap-y-4">
          {JSON.stringify(users, null, 2)}
        </div>
        
      </div>
    </div>
  )
}
