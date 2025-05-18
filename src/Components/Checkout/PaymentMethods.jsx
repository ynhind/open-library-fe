import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { createPayment } from "../../utils/paymentApi";
import { toast } from "react-toastify";
import { CreditCard, Landmark, Loader } from "lucide-react";

const PaymentMethods = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("CREDIT_CARD");
  const [isProcessing, setIsProcessing] = useState(false);

  // Get total amount from location state or use 0 as fallback
  const totalAmount = location.state?.totalAmount || 0;

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!orderId) {
      toast.error("Invalid order information");
      return;
    }

    try {
      setIsProcessing(true);

      const paymentData = {
        orderId: parseInt(orderId),
        payment_method: paymentMethod,
      };

      const result = await createPayment(paymentData);

      if (result && result.isPaid) {
        toast.success("Payment successful!");
        // Redirect to order confirmation page
        navigate(`/order-confirmation/${orderId}`);
      } else {
        throw new Error("Payment failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-serif font-bold mb-8 text-stone-800">
          Payment
        </h1>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-amber-100 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-medium text-stone-800 mb-2">
              Order Summary
            </h2>
            <div className="flex justify-between text-lg border-b border-amber-100 pb-3">
              <span>Total Amount:</span>
              <span className="font-bold text-amber-800">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <form onSubmit={handlePayment}>
            <h2 className="text-xl font-medium text-stone-800 mb-4">
              Payment Method
            </h2>

            <div className="space-y-3 mb-6">
              <label className="flex items-center p-4 border rounded-lg border-amber-200 cursor-pointer hover:bg-amber-50 transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CREDIT_CARD"
                  checked={paymentMethod === "CREDIT_CARD"}
                  onChange={() => setPaymentMethod("CREDIT_CARD")}
                  className="mr-3"
                />
                <CreditCard className="mr-2 text-amber-700" size={20} />
                <span>Credit Card</span>
              </label>

              <label className="flex items-center p-4 border rounded-lg border-amber-200 cursor-pointer hover:bg-amber-50 transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="BANK_TRANSFER"
                  checked={paymentMethod === "BANK_TRANSFER"}
                  onChange={() => setPaymentMethod("BANK_TRANSFER")}
                  className="mr-3"
                />
                <Landmark className="mr-2 text-amber-700" size={20} />
                <span>Bank Transfer</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-amber-800 hover:bg-amber-900 text-white py-3 px-6 rounded-md transition-colors font-medium text-center flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Processing Payment...
                </>
              ) : (
                `Pay $${totalAmount.toFixed(2)}`
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
