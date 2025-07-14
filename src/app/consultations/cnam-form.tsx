import React from 'react';
import type { ConsultationWithPatient } from './page';
import { format } from 'date-fns';

interface CnamFormProps {
  consultation: ConsultationWithPatient;
}

const doctorInfo = {
  name: "Dr. John Doe",
  speciality: "Chirurgien-Dentiste",
  code: "12345"
};

export const CnamForm = React.forwardRef<HTMLDivElement, CnamFormProps>(({ consultation }, ref) => {
  const patient = consultation.patient;
  const patientName = patient?.name?.split(' ') || ['', ''];
  const lastName = patientName.slice(0, -1).join(' ') || '';
  const firstName = patientName.slice(-1).join('') || '';

  return (
    <div ref={ref} className="bg-white text-green-800 p-6 max-w-4xl mx-auto border border-green-600 font-sans text-sm">
      <div className="text-center font-bold text-lg border-b border-green-600 pb-2 mb-4">
        BULLETIN DE REMBOURSEMENT DES FRAIS DE SOINS
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="font-semibold">À REMPLIR PAR L'ASSURÉ SOCIAL</div>
          <div className="mt-2">
            <label className="block font-semibold">Identifiant unique</label>
            <div className="border border-green-600 h-8"></div>
          </div>

          <div className="mt-2 space-y-2">
            <div className="flex gap-4">
              <label><input type="checkbox" /> CNSS</label>
              <label><input type="checkbox" /> CNRPS</label>
              <label><input type="checkbox" /> Convention bilatérale</label>
            </div>
          </div>

          <div className="mt-4">
            <label className="block">Prénom</label>
            <div className="border border-green-600 h-6 p-1">{firstName}</div>

            <label className="block mt-2">Nom</label>
            <div className="border border-green-600 h-6 p-1">{lastName}</div>

            <label className="block mt-2">Adresse</label>
            <div className="border border-green-600 h-6 p-1">{patient?.address}</div>

            <label className="block mt-2">Code postal</label>
            <div className="border border-green-600 h-6"></div>
          </div>
        </div>

        <div>
          <div className="font-semibold">LE MALADE</div>

          <div className="mt-2 space-y-2">
            <div className="flex gap-4">
              <label><input type="checkbox" /> Enfant</label>
              <label><input type="checkbox" /> Père</label>
              <label><input type="checkbox" /> Mère</label>
              <label><input type="checkbox" /> Ascendant</label>
            </div>

            <label>Prénom</label>
            <div className="border border-green-600 h-6 p-1">{firstName}</div>

            <label className="mt-2">Nom</label>
            <div className="border border-green-600 h-6 p-1">{lastName}</div>

            <label className="mt-2">Date de naissance</label>
            <div className="border border-green-600 h-6 p-1">{patient?.dob ? format(new Date(patient.dob), 'dd/MM/yyyy') : ''}</div>

            <label className="mt-2">N° du téléphone portable</label>
            <div className="border border-green-600 h-6 p-1">{patient?.phone}</div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="text-center font-bold border-b border-green-600 pb-1 mb-2">
          CONSULTATIONS ET ACTES DE SOINS DENTAIRES
        </div>
        <div className="text-xs text-center mb-2">
          Il est indispensable d’indiquer le dent traité, de désigner les actes pratiqués ou se référant aux codes et cotations de la nomenclature officielle
        </div>

        <table className="w-full table-fixed border border-green-600 text-xs">
          <thead>
            <tr className="bg-green-100">
              <th className="border border-green-600 p-1">DATE</th>
              <th className="border border-green-600 p-1">DENT</th>
              <th className="border border-green-600 p-1">CODE ACTE</th>
              <th className="border border-green-600 p-1">COTATION</th>
              <th className="border border-green-600 p-1">HONORAIRES</th>
              <th className="border border-green-600 p-1">CODE Professionnel de santé</th>
              <th className="border border-green-600 p-1">CACHET ET SIGNATURE</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-green-600 h-6 text-center">{format(new Date(consultation.date), 'dd/MM/yyyy')}</td>
              <td className="border border-green-600 text-center">{consultation.toothNumber}</td>
              <td className="border border-green-600 text-center">{consultation.actCode}</td>
              <td className="border border-green-600 text-center">{consultation.reason}</td>
              <td className="border border-green-600 text-center">{consultation.price.toFixed(2)} TND</td>
              <td className="border border-green-600 text-center">{doctorInfo.code}</td>
              <td className="border border-green-600 text-center text-xs align-middle">Dr. {doctorInfo.name}<br/>{doctorInfo.speciality}</td>
            </tr>
            {Array.from({ length: 4 }).map((_, idx) => (
              <tr key={idx}>
                <td className="border border-green-600 h-6"></td>
                <td className="border border-green-600"></td>
                <td className="border border-green-600"></td>
                <td className="border border-green-600"></td>
                <td className="border border-green-600"></td>
                <td className="border border-green-600"></td>
                <td className="border border-green-600"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-xs border-t border-green-600 pt-2">
        <strong>Très important :</strong> Veuillez déposer ce formulaire au centre régional ou local le plus proche de votre domicile dans un délai ne dépassant pas les <strong>60 jours</strong> de la date de soins.
      </div>
    </div>
  );
});

CnamForm.displayName = 'CnamForm';
