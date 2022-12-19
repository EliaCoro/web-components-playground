export interface Menu {
  id: number;
  enabled: number; // 0 or 1
  price: null|number;
  isSpecial: number; // 0 or 1
  imageId: number|null;
  registrationDate: string; // ISO date
  endDate: string; // ISO date
  priority: number;
  name: string;
  nameIt: string;
  nameEn: string;
  description: string;
  descriptionIt: string;
  descriptionEn: string;
  categories: Category[];
}

export interface Category {
  id: number;
  name: string;
  nameIt: string;
  nameEn: string;
  description: string;
  descriptionIt: string;
  descriptionEn: string;
  imageId: number|null;
  enabled: number; // 0 or 1
  priority: number;
  dishes: Dish[];
}

export interface Dish {
  id: number;
  name: string;
  nameIt: string;
  nameEn: string;
  description: string;
  descriptionIt: string;
  descriptionEn: string;
  imageId: number|null;
  price: number|null;
  priority: number;
}