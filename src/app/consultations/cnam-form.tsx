import React from 'react';
import { ConsultationWithPatient } from './page';
import { format } from 'date-fns';

interface CnamFormProps {
  consultation: ConsultationWithPatient;
}

const doctorInfo = {
  name: "Dr. John Doe",
  speciality: "Chirurgien-Dentiste",
};

export const CnamForm = React.forwardRef<HTMLDivElement, CnamFormProps>(({ consultation }, ref) => {
  const patient = consultation.patient;

  return (
    <div ref={ref} className="p-8 bg-white text-black font-serif text-xs">
      <div className="w-[210mm] min-h-[297mm] mx-auto">
        <div className="grid grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="border border-black p-2">
            <div className="bg-green-500 text-white text-center font-bold p-1">A REMPLIR PAR LES PROFESSIONNELS DE SANTE</div>
            <div className="border border-black mt-2 p-1">
              <div className="font-bold">Soins effectués ou Prescrits dans le cadre de :</div>
              <div className="grid grid-cols-4 gap-2 mt-1">
                <div className="flex items-center gap-1"><div className="w-4 h-4 border border-black"></div> APCI</div>
                <div className="flex items-center gap-1"><div className="w-4 h-4 border border-black"></div> MO</div>
                <div className="flex items-center gap-1"><div className="w-4 h-4 border border-black"></div> Hospitalisation</div>
                <div className="flex items-center gap-1"><div className="w-4 h-4 border border-black"></div> Suivi de Grossesse</div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  Préciser le code APCI: <div className="border-b border-black h-4"></div>
                </div>
                <div>
                  Date prévue d'accouchement: <div className="border-b border-black h-4"></div>
                </div>
              </div>
            </div>
            
            <div className="mt-2">
              <span className="font-bold">NOM ET PRENOM DU MALADE:</span>
              <span className="ml-2 border-b border-dotted border-black flex-1">{patient?.name} - (né(e) le {patient?.dob ? format(new Date(patient.dob), 'dd/MM/yyyy') : ''})</span>
            </div>
             <div className="mt-1">
              <span className="font-bold">ADRESSE:</span>
              <span className="ml-2 border-b border-dotted border-black flex-1">{patient?.address}</span>
            </div>
             <div className="mt-1">
              <span className="font-bold">CIN:</span>
              <span className="ml-2 border-b border-dotted border-black flex-1">{patient?.cin}</span>
            </div>

            {/* ACTES MEDICAUX */}
            <div className="border border-black mt-2">
                <div className="bg-green-500 text-white text-center font-bold p-1">ACTES MEDICAUX</div>
                <div className="text-center text-xs italic">Joindre obligatoirement la prescription précisant l'acte effectué</div>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-black">
                            <th className="border-r border-black p-1">DATE</th>
                            <th className="border-r border-black p-1">CODE ACTE</th>
                            <th className="border-r border-black p-1">N° DENT</th>
                            <th className="border-r border-black p-1">HONORAIRES</th>
                            <th className="p-1">CACHET ET SIGNATURE</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border-r border-black p-1 h-8 text-center">{format(new Date(consultation.date), 'dd/MM/yyyy')}</td>
                            <td className="border-r border-black p-1 text-center">{consultation.actCode}</td>
                            <td className="border-r border-black p-1 text-center">{consultation.toothNumber}</td>
                            <td className="border-r border-black p-1 text-center">{consultation.price.toFixed(2)} TND</td>
                            <td className="p-1 text-center align-top">
                                Dr. {doctorInfo.name}<br/>
                                {doctorInfo.speciality}
                            </td>
                        </tr>
                        {[...Array(3)].map((_, i) => (
                           <tr key={i}>
                                <td className="border-r border-black p-1 h-8"></td>
                                <td className="border-r border-black p-1"></td>
                                <td className="border-r border-black p-1"></td>
                                <td className="border-r border-black p-1"></td>
                                <td className="p-1"></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Other Sections */}
            {['ACTES PARAMEDICAUX', 'BIOLOGIE'].map(title => (
                <div key={title} className="border border-black mt-2">
                    <div className="bg-green-500 text-white text-center font-bold p-1">{title}</div>
                     <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-black">
                                <th className="border-r border-black p-1">DATE</th>
                                {title === 'BIOLOGIE' ? <th className="border-r border-black p-1">MONTANT</th> : <><th className="border-r border-black p-1">CODE ACTE</th><th className="border-r border-black p-1">COTA-TION</th><th className="border-r border-black p-1">HONOR-AIRES</th></>}
                                <th className="border-r border-black p-1">CODE Profes-sionnel de santé</th>
                                <th className="p-1">CACHET ET SIGNATURE</th>
                            </tr>
                        </thead>
                         <tbody>
                            {[...Array(2)].map((_, i) => (
                               <tr key={i}>
                                    <td className="border-r border-black p-1 h-6"></td>
                                    <td className="border-r border-black p-1"></td>
                                    <td className="border-r border-black p-1"></td>
                                     {title !== 'BIOLOGIE' && <td className="border-r border-black p-1"></td>}
                                    <td className="p-1"></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
            
            <div className="bg-green-500 text-white p-2 mt-2 text-xs">
              <div className="flex items-start gap-1"><input type="checkbox" className="mt-0.5"/> Ce bulletin doit être rempli soigneusement et avec la plus grande précision.</div>
              <div className="flex items-start gap-1"><input type="checkbox" className="mt-0.5"/> Ce bulletin ne peut servir que pour un seul malade.</div>
              <div className="flex items-start gap-1"><input type="checkbox" className="mt-0.5"/> Toute fraude ou fausse déclaration est passible des poursuites judiciaires et des sanctions prévues par la réglementation en vigeur.</div>
            </div>

          </div>
          {/* Right Column */}
          <div className="flex flex-col">
            {['ACCOUCHEMENT* / HOSPITALISATION**', 'PHARMACIE'].map(title => (
                 <div key={title} className="border border-black mb-4">
                    <div className="bg-green-500 text-white text-center font-bold p-1">{title}</div>
                    <table className="w-full border-collapse">
                         <thead>
                            <tr className="border-b border-black">
                                <th className="border-r border-black p-1">DATE</th>
                                <th className="border-r border-black p-1">{title === 'PHARMACIE' ? 'MONTANT' : 'CODE HOSPITALISATION'}</th>
                                <th className="border-r border-black p-1">{title === 'PHARMACIE' ? 'CODE du professionnel de santé' : 'FORFAIT'}</th>
                                {title !== 'PHARMACIE' && <th className="border-r border-black p-1">CODE clinique</th>}
                                <th className="p-1">CACHET ET SIGNATURE</th>
                            </tr>
                        </thead>
                        <tbody>
                             {[...Array(2)].map((_, i) => (
                               <tr key={i}>
                                    <td className="border-r border-black p-1 h-6"></td>
                                    <td className="border-r border-black p-1"></td>
                                    <td className="border-r border-black p-1"></td>
                                    {title !== 'PHARMACIE' && <td className="border-r border-black p-1"></td>}
                                    <td className="p-1"></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {title.startsWith('ACCOUCHEMENT') && <div className="text-xs px-1 text-center">** en cas d'accouchement joindre obligatoirement l'extrait de naissance du nouveau né</div>}
                </div>
            ))}

            <div className="flex-1 flex items-center justify-center border-4 border-dashed border-gray-400">
                <div className="text-5xl font-bold text-gray-400 transform -rotate-12">
                COLLER ICI LES VIGNETTES
                </div>
            </div>
            
             <div dir="rtl" className="bg-green-500 text-white p-2 mt-4 text-xs">
              <div className="flex items-start gap-1"><input type="checkbox" className="mt-0.5"/> يجب تحرير هذه المطبوعة بكل دقة وعناية.</div>
              <div className="flex items-start gap-1"><input type="checkbox" className="mt-0.5"/> لا يمكن استعمال هذه البطاقة إلا لمريض واحد.</div>
              <div className="flex items-start gap-1"><input type="checkbox" className="mt-0.5"/> كل تدليس أو تزوير يعرض صاحبه للتتبعات العدلية والعقوبات المنصوص عليها في القانون الجاري به العمل.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

CnamForm.displayName = 'CnamForm';
