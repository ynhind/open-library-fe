import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getOrderById } from "../../utils/orderApi";
import { Check, Clock, Loader, ShoppingBag, ChevronLeft } from "lucide-react";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrderDetails() {
      if (!orderId) {
        setError("Invalid order ID");
        setLoading(false);
        return;
      }

      try {
        const orderDetails = await getOrderById(parseInt(orderId));
        if (!orderDetails) {
          throw new Error("Order not found");
        }
        setOrder(orderDetails);
        // Show success toast
        toast.success("Order confirmed successfully!");
      } catch (error) {
        console.error("Error fetching order details:", error);
        const errorMessage =
          error.message === "Order not found"
            ? "Order not found. Please check your order ID."
            : "Failed to load order details. Please try again later.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader size={40} className="animate-spin text-amber-700 mb-4" />
        <p className="text-stone-600">Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-red-50 p-6 rounded-lg border border-red-200 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
          <Link
            to="/"
            className="text-amber-700 hover:underline flex items-center justify-center gap-1"
          >
            <ChevronLeft size={16} /> Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="bg-green-50 p-6 rounded-lg border border-green-200 mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Check size={32} className="text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-green-800 mb-2">
            Thank You for Your Order!
          </h1>
          <p className="text-green-700">
            Your payment was successful and your order has been confirmed.
          </p>
        </div>

        {(order?.orderItems || order?.items) &&
          (order?.orderItems?.length > 0 || order?.items?.length > 0) && (
            <div className="bg-gradient-to-r from-amber-50 to-white rounded-xl shadow-md overflow-hidden border border-amber-200 p-6 mb-8">
              <h3 className="text-xl font-medium text-amber-800 mb-6 flex items-center gap-2">
                <ShoppingBag size={18} className="text-amber-600" />
                Your Books
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {(order?.orderItems || order?.items)?.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-4 rounded-lg border border-amber-100 hover:shadow-md transition-all flex items-center gap-4"
                  >
                    <div className="bg-amber-100 h-12 w-12 flex items-center justify-center rounded-full flex-shrink-0">
                      <ShoppingBag size={20} className="text-amber-700" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-stone-800 mb-1">
                        {item.book?.title || "Book"}
                      </h4>
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs font-medium">
                          Quantity: {item.quantity}
                        </span>
                        {item.book?.author && (
                          <span className="text-sm text-stone-500">
                            By: {item.book.author}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-amber-100 p-6 mb-8">
          <h2 className="text-xl font-medium text-stone-800 mb-4 flex items-center gap-2">
            <ShoppingBag size={20} className="text-amber-700" />
            Order Details
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between pb-2 border-b border-amber-100">
              <span className="font-medium text-stone-600">Order ID:</span>
              <span className="text-stone-800">
                {order?.orderId || orderId}
              </span>
            </div>

            <div className="flex justify-between pb-2 border-b border-amber-100">
              <span className="font-medium text-stone-600">Date:</span>
              <span className="text-stone-800">
                {order?.order_date
                  ? new Date(order.order_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </span>
            </div>

            <div className="flex justify-between pb-2 border-b border-amber-100">
              <span className="font-medium text-stone-600">Status:</span>
              <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-1 rounded-full text-sm">
                <Clock size={14} />
                {order?.status || "Confirmed"}
              </span>
            </div>

            <div className="flex justify-between pb-2 border-b border-amber-100">
              <span className="font-medium text-stone-600">
                Payment Method:
              </span>
              <span className="text-stone-800 capitalize">
                {order?.payments && order.payments.length > 0
                  ? order.payments[0].payment_method
                      ?.toLowerCase()
                      .replace("_", " ")
                  : "N/A"}
              </span>
            </div>

            {order?.payments && order.payments.length > 0 && (
              <div className="flex justify-between pb-2 border-b border-amber-100">
                <span className="font-medium text-stone-600">
                  Payment Date:
                </span>
                <span className="text-stone-800">
                  {order.payments[0].payment_date
                    ? new Date(
                        order.payments[0].payment_date
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "N/A"}
                </span>
              </div>
            )}

            {order?.payments &&
              order.payments.length > 0 &&
              order.payments[0].transaction_id && (
                <div className="flex justify-between pb-2 border-b border-amber-100">
                  <span className="font-medium text-stone-600">
                    Transaction ID:
                  </span>
                  <span className="text-stone-800 font-mono text-sm">
                    {order.payments[0].transaction_id}
                  </span>
                </div>
              )}

            <div className="flex justify-between font-bold text-lg text-amber-800">
              <span>Total:</span>
              <span>
                {(order?.total_amount || order?.total)?.toLocaleString(
                  "vi-VN"
                ) || "0"}{" "}
                VND
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <Link
            to="/"
            className="bg-amber-50 hover:bg-amber-100 text-amber-800 py-2 px-6 rounded-md transition-colors font-medium text-center"
          >
            Continue Shopping
          </Link>
          <Link
            to="/"
            className="bg-amber-800 hover:bg-amber-900 text-white py-2 px-6 rounded-md transition-colors font-medium text-center"
          >
            Back to Library
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
