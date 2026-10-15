import { runQuery, docId } from "@/lib/firebase-admin";

export type Inquiry = {
  id: string;
  name: string;
  phone: string;
  email: string;
  destination: string;
  pickupDate: string;
  returnDate: string;
  date: string; // luma, para sa mga lumang inquiry
  message: string;
  createdAt: number;
};

export async function getInquiries(): Promise<Inquiry[]> {
  const docs = await runQuery({
    from: [{ collectionId: "inquiries" }],
    orderBy: [{ field: { fieldPath: "createdAt" }, direction: "DESCENDING" }],
    limit: 100,
  });

  return docs.map((d) => {
    const f = d.fields;
    return {
      id: docId(d.name),
      name: String(f.name ?? ""),
      phone: String(f.phone ?? ""),
      email: String(f.email ?? ""),
      destination: String(f.destination ?? ""),
      pickupDate: String(f.pickupDate ?? ""),
      returnDate: String(f.returnDate ?? ""),
      date: String(f.date ?? ""),
      message: String(f.message ?? ""),
      createdAt: Number(f.createdAt ?? 0),
    };
  });
}