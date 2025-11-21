"use client";
import { LoaderIcon } from "lucide-react";
import { WidgetHeader } from "../components/widget-header";
import { useAtomValue, useSetAtom } from "jotai";
import { errorMessageAtom , loadingMessageAtom , organizationIdAtom,screenAtom } from "../../atoms/widget-atoms";
import { useEffect, useState } from "react";
import { useAction } from "convex/react";
import { api } from "@workspace/backend/_generated/api";




type InitStep = "storage" | "org" | "session" | "settings" | "vapi" | "done";

export const WidgetLoadingScreen = ({ organizationId }: { organizationId: string | null }) => {
  const [step, setStep] = useState<InitStep>("org");
  const [session, setSession] = useState<string|null>(null);
  const loadingMessage = useAtomValue(loadingMessageAtom);
  const setOrganizationId = useSetAtom(organizationIdAtom);
  const setLoadingMessage = useSetAtom(loadingMessageAtom);
  const SetErrorMessage = useSetAtom(errorMessageAtom); 
  const setScreen = useSetAtom(screenAtom);
  const validateOrganization = useAction(api.public.organizations.validate);


  useEffect(() => { 
    if(step != "org"){
      return;
    }
    setLoadingMessage("Loading organization...");

    if(!organizationId){
      SetErrorMessage("Organization ID is required");
      setScreen("error");
      return;
    }

    setLoadingMessage("Validating organization...");

    validateOrganization({organizationId})
      .then((result) => {
      if(result.valid){
        setOrganizationId(organizationId);
        setLoadingMessage("Loading session...");
        setScreen("loading");
        setStep("session");
      }else{
        SetErrorMessage(result.reason || "Invalid organization");
        setScreen("error");
      }
    })
    .catch((error) => {
      SetErrorMessage(error.message || "Something went wrong");
      setScreen("error");
    });
  },[step, organizationId, SetErrorMessage, setScreen]);  
  
  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6">
            <p className="text-4xl font-bold">Hey there👋</p>
            <p className="text-lg font-bold">
                Let&apos;s get you started
            </p>
        </div>
        </WidgetHeader>
        <div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4 text-muted-foreground">
            <LoaderIcon className="animate-spin"/>
            <p className="text-sm font-bold">
                {loadingMessage || "Loading..."}
            </p>

        </div>
    </>
  );
};