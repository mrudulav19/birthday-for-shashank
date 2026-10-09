export type StarColorTheme = 'blossom' | 'lavender' | 'cream' | 'sky' | 'gold' | 'mint';

export interface Wish {
  id: number;
  starNumber: number; // 1 to 29
  title: string;
  message: string;
  defaultColorTheme: StarColorTheme;
}

export interface ReleasedStar {
  id: string; // unique instance id
  wishId: number; // reference to wish
  colorTheme: StarColorTheme;
  x: number; // scattered position x percentage (0 - 100) or px
  y: number; // scattered position y percentage (0 - 100) or px
  rotation: number; // deg
  scale: number;
  opened: boolean;
  releasedAt: number;
}
