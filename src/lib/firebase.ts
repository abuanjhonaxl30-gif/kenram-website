import type { Firestore } from "firebase/firestore";

// "import type" lang ito — tinatanggal ito ng TypeScript sa compiled
// output, kaya walang dala-dalang Firebase code habang nagbi-build.

const firebaseConfig = {
  apiKey: "AIzaSyALDaamDgkiYsbi4wfVa14lWAK11NYy_BM",
  authDomain: "d-yu-rental-car.firebaseapp.com",
  projectId: "d-yu-rental-car",
  storageBucket: "d-yu-rental-car.firebasestorage.app",
  messagingSenderId: "239885887852",
  appId: "1:239885887852:web:9476285554009887ed2b49",
};

let dbInstance: Firestore | null = null;

// DYNAMIC import — hindi 'to tinatawag habang nagbi-build o sa server,
// kundi lang pag talagang tumakbo ito sa browser (pag-submit ng Contact
// form). Dito lang mino-load ang buong "firebase" package, kaya walang
// Firebase code na kailangang i-process ni Next.js habang nagbu-build.
export async function getDb(): Promise<Firestore> {
  if (typeof window === "undefined") {
    throw new Error(
      "Ang Firestore client SDK ay para lang sa browser — hindi dapat tawagin sa server."
    );
  }

  if (dbInstance) return dbInstance;

  const { initializeApp, getApps, getApp } = await import("firebase/app");
  const { initializeFirestore, getFirestore } = await import("firebase/firestore");

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

  try {
    dbInstance = initializeFirestore(app, {
      experimentalAutoDetectLongPolling: true,
    });
  } catch {
    dbInstance = getFirestore(app);
  }

  return dbInstance;
}