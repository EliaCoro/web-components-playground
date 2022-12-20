
interface WithNameAndDescription {
  name: string;
  nameIt: string;
  nameEn: string;
  description: string;
  descriptionIt: string;
  descriptionEn: string;
}

export interface Menu extends WithNameAndDescription {
  id: number;
  enabled: number; // 0 or 1
  price: null|number;
  isSpecial: number; // 0 or 1
  imageId: number|null;
  image: Media|null;
  registrationDate: string; // ISO date
  endDate: string; // ISO date
  priority: number;
  categories: Category[];
}

export interface Category extends WithNameAndDescription {
  id: number;
  imageId: number|null;
  image: Media|null;
  enabled: number; // 0 or 1
  priority: number;
  dishes: Dish[];
}

export interface Dish extends WithNameAndDescription {
  id: number;
  imageId: number|null;
  image: Media|null;
  price: number|null;
  priority: number;
  enabled: number; // 0 or 1

  ingredients: Ingredient[];
  allergens: Allergen[];
  tags: Tag[];
}

export interface Ingredient extends WithNameAndDescription {
  id: number;
  imageId: number|null;
}

export interface Allergen extends WithNameAndDescription {
  id: number;
  imageId: number|null;
}

export interface Tag {
  id: number;
  color: string;
  name: string;
  nameIt: string;
  nameEn: string;
  imageId: number|null;
}

export interface Media {
  id: number;
  uploadDate: string; // ISO date
  extension: string;
}