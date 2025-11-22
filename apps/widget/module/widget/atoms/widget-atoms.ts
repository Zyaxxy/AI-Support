import { atom } from "jotai"
import { WidgetScreen } from "../types";
import { atomFamily, atomWithStorage } from "jotai/utils";
import { CONTACTS_SESSION_KEY } from "../constants";

export const screenAtom = atom<WidgetScreen>("loading");
export const errorMessageAtom = atom<string | null>(null);
export const loadingMessageAtom = atom<string | null>(null);

export const contactSessionIdAtomFamily = atomFamily((organizationId: string) => atomWithStorage(`${CONTACTS_SESSION_KEY}_${organizationId}`, null));





export const organizationIdAtom = atom<string | null>(null);