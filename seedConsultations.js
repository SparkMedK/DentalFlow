const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin SDK
initializeApp({
  credential: applicationDefault(), // or use serviceAccount if needed
});

const db = getFirestore();

async function seedConsultations() {
  const batch = db.batch();
  const consultationsCollection = db.collection('consultations');



  const randomDate = () => {
    const year = 2024 + Math.floor(Math.random() * 2); // 2024–2025
    const month = String(1 + Math.floor(Math.random() * 12)).padStart(2, '0');
    const day = String(1 + Math.floor(Math.random() * 28)).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const patientIds = [
    "FpUMPRb652RUhN2D8AKR",
    "G4QA8Do7dxobtyQrLuz1"  
  ];
  const randomTime = () => {
    const hour = String(9 + Math.floor(Math.random() * 8)).padStart(2, '0'); // 09–16
    return `${hour}:00`;
  };

  const randomNumberString = () => `${Math.floor(Math.random() * 90 + 10)}`; // 2-digit string

  let count = 0;


  // Add 3 consultations for each patient
  for (const patientId of patientIds) {

    for (let i = 0; i < 10; i++) {
      const docRef = consultationsCollection.doc(); // auto-ID
      batch.set(docRef, {
        patientId,
        date: randomDate(),
        time: randomTime(),
        reason: randomNumberString(),
        treatmentPlan: randomNumberString(),
        followUpActions: randomNumberString(),
        status: "Completed",
        price: 100,
        createdAt: new Date(),
      });
      count++;
    
  }


  await batch.commit();
  console.log(`✅ ${count} consultations added.`);
}

}
seedConsultations().catch(console.error);
