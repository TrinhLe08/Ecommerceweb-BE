export type OrderDetailType = {
  idOrder: number;
  quantity: number;
  nameOrder: string;
  urlOrder: string;
};

export type ShoppingListType = {
  buyerName: string;
  price: number;
  quantity: number;
  phoneNumber: string;
  address: string;
  nation: string;
  purchasDate: string;
  paymentMethods: string;
  email: string;
  status: boolean;
  detailOrder: OrderDetailType[];
};
