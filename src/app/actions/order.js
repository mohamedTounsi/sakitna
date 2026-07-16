"use server";

import dbConnect from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { revalidatePath } from "next/cache";

export async function createOrder(orderData) {
  await dbConnect();

  try {
    const order = await Order.create(orderData);
    revalidatePath("/admin/orders");
    return { success: true, orderId: order._id.toString() };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, error: error.message };
  }
}

export async function getOrders() {
  await dbConnect();
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 }).populate('items.product').lean();
    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

export async function updateOrderStatus(orderId, status) {
  await dbConnect();
  try {
    await Order.findByIdAndUpdate(orderId, { status });
    revalidatePath('/admin/orders');
    return { success: true };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { success: false, error: error.message };
  }
}
