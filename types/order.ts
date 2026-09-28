// This file defines the Order type as expected by the order-service API
export interface Order {
  id: number;
  userId: number;
  product: string;
  amount: number;
}

export interface OrderWithUser extends Order {
  user: {
    id: number;
    name: string;
    email?: string;
  };
}

export interface OrderResponse {
  success?: boolean;
  data?: Order | OrderWithUser;
  error?: string;
}

export interface OrdersResponse {
  success?: boolean;
  data?: Order[] | OrderWithUser[];
  count?: number;
  error?: string;
}

export interface CreateOrderRequest {
  userId: number;
  product: string;
  amount: number;
}
