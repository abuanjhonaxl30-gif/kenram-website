import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getDb } from "@/lib/firebase";

export type InquiryInput = {
  name: string;
  phone: string;
  vehicle: string;
  preferredDate: string;
  message: string;
};

export async function submitInquiry(input: InquiryInput): Promise<void> {
  await addDoc(collection(getDb(), "inquiries"), {
    ...input,
    status: "new",
    createdAt: serverTimestamp(),
  });
}