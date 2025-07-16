
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin SDK
initializeApp({
  credential: applicationDefault(), // or use serviceAccount if needed
});

const db = getFirestore();

async function seedPatients() {
  const batch = db.batch();
  const patientsCollection = db.collection('patients');

  for (let i = 1; i <= 100; i++) {
    const docRef = patientsCollection.doc(); // auto-ID
    const fakePhone = `5${Math.floor(1000000 + Math.random() * 8999999)}`; // 8-digit phone
    const randomDate = () => {
      const year = 1985 + Math.floor(Math.random() * 20); // 1985–2004
      const month = String(1 + Math.floor(Math.random() * 12)).padStart(2, '0');
      const day = String(1 + Math.floor(Math.random() * 28)).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    batch.set(docRef, {
      firstName: `FirstName ${i}`,
      lastName: `LastName ${i}`,
      phone: fakePhone,
      address: `Sample Address ${i}`,
      dob: randomDate(),
      patientHistory: `${Math.floor(Math.random() * 90 + 10)}`, // random 2-digit string
      createdAt: new Date(),      
    });
  }

  await batch.commit();
  console.log("✅ 100 patients added.");
}

seedPatients().catch(console.error);
