export interface Scene {
  id: number;
  name: string;
  imageUrl: string;
  explanations: {
    ja: string;
    en: string;
    zh: string;
  };
}

export interface InsertScene extends Omit<Scene, 'id'> {}
