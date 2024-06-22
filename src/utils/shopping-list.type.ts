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
  address: string;
  purchasDate: string;
  point: number;
  email: string;
  status: boolean;
  detailOrder: OrderDetailType[];
};
