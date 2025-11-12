"use client";
import { use } from "react";
import { WidgetView } from "@/module/widget/ui/views/widget-view";

interface Props  {
    searchParams: Promise <{
        organizationId: string;
    }>
};
const page = ({ searchParams }: Props) => {
  
  const { organizationId } = use(searchParams);


    return (
        <WidgetView organizationId={organizationId} />
    );
}

export default page;