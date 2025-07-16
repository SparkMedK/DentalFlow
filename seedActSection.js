const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin SDK
initializeApp({
  credential: applicationDefault(), // or use serviceAccount if needed
});

const db = getFirestore();

const actSections = [
  {
    id: "section-1",
    title: "SECTION I: SOINS CONSERVATEURS, OBTURATIONS DENTAIRES DÉFINITIVES",
    acts: [
      {
        code: "DCH010010",
        designation:
          "Traitement global (l'obturation de plusieurs cavités simples sur la même face ne peut être comptée que pour une seule obturation composée intéressant deux faces)",
        cotation: "D15",
        honoraire: 45.0,
      },
      // Add more acts here...
    ],
  },
  // Add more sections if needed
];

async function seedActSections() {
  const batch = db.batch();
  const sectionsCollection = db.collection("actSections");

  for (const section of actSections) {
    const sectionRef = sectionsCollection.doc(section.id);
    batch.set(sectionRef, {
      title: section.title,
    });

    const actsCollection = sectionRef.collection("acts");

    for (const act of section.acts) {
      const actRef = actsCollection.doc(act.code);
      batch.set(actRef, {
        code: act.code,
        designation: act.designation,
        cotation: act.cotation,
        honoraire: act.honoraire,
      });
    }
  }

  await batch.commit();
  console.log("✅ Act sections and acts seeded to Firestore.");
}

seedActSections().catch(console.error);
