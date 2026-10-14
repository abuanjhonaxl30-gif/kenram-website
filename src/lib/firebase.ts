import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeFirestore, getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyALDaamDgkiYsbi4wfVa14lWAK11NYy_BM",
  authDomain: "d-yu-rental-car.firebaseapp.com",
  projectId: "d-yu-rental-car",
  storageBucket: "d-yu-rental-car.firebasestorage.app",
  messagingSenderId: "239885887852",
  appId: "1:239885887852:web:9476285554009887ed2b49",
};

let dbInstance: Firestore | null = null;

// LAZY na ang pag-initialize — tumatakbo lang ito kapag talagang tinawag
// mula sa browser (hal. pag-submit ng Contact form). Kung hindi ito
// gawing lazy, agad na tatakbo ang Firestore client SDK sa server tuwing
// mag-i-import ng module na ito — kasama na habang nagbu-build ng
// production (`next build`), na siyang nagdudulot ng OOM crash sa
// machine na 'to.
export function getDb(): Firestore {
  if (typeof window === "undefined") {
    throw new Error(
      "Ang Firestore client SDK ay para lang sa browser — hindi dapat tawagin sa server."
    );
  }

  if (dbInstance) return dbInstance;

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