import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import axios from "axios";
import dotenv from "dotenv";
import { UsersResponse } from "./types/user";
import { Order, OrderWithUser } from "./types/order";

dotenv.config();

const app = new Hono();
const PORT = Number(process.env.PORT) || 3003;
const USER_SERVICE_URL =
  process.env.USER_SERVICE_URL || "http://localhost:3001";
const ORDER_SERVICE_URL =
  process.env.ORDER_SERVICE_URL || "http://localhost:3002";

// Middleware
app.use(cors());

// Status endpoint, consumed by the order service
app.get("/api/notifications/status", async (c) => {
  try {
    // Call user service to get user count for status check
    const usersResponse = await axios.get<UsersResponse>(
      `${USER_SERVICE_URL}/api/users`,
    );
    const userCount = usersResponse.data.count || 0;

    // Call order service to get order count for status check
    const ordersResponse = await axios.get<Order[]>(
      `${ORDER_SERVICE_URL}/api/orders`,
    );
    const orderCount = ordersResponse.data.length;

    const payload: {
      service: string;
      status: string;
      timestamp: string;
      userCount: number;
      orderCount: number;
    } = {
      service: "notification-service",
      status: "active",
      timestamp: new Date().toISOString(),
      userCount: userCount,
      orderCount: orderCount,
    };

    return c.json(payload);
  } catch (error) {
    const payload: {
      service: string;
      status: string;
      timestamp: string;
      userCount: number;
      orderCount: number;
    } = {
      service: "notification-service",
      status: "active",
      timestamp: new Date().toISOString(),
      userCount: 0,
      orderCount: 0,
    };

    return c.json(payload);
  }
});

// Get order details endpoint that calls order service
app.get("/api/notifications/order/:id", async (c) => {
  try {
    const orderId = parseInt(c.req.param("id"));

    // Call order service to get order details
    const orderResponse = await axios.get<OrderWithUser>(
      `${ORDER_SERVICE_URL}/api/orders/${orderId}`,
    );
    const order = orderResponse.data;

    const payload: { orderDetails: OrderWithUser; message: string } = {
      orderDetails: order,
      message: `Order details retrieved for notification purposes`,
    };

    return c.json(payload);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return c.body(null, 404);
    }
    return c.body(null, 500);
  }
});

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`Notification Service running on port ${PORT}`);
});

export default app;
