import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact | Kenram Car Rental",
  description:
    "Get in touch with Kenram Car Rental in Isulan, Sultan Kudarat — send an inquiry and we'll confirm availability and rate.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ car?: string }>;
}) {
  const { car } = await searchParams;
  const selectedCar = (car ?? "").slice(0, 80);

  return (
    <>
      <Navbar />
      <main>
        <Contact car={selectedCar} />
      </main>
      <Footer />
    </>
  );
}