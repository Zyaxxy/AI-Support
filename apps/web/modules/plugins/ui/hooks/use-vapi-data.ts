import { useAction } from "convex/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@workspace/backend/_generated/api";

type PhoneNumbers = typeof api.private.vapi.getPhoneNumber._returnType; 
type Assistants = typeof api.private.vapi.getAssistants._returnType; 

export const useVapiPhoneNumbers = ():{
    phoneNumbers: PhoneNumbers;
    isLoading: boolean;
    error: Error | null;
} =>{
    const getPhoneNumbers = useAction(api.private.vapi.getPhoneNumber);
    const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumbers>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    useEffect(() => {
        const fetchPhoneNumbers = async () => {
            setIsLoading(true);            
            try {
                const response = await getPhoneNumbers();
                setPhoneNumbers(response);
            } catch (error) {
                setError(error as Error);
                toast.error("Failed to fetch phone numbers");
            } finally {
                setIsLoading(false);
            }
        };
        fetchPhoneNumbers();
    }, [getPhoneNumbers]);
    return { phoneNumbers, isLoading, error };
}


export const useVapiAssistants = ():{
    assistants: Assistants;
    isLoading: boolean;
    error: Error | null;
} =>{
    const getAssistants = useAction(api.private.vapi.getAssistants);
    const [assistants, setAssistants] = useState<Assistants>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    useEffect(() => {
        const fetchAssistants = async () => {
            setIsLoading(true);            
            try {
                const response = await getAssistants();
                setAssistants(response);
            } catch (error) {
                setError(error as Error);
                toast.error("Failed to fetch phone numbers");
            } finally {
                setIsLoading(false);
            }
        };
        fetchAssistants();
    }, [getAssistants]);
    return { assistants, isLoading, error };
}