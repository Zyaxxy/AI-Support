import { WidgetHeader } from "../components/widget-header";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@workspace/ui/components/form";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { userAgent } from "next/server";
import { Doc } from "@workspace/backend/_generated/dataModel";

const organizationId = "123";//temporary

const formSchema = z.object({
    name: z.string().min(2,"Name is required"),
    email: z.string().email("Invalid email"),
});



export const WidgetAuthScreen = () => {
    const form = useForm<z.infer<typeof formSchema>>({  
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",   
            email: "",
        },
    });
    const createContactSession = useMutation(api.public.contactSessions.create);
    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        if (!organizationId) {
            return;
        }
        const metadata : Doc<"contactSessions">["metadata"] = {
            userAgent: navigator.userAgent,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            cookieEnabled: navigator.cookieEnabled,
            viewportSize: window.innerWidth + "x" + window.innerHeight,
            refferer: document.referrer || "",
        };
        const contactSessionId = await createContactSession({
            ...values,
            organizationId,
            expiresAt: Date.now(),
            metadata,
        });
        console.log({contactSessionId});
    }   

    
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
            <Form {...form}>
                <form 
                className="flex flex-1 flex-col gap-y-4 p-4"
                onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                className="h-10 bg-background-accent"
                                placeholder="Name"
                                {...field}
                                />
                            </FormControl> 
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                className="h-10 bg-background-accent"
                                placeholder="Email"
                                {...field}
                                />
                            </FormControl> 
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button 
                    disabled= {form.formState.isSubmitting}
                    type="submit"
                    className="size-lg"
                    >
                        Continue
                    </Button>   

                </form>
            </Form> 
        </>
    );
}