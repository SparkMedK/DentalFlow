
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin SDK
initializeApp({
  credential: applicationDefault(),
});

const db = getFirestore();

const actChapters = [
      {
        "id": "isolated",
        "title": "ACTES ISOLES",
        "sections": [
          {
            "id": "isolated-section",
            "title": "ACTES ISOLES",
            "groups": [
              {
                "title": "",
                "acts": [
                  {
                    "code": "DCH000010",
                    "designation": "Anesthésie locale isolée (sans acte associé)",
                    "cotation": "D6",
                    "honoraire": 18.0
                  },
                  {
                    "code": "DCH000020",
                    "designation": "Anesthésie loco-régionale (sans acte associé)",
                    "cotation": "D10",
                    "honoraire": 30.0
                  },
                  {
                    "code": "DCH000030",
                    "designation": "Dent par technique intra buccale, film occlusal ou rétro-alvéolaire",
                    "cotation": "Z8",
                    "honoraire": 15.0
                  },
                  {
                    "code": "DCH000040",
                    "designation": "Bilan radiologique complet par technique intrabucale (Status), quel que soit le nombre de clichés (minimum 6 clichés)",
                    "cotation": "Z25",
                    "honoraire": 45.0
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "chapter-1",
        "title": "CHAPITRE: DENTS ET GENCIVES",
        "sections": [
          {
            "id": "section-1",
            "title": "SECTION I: SOINS CONSERVATEURS, OBTURATIONS DENTAIRES DÉFINITIVES",
            "groups": [
              {
                "title": "Cavité simple",
                "acts": [
                  {
                    "code": "DCH010010",
                    "designation": "Traitement global (l'obturation de plusieurs cavités simples sur la même face ne peut être comptée que pour une seule obturation composée intéressant deux faces)",
                    "cotation": "D15",
                    "honoraire": 45.0
                  },
                  {
                    "code": "DCH010020",
                    "designation": "Traitement global (l'obturation de plusieurs cavités simples sur la même face ne peut être comptée que pour une seule obturation composée intéressant deux faces), si dent permanente d'un enfant de moins de 14 ans",
                    "cotation": "D18",
                    "honoraire": 54.0
                  },
                  {
                    "code": "DCH010030",
                    "designation": "Supplément pour technique adhésive quel que soit le nombre de faces traitées",
                    "cotation": "D10",
                    "honoraire": 30.0
                  }
                ]
              },
              {
                "title": "Cavité composée",
                "acts": [
                  {
                    "code": "DCH010040",
                    "designation": "Traitement global intéressant deux faces",
                    "cotation": "D23",
                    "honoraire": 69.0
                  },
                  {
                    "code": "DCH010050",
                    "designation": "Traitement global intéressant deux faces, si dent permanente d'un enfant de moins de 14 ans",
                    "cotation": "D26",
                    "honoraire": 78.0
                  },
                  {
                    "code": "DCH010060",
                    "designation": "Traitement global intéressant trois faces et plus",
                    "cotation": "D30",
                    "honoraire": 90.0
                  },
                  {
                    "code": "DCH010070",
                    "designation": "Traitement global intéressant trois faces et plus, si dent permanente d'un enfant de moins de 14 ans",
                    "cotation": "D36",
                    "honoraire": 108.0
                  }
                ]
              },
              {
                "title": "Soins de la pulpe et des canaux",
                "acts": [
                  {
                    "code": "DCH010080",
                    "designation": "Coiffage pulpaire pulpectomie coronaire simple et à l'exclusion de l'obturation définitive",
                    "cotation": "D10",
                    "honoraire": 30.0
                  },
                  {
                    "code": "DCH010090",
                    "designation": "Pulpectomie coronaire et radiculaire avec obturation des canaux – Groupe incisivo-canin",
                    "cotation": "D18",
                    "honoraire": 54.0
                  },
                  {
                    "code": "DCH010100",
                    "designation": "Pulpectomie coronaire et radiculaire avec obturation des canaux – Groupe prémolaire",
                    "cotation": "D23",
                    "honoraire": 69.0
                  },
                  {
                    "code": "DCH010110",
                    "designation": "Pulpectomie coronaire et radiculaire avec obturation des canaux – Groupe molaire",
                    "cotation": "D30",
                    "honoraire": 90.0
                  },
                  {
                    "code": "DCH010120",
                    "designation": "Restauration d'une perte de substance intéressant deux faces et plus d'une dent par matériaux insérés en phase plastique avec ancrage radiculaire",
                    "cotation": "D50",
                    "honoraire": 150.0
                  }
                ]
              }
            ]
          },
          {
            "id": "section-2",
            "title": "SECTION II: SOINS CHIRURGICAUX",
            "groups": [
              {
                "title": "Article 1: Extraction et traitement des lésions osseuses et gingivales",
                "acts": [
                  { "code": "DCH020010", "designation": "Résection de capuchon muqueux d'une dent de sagesse", "cotation": "D10", "honoraire": 30.0 },
                  { "code": "DCH020020", "designation": "Incision d'abcès et drainage", "cotation": "D10", "honoraire": 30.0 }
                ]
              },
              {
                "title": "Extraction dentaire",
                "acts": [
                  { "code": "DCH020030", "designation": "Extraction dentaire simple ... curetage alvéolaire ...", "cotation": "D15", "honoraire": 45.0 },
                  { "code": "DCH020040", "designation": "Extraction de plusieurs dents au cours d'une même séance : chaque dent suivante", "cotation": "D5", "honoraire": 15.0 },
                  { "code": "DCH020050", "designation": "Majoration pour la première extraction au cours d'accidents inflammatoires", "cotation": "D6", "honoraire": 18.0 },
                  { "code": "DCH020060", "designation": "Majoration pour chacune des suivantes", "cotation": "D3", "honoraire": 9.0 },
                  { "code": "DCH020070", "designation": "Extraction de la ou des racines d'une dent par alvéolectomie", "cotation": "D20", "honoraire": 60.0 },
                  { "code": "DCH020080", "designation": "Extraction d'une dent en malposition", "cotation": "D20", "honoraire": 60.0 },
                  { "code": "DCH020090", "designation": "Tamponnement alvéolaire pour hémorragie post-opératoire dans une autre séance", "cotation": "D10", "honoraire": 30.0 }
                ]
              },
              {
                "title": "Extraction chirurgicale",
                "acts": [
                  { "code": "DCH020100", "designation": "Extraction chirurgicale d'une dent enclavée", "cotation": "D40", "honoraire": 120.0 },
                  { "code": "DCH020110", "designation": "Extraction chirurgicale d'une dent incluse", "cotation": "D60", "honoraire": 180.0 },
                  { "code": "DCH020120", "designation": "Extraction chirurgicale d'un odontoïde", "cotation": "D50", "honoraire": 150.0 },
                  { "code": "DCH020130", "designation": "Extraction d'une dent en désinclusion non enclavée", "cotation": "D25", "honoraire": 75.0 },
                  { "code": "DCH020140", "designation": "Extraction d'une dent en désinclusion en position palatine ou linguale", "cotation": "D40", "honoraire": 120.0 },
                  { "code": "DCH020150", "designation": "Extraction d'une dent ectopique et incluse", "cotation": "D80", "honoraire": 240.0 },
                  { "code": "DCH020160", "designation": "Germectomie", "cotation": "D30", "honoraire": 90.0 },
                  { "code": "DCH020180", "designation": "Extraction chirurgicale d'une dent permanente, incluse, traitement radiculaire, réimplantation, contention – Une dent", "cotation": "D100", "honoraire": 300.0 },
                  { "code": "DCH020190", "designation": "Extraction chirurgicale ... Deux dents", "cotation": "D150", "honoraire": 450.0 },
                  { "code": "DCH020200", "designation": "Dégagement chirurgical de la couronne d'une dent permanente incluse", "cotation": "D40", "honoraire": 120.0 },
                  { "code": "DCH020210", "designation": "Régularisation localisée d'une crête alvéolaire", "cotation": "D15", "honoraire": 45.0 },
                  { "code": "DCH020220", "designation": "Régularisation étendue de la crête alvéolaire (y compris suture)", "cotation": "D20", "honoraire": 60.0 },
                  { "code": "DCH020230", "designation": "Régularisation de crête concernant un hémimaxillaire ou de canine à canine", "cotation": "D30", "honoraire": 90.0 },
                  { "code": "DCH020240", "designation": "Curetage périapical par trépanation vestibulaire avec ou sans résection apicale (traitement du canal compris)", "cotation": "D40", "honoraire": 120.0 }
                ]
              },
              {
                "title": "Exérèse chirurgicale d'un kyste",
                "acts": [
                  { "code": "DCH020250", "designation": "Kyste de petit volume par voie alvéolaire élargie", "cotation": "D20", "honoraire": 60.0 },
                  { "code": "DCH020260", "designation": "Kyste étendu aux apex de deux dents nécessitant une trépanation osseuse", "cotation": "D30", "honoraire": 90.0 },
                  { "code": "DCH020270", "designation": "Kyste étendu à un segment important du maxillaire", "cotation": "D60", "honoraire": 180.0 },
                  { "code": "DCH020280", "designation": "Kyste corono-dentaire", "cotation": "D40", "honoraire": 120.0 },
                  { "code": "DCH020290", "designation": "Curetage d'un kyste par marsupialisation", "cotation": "D25", "honoraire": 75.0 }
                ]
              },
              {
                "title": "Article 2: Chirurgie Pré-prothétique",
                "acts": [
                  { "code": "DCH020300", "designation": "Désinsertion musculaire vestibulaire partielle", "cotation": "D50", "honoraire": 150.0 },
                  { "code": "DCH020310", "designation": "Désinsertion musculaire étendue à tout le vestibule", "cotation": "D60", "honoraire": 180.0 },
                  { "code": "DCH020320", "designation": "Désinsertion musculaire du plancher de la bouche avec section des myohyoïdiens", "cotation": "D80", "honoraire": 240.0 },
                  { "code": "DCH020330", "designation": "Approfondissement d'un vestibule par greffe cutanée", "cotation": "D50", "honoraire": 150.0 },
                  { "code": "DCH020340", "designation": "Désépaississement d'une crête flottante ou d'une hyperplasie localisée", "cotation": "D30", "honoraire": 90.0 },
                  { "code": "DCH020350", "designation": "Désépaississement d'une crête flottante ou d'une hyperplasie étendue", "cotation": "D40", "honoraire": 120.0 }
                ]
              },
              {
                "title": "Article 3: Parties molles, glandes, maxillaires, articulations et tumeurs, langue",
                "acts": [
                  { "code": "DCH020360", "designation": "Incision d'un abcès de la langue ou du plancher de la bouche par voie buccale", "cotation": "D20", "honoraire": 60.0 },
                  { "code": "DCH020370", "designation": "Excision et suture d'une bride fibreuse ou du frein hypertrophié", "cotation": "D20", "honoraire": 60.0 },
                  { "code": "DCH020380", "designation": "Incision d'un abcès ou phlegmon de la base de la langue ou du plancher de la bouche par voie sous-hyoïdienne", "cotation": "D40", "honoraire": 120.0 },
                  { "code": "DCH020390", "designation": "Excision par voie buccale d'un kyste du plancher de la bouche", "cotation": "D30", "honoraire": 90.0 },
                  { "code": "DCH020400", "designation": "Injection de substance de contraste dans les glandes salivaires (cliché non compris)", "cotation": "D15", "honoraire": 45.0 }
                ]
              },
              {
                "title": "Traitement chirurgical par voie buccale d'une lithiase salivaire",
                "acts": [
                  { "code": "DCH020410", "designation": "Ablation d'un calcul antérieur par incision muqueuse simple", "cotation": "D20", "honoraire": 60.0 },
                  { "code": "DCH020420", "designation": "Ablation d'un calcul postérieur par dissection complète du canal excréteur", "cotation": "D30", "honoraire": 90.0 },
                  { "code": "DCH020430", "designation": "Traitement chirurgical d'une lésion bénigne d'une glande salivaire autre que parotide", "cotation": "D50", "honoraire": 150.0 },
                  { "code": "DCH020440", "designation": "Traitement des fractures des procès alvéolaires avec conservation des dents mobiles et déplacées, traitement radiculaire non compris", "cotation": "D50", "honoraire": 150.0 },
                  { "code": "DCH020450", "designation": "Traitement orthopédique d'une fracture complète sans déplacement (appareillage compris)", "cotation": "D60", "honoraire": 180.0 },
                  { "code": "DCH020460", "designation": "Curetage et ablation des séquestres pour ostéites et nécroses des maxillaires circonscrites à la région alvéolaire", "cotation": "D25", "honoraire": 75.0 },
                  { "code": "DCH020470", "designation": "Traitement orthopédique de luxation uni ou bilatérale récente de la mandibule", "cotation": "D20", "honoraire": 60.0 },
                  { "code": "DCH020480", "designation": "Prélèvement en vue d'un examen de laboratoire d'une lésion intrabuccale de l'oropharynx", "cotation": "D15", "honoraire": 45.0 },
                  { "code": "DCH020490", "designation": "Exérèse d'une tumeur bénigne de la muqueuse buccale (épulis)", "cotation": "D25", "honoraire": 75.0 },
                  { "code": "DCH020500", "designation": "Diathermo-coagulation d'une leucoplasie, d'un lupus ou d'une tumeur bénigne", "cotation": "D15", "honoraire": 45.0 }
                ]
              },
              {
                "title": "Article 4: Traumatismes",
                "acts": [
                  { "code": "DCH020510", "designation": "Contention sur arc d'une dent subluxée après réduction", "cotation": "D80", "honoraire": 240.0 },
                  { "code": "DCH020520", "designation": "Contention sur arc de deux dents subluxées ou plus, après réduction", "cotation": "D100", "honoraire": 300.0 },
                  { "code": "DCH020530", "designation": "Contention d'une fracture alvéolodentaire du groupe incisivo-canin, après réduction", "cotation": "D120", "honoraire": 360.0 },
                  { "code": "DCH020540", "designation": "Traitement orthopédique d'une fracture mandibulaire non déplacée (par arc mandibulaire)", "cotation": "D150", "honoraire": 450.0 },
                  { "code": "DCH020550", "designation": "Blocage bimaxillaire sur arcs maxillaire et mandibulaire d'une fracture mandibulaire non déplacée", "cotation": "D200", "honoraire": 600.0 }
                ]
              }
            ]
          },
          {
            "id": "section-3",
            "title": "SECTION III: HYGIÈNE BUCCO-DENTAIRE ET TRAITEMENT DES PARODONTOPATHIES",
            "groups": [
              {
                "title": "Actes généraux",
                "acts": [
                  { "code": "DCH030010", "designation": "Détartrage complet sus gingival (quel que soit le nombre de séances)", "cotation": "D20", "honoraire": 60.0 },
                  { "code": "DCH030020", "designation": "Traitement des gingivites : détartrage sus et sous gingival, curetage et surfaçage radiculaire (quatres séances maximum)", "cotation": "D25", "honoraire": 75.0 },
                  { "code": "DCH030030", "designation": "Gingivectomie quelle que soit la technique – Partielle", "cotation": "D25", "honoraire": 75.0 },
                  { "code": "DCH030040", "designation": "Gingivectomie étendue à une hémi arcade ou de canine à canine", "cotation": "D50", "honoraire": 150.0 },
                  { "code": "DCH030050", "designation": "Intervention à lambeaux de une à trois dents (curetage, surfaçage radiculaire et suture)", "cotation": "D50", "honoraire": 150.0 },
                  { "code": "DCH030060", "designation": "Intervention à lambeaux par dent supplémentaire", "cotation": "D20", "honoraire": 60.0 },
                  { "code": "DCH030070", "designation": "Intervention à lambeau et traitement d'une lésion osseuse par comblement et suture", "cotation": "D150", "honoraire": 450.0 },
                  { "code": "DCH030080", "designation": "Greffe gingivale libre avec prélèvement du greffon et suture", "cotation": "D150", "honoraire": 450.0 },
                  { "code": "DCH030090", "designation": "Hémi-section d'une molaire inférieure ou amputation radiculaire d'une molaire supérieure avec régularisation", "cotation": "D35", "honoraire": 105.0 },
                  { "code": "DCH030100", "designation": "Ligature métallique dans les parodontopathies", "cotation": "D25", "honoraire": 75.0 },
                  { "code": "DCH030110", "designation": "Attelle métallique dans les parodontopathies", "cotation": "D40", "honoraire": 120.0 },
                  { "code": "DCH030120", "designation": "Prothèse attelle de contention quel que soit le nombre de dents ou de crochets", "cotation": "D70", "honoraire": 210.0 },
                  { "code": "DCH030130", "designation": "Modification de l'articulé par meulage sélectif", "cotation": "D75", "honoraire": 225.0 },
                  { "code": "DCH030140", "designation": "Frénectomie (excision du frein labial)", "cotation": "D50", "honoraire": 150.0 }
                ]
              }
            ]
          },
          {
            "id": "section-4",
            "title": "SECTION IV: PÉDODONTIE - PRÉVENTION",
            "groups": [
              {
                "title": "Actes de prévention et pédodontie",
                "acts": [
                  { "code": "DCH040010", "designation": "Couronne pédodontique préformée", "cotation": "D30", "honoraire": 90.0 },
                  { "code": "DCH040020", "designation": "Résine de scellement des puits et fissures (sealants)", "cotation": "D15", "honoraire": 45.0 },
                  { "code": "DCH040030", "designation": "Application topique de fluor par gouttière préfabriquée (5 séances max) – par séance", "cotation": "D10", "honoraire": 30.0 },
                  { "code": "DCH040040", "designation": "Application topique de fluor par gouttière thermoformée", "cotation": "D35", "honoraire": 105.0 },
                  { "code": "DCH040050", "designation": "Mainteneur d'espace fixe", "cotation": "D35", "honoraire": 105.0 },
                  { "code": "DCH040060", "designation": "Appareillage fixe pour blocage d'éruption", "cotation": "D50", "honoraire": 150.0 },
                  { "code": "DCH040070", "designation": "Guide d'éruption", "cotation": "D50", "honoraire": 150.0 },
                  { "code": "DCH040080", "designation": "Appareil d'interception mobile (appareillage et suivi max 12 mois)", "cotation": "D200", "honoraire": 600.0 }
                ]
              }
            ]
          },
          {
            "id": "section-5",
            "title": "SECTION V: ORTHOPÉDIE DENTO-FACIALE",
            "groups": [
              {
                "title": "Examens et diagnostics",
                "acts": [
                  { "code": "DCH050010", "designation": "Examen avec prise d'empreintes, diagnostic et durée probable du traitement", "cotation": "D20", "honoraire": 60.0 },
                  { "code": "DCH050020", "designation": "Analyse céphalométrique (en supplément)", "cotation": "D15", "honoraire": 45.0 }
                ]
              },
              {
                "title": "Actes de prévention et de traitement",
                "acts": [
                  { "code": "DCH050030", "designation": "Traitement précoce de dysmorphose squelettique (appareillage et suivi max 15 mois) – Exemple : masque de Delaire, monobloc, etc.", "cotation": "D250", "honoraire": 750.0 },
                  { "code": "DCH050040", "designation": "Rééducation du comportement musculaire neuro-musculaire et physiologique (série de 12 séances renouvelables) – par séance", "cotation": "D8", "honoraire": 24.0 }
                ]
              },
              {
                "title": "Traitement orthodontique",
                "acts": [
                  { "code": "DCH050050", "designation": "Traitement orthodontique ne dépassant pas 6 mois", "cotation": "D200", "honoraire": 600.0 },
                  { "code": "DCH050060", "designation": "Traitement orthodontique ne dépassant pas 12 mois", "cotation": "D300", "honoraire": 900.0 },
                  { "code": "DCH050070", "designation": "Traitement des dysmorphoses importantes – Première année (max 3 années)", "cotation": "D350", "honoraire": 1050.0 },
                  { "code": "DCH050080", "designation": "Traitement des dysmorphoses importantes – Deuxième année", "cotation": "D350", "honoraire": 1050.0 },
                  { "code": "DCH050090", "designation": "Traitement des dysmorphoses importantes – Troisième année", "cotation": "D350", "honoraire": 1050.0 }
                ]
              },
              {
                "title": "Contention après traitement orthodontique",
                "acts": [
                  { "code": "DCH050100", "designation": "Contention – Première année", "cotation": "D100", "honoraire": 300.0 },
                  { "code": "DCH050110", "designation": "Contention – Deuxième année", "cotation": "D50", "honoraire": 150.0 },
                  { "code": "DCH050120", "designation": "Disjonction intermaxillaire rapide pour dysmorphose maxillaire en cas d'insuffisance respiratoire confirmée", "cotation": "D180", "honoraire": 540.0 }
                ]
              },
              {
                "title": "Mise en place d'une dent permanente incluse",
                "acts": [
                  { "code": "DCH050130", "designation": "Mise en place sur l'arcade d'une dent permanente incluse – Une dent", "cotation": "D150", "honoraire": 450.0 },
                  { "code": "DCH050140", "designation": "Mise en place sur l'arcade d'une dent permanente incluse – Deux dents", "cotation": "D200", "honoraire": 600.0 }
                ]
              },
              {
                "title": "Orthopédie des malformations consécutives à la fente labiopalatine ou à la division palatine",
                "acts": [
                  { "code": "DCH050150", "designation": "Forfait annuel par année", "cotation": "D250", "honoraire": 750.0 },
                  { "code": "DCH050160", "designation": "En période d'attente", "cotation": "D60", "honoraire": 180.0 },
                  { "code": "DCH050170", "designation": "Préparation orthodontique à la chirurgie orthognatique au-delà du 17ème anniversaire – par an (max 2 ans)", "cotation": "D350", "honoraire": 1050.0 }
                ]
              }
            ]
          },
          {
            "id": "section-6",
            "title": "SECTION VI: PROTHÈSE DENTAIRE",
            "groups": [
              {
                "title": "Prothèses dentaires adjointes",
                "acts": [
                  { "code": "DCH060010", "designation": "De 1 à 3 dents", "cotation": "D60", "honoraire": 180.0 },
                  { "code": "DCH060020", "designation": "De 4 à 7 (par dent supplémentaire)", "cotation": "D5", "honoraire": 15.0 },
                  { "code": "DCH060030", "designation": "De 8 dents", "cotation": "D100", "honoraire": 300.0 },
                  { "code": "DCH060040", "designation": "De 9 à 11 (par dent supplémentaire)", "cotation": "D5", "honoraire": 15.0 },
                  { "code": "DCH060050", "designation": "De 12 à 14 dents", "cotation": "D150", "honoraire": 450.0 },
                  { "code": "DCH060060", "designation": "Appareillage complet haut et bas", "cotation": "D300", "honoraire": 900.0 },
                  { "code": "DCH060070", "designation": "Dent prothétique contre-plaquée sur plaque base en matière plastique, supplément", "cotation": "D15", "honoraire": 45.0 },
                  { "code": "DCH060080", "designation": "Plaque base métallique coulée, supplément", "cotation": "D100", "honoraire": 300.0 },
                  { "code": "DCH060090", "designation": "Dent prothétique contreplaquée ou massive soudée sur plaque base métallique, supplément", "cotation": "D20", "honoraire": 60.0 },
                  { "code": "DCH060100", "designation": "Réparation de fracture sur la plaque base en matière plastique", "cotation": "D15", "honoraire": 45.0 },
                  { "code": "DCH060110", "designation": "Dents ou crochets ajoutés ou remplacés sur appareil en matière plastique – Premier élément", "cotation": "D15", "honoraire": 45.0 },
                  { "code": "DCH060120", "designation": "Élément suivant sur l'appareil", "cotation": "D5", "honoraire": 15.0 },
                  { "code": "DCH060130", "designation": "Dents ou crochets soudés, ajoutés ou remplacés sur un appareil métallique, par élément", "cotation": "D20", "honoraire": 60.0 },
                  { "code": "DCH060140", "designation": "Réparation de fracture de la plaque base métallique, non compris, s'il y a lieu le remontage des dents sur matière plastique", "cotation": "D20", "honoraire": 60.0 },
                  { "code": "DCH060150", "designation": "Dents ou crochets remontés sur matière plastique après réparation de la plaque base métallique – par élément", "cotation": "D5", "honoraire": 15.0 },
                  { "code": "DCH060160", "designation": "Rebasage", "cotation": "D25", "honoraire": 75.0 },
                  { "code": "DCH060170", "designation": "Attachement pour prothèse (par élément)", "cotation": "D140", "honoraire": 420.0 },
                  { "code": "DCH060180", "designation": "Remplacement de facette ou dent à tube", "cotation": "D15", "honoraire": 45.0 },
                  { "code": "DCH060190", "designation": "Préparation dentaire pro prothétique pour plaque métallique", "cotation": "D50", "honoraire": 150.0 }
                ]
              },
              {
                "title": "Prothèses dentaires conjointes",
                "acts": [
                  { "code": "DCH060200", "designation": "Couronne dentaire et élément de bridge", "cotation": "D55", "honoraire": 165.0 },
                  { "code": "DCH060210", "designation": "Dent à tenon ne faisant pas intervenir une technique de coulée", "cotation": "D40", "honoraire": 120.0 },
                  { "code": "DCH060220", "designation": "Dent à tenon radiculaire faisant intervenir une technique de coulée", "cotation": "D50", "honoraire": 150.0 },
                  { "code": "DCH060240", "designation": "Dépose et/ou repose d'une prothèse fixe – par élément pilier", "cotation": "", "honoraire": null }
                ]
              }
            ]
          },
          {
            "id": "section-7",
            "title": "SECTION VII : OCCLUSODONTIE",
            "groups": [
              {
                "title": "Occlusodontie",
                "acts": [
                  { "code": "DCH070010", "designation": "Analyse occlusale", "cotation": "D120", "honoraire": 360.0 },
                  { "code": "DCH070020", "designation": "Par soustraction", "cotation": "D70", "honoraire": 210.0 },
                  { "code": "DCH070030", "designation": "Par addition (résine composite)", "cotation": "D100", "honoraire": 300.0 },
                  { "code": "DCH070040", "designation": "Gouttière occlusale (traitement, mise en place et suivi)", "cotation": "D200", "honoraire": 600.0 },
                  { "code": "DCH070050", "designation": "Réduction des subluxations et des luxations discales temporo-mandibulaires", "cotation": "D50", "honoraire": 150.0 }
                ]
              }
            ]
          },
          {
            "id": "section-8",
            "title": "SECTION VIII : ÉCLAIRCISSEMENT-BLANCHIMENT",
            "groups": [
              {
                "title": "Éclaircissement - Blanchiment",
                "acts": [
                  { "code": "DCH080010", "designation": "Blanchiment par voie externe (max de 5 séances) par séance", "cotation": "D40", "honoraire": 120.0 },
                  { "code": "DCH080020", "designation": "Blanchiment par voie interne (max de 3 séances) par dent et par séance", "cotation": "D30", "honoraire": 90.0 }
                ]
              }
            ]
          },
          {
            "id": "section-9",
            "title": "SECTION IX : IMPLANTOLOGIE",
            "groups": [
              {
                "title": "Implantologie",
                "acts": [
                  { "code": "DCH090010", "designation": "Chirurgie de mise en place d'un implant (implant non compris)", "cotation": "D200", "honoraire": 600.0 },
                  { "code": "DCH090020", "designation": "Par implant supplémentaire", "cotation": "D70", "honoraire": 210.0 },
                  { "code": "DCH090030", "designation": "Réalisation d'une prothèse implanto-portée (pièces prothétiques non comprises) par élément", "cotation": "D100", "honoraire": 300.0 }
                ]
              }
            ]
          }
        ]
      }
    ]
;

async function seedActChapters() {
  const batch = db.batch();
  const chaptersCollection = db.collection("actChapters");

  for (const chapter of actChapters) {
    const chapterRef = chaptersCollection.doc(chapter.id);
    // Create a new object for the chapter document that only contains the title
    const chapterDocData = { title: chapter.title };
    batch.set(chapterRef, chapterDocData);

    for (const section of chapter.sections) {
        const sectionRef = chapterRef.collection("sections").doc(section.id);
        const sectionDocData = { title: section.title };
        batch.set(sectionRef, sectionDocData);

        for (const group of section.groups) {
            const groupRef = sectionRef.collection("groups").doc(); // Auto-ID for group
            const groupDocData = {
                title: group.title,
                acts: group.acts, // Store acts as an array within the group document
            };
            batch.set(groupRef, groupDocData);
        }
    }
  }

  await batch.commit();
  console.log("✅ Act chapters, sections, and groups seeded to Firestore.");
}

seedActChapters().catch(console.error);
