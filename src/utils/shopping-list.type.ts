export type OrderDetailType = {
  idOrder: number;
  quantity: number;
  nameOrder: string;
  urlOrder: string;
  priceOrder: number;
};

export type ShoppingListType = {
  buyerName: string;
  price: number;
  quantity: number;
  phoneNumber: string;
  city: string;
  country: string;
  purchasDate: string;
  email: string;
  status: boolean;
  detailOrder: OrderDetailType[];
};
