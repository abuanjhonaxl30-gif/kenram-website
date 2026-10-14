import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Fleet from "@/components/Fleet";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Available Cars | Kenram Car Rental",
  description:
    "Browse Kenram Car Rental's fleet in Isulan, Sultan Kudarat — sedans, MPVs, and vans for self-drive or with-driver rental.",
};

// Dynamic (hindi static) ang page na ito — kinukuha ang Firestore data sa
// bawat request, sa runtime, hindi sa build time. Iniiwasan nito ang
// static-generation step na siyang nagdudulot ng OOM crash habang
// nagbu-build (napansin natin na doon palaging nangyayari ang crash).
export const dynamic = "force-dynamic";

export default function FleetPage() {
  return (
    <>
      <Navbar />
      <main>
        <Fleet />
      </main>
      <Footer />
    </>
  );
}