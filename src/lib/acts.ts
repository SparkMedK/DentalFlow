
import type { ActSection } from './types';

export const ACT_SECTIONS: ActSection[] = [
  {
    id: 'section-1',
    title: 'SECTION I: SOINS CONSERVATEURS, OBTURATIONS DENTAIRES DÉFINITIVES',
    acts: [
      { code: 'DCH010010', designation: 'Obturation coronaire 1 face', cotation: 'D15', honoraire: 45.0 },
      { code: 'DCH010020', designation: 'Obturation coronaire 2 faces', cotation: 'D25', honoraire: 75.0 },
      { code: 'DCH010030', designation: 'Obturation coronaire 3 faces et plus', cotation: 'D35', honoraire: 105.0 },
    ],
  },
  {
    id: 'section-2',
    title: 'SECTION II: ENDODONTIE',
    acts: [
      { code: 'DCH020010', designation: 'Traitement endodontique monoradiculée', cotation: 'D40', honoraire: 120.0 },
      { code: 'DCH020020', designation: 'Traitement endodontique pluriradiculée', cotation: 'D60', honoraire: 180.0 },
    ],
  },
  {
    id: 'section-3',
    title: 'SECTION III: CHIRURGIE',
    acts: [
        { code: 'DCH030010', designation: 'Extraction sur arcade', cotation: 'D10', honoraire: 30.0 },
        { code: 'DCH030020', designation: 'Extraction dent de sagesse', cotation: 'D30', honoraire: 90.0 },
    ],
  },
];
