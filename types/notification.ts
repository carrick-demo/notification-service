export interface Notification {
  id: number;
  type: string;
  message: string;
  email: string;
  orderId: number;
  timestamp: string;
}

export interface NotificationResponse {
  success?: boolean;
  data?: Notification;
  error?: string;
}

export interface CreateNotificationRequest {
  orderId: number;
}

export interface OrderNotificationData {
  order: {
    id: number;
    userId: number;
    product: string;
    amount: number;
  };
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface NotificationListResponse {
  success: boolean;
  data: Notification[];
  count: number;
}
