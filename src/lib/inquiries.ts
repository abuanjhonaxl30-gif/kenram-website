export type InquiryInput = {
  name: string;
  phone: string;
  vehicle: string;
  preferredDate: string;
  message: string;
};

// DYNAMIC imports din dito — walang static na "import ... from firebase"
// sa taas ng file na 'to, kaya walang Firebase code na kasama sa server
// bundle. Tatakbo lang itong lahat sa browser, pag-submit ng form.
export async function submitInquiry(input: InquiryInput): Promise<void> {
  const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");
  const { getDb } = await import("@/lib/firebase");

  const db = await getDb();

  await addDoc(collection(db, "inquiries"), {
    ...input,
    status: "new",
    createdAt: serverTimestamp(),
  });
}