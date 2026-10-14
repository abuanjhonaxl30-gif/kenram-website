// One-time script to populate the "vehicles" collection in Firestore.
// Run this once from your project root with: node scripts/seed-fleet.mjs
//
// IMPORTANT: your Firestore security rules must temporarily allow writes
// for this to work. See the instructions that came with this file.

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyALDaamDgkiYsbi4wfVa14lWAK11NYy_BM",
  authDomain: "d-yu-rental-car.firebaseapp.com",
  projectId: "d-yu-rental-car",
  storageBucket: "d-yu-rental-car.firebasestorage.app",
  messagingSenderId: "239885887852",
  appId: "1:239885887852:web:9476285554009887ed2b49",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const vehicles = [
  {
    id: "wigo",
    name: "Toyota Wigo",
    transmission: "Automatic",
    seats: 5,
    goodFor: "City errands, light on fuel",
    image: "/fleet/wigo.jpg",
    available: true,
    order: 1,
  },
  {
    id: "vios",
    name: "Toyota Vios",
    transmission: "Automatic",
    seats: 5,
    goodFor: "Everyday sedan comfort",
    image: "/fleet/vios.jpg",
    available: true,
    order: 2,
  },
  {
    id: "avanza",
    name: "Toyota Avanza",
    transmission: "Automatic",
    seats: 7,
    goodFor: "Family trips, extra cargo room",
    image: "/fleet/avanza.jpg",
    available: true,
    order: 3,
  },
  {
    id: "innova",
    name: "Toyota Innova",
    transmission: "Manual",
    seats: 8,
    goodFor: "Long drives, rougher roads",
    image: "/fleet/innova.jpg",
    available: true,
    order: 4,
  },
  {
    id: "hiace",
    name: "Toyota Hiace",
    transmission: "Manual",
    seats: 15,
    goodFor: "Group travel, out-of-town tours",
    image: "/fleet/hiace.jpg",
    available: true,
    order: 5,
  },
];

for (const vehicle of vehicles) {
  const { id, ...data } = vehicle;
  await setDoc(doc(db, "vehicles", id), data);
  console.log(`Seeded: ${id}`);
}

console.log("Done. All 5 vehicles are now in Firestore.");
process.exit(0);
