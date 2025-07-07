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
    const fakeBirth = new Date(1990 + Math.floor(Math.random() * 20), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28));

    batch.set(docRef, {
      fullName: `Test Patient ${i}`,
      phone: fakePhone,
      address: `Sample Address ${i}`,
      birthday: fakeBirth,
      createdAt: new Date(),
    });
  }

  await batch.commit();
  console.log("✅ 100 patients added.");
}

seedPatients().catch(console.error);
