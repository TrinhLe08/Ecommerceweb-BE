export type UserComment = {
  urlAvatarUser: string;
  email: string;
  content: string;
  ratting: number;
};

export type ProductType = {
  urlProduct: string;
  name: string;
  price: number;
  ratting: number;
  status: boolean;
  material: string;
  size: string;
  detail: string;
  origin: string;
  item: string;
  comment: UserComment[];
};
