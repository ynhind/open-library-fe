import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { createPayment } from "../../utils/paymentApi";
import { toast } from "react-toastify";
import {
  CreditCard,
  Landmark,
  Loader,
  Shield,
  ChevronLeft,
  Sparkles,
  Lock,
} from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-stone-50">
      {/* Premium Background Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='%23b45309' fill-opacity='0.1'%3E%3Crect width='1' height='1'/%3E%3Crect x='30' y='30' width='1' height='1'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container mx-auto px-4 py-8 md:py-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Premium Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full mb-6 shadow-lg">
              <CreditCard size={20} className="text-amber-700" />
            </div>
            <h1 className="text-2xl md:text-4xl font-serif font-bold mb-4 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-600 bg-clip-text text-transparent">
              Secure Payment
            </h1>
            <p className="text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed">
              Complete your purchase with our industry-leading secure payment
              system. Your transaction is protected with enterprise-grade
              encryption.
            </p>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-6 mt-8">
              <div className="flex items-center gap-2 text-sm text-stone-500">
                <Shield size={16} className="text-green-600" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-500">
                <Lock size={16} className="text-blue-600" />
                <span>Bank-Level Security</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-500">
                <Sparkles size={16} className="text-amber-600" />
                <span>Instant Processing</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Payment Form */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                {/* Premium Card Header */}
                <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform skew-x-12"></div>
                  <div className="relative z-10">
                    <h2 className="text-2xl font-serif font-bold text-white mb-2">
                      Payment Details
                    </h2>
                    <p className="text-amber-100">
                      Choose your preferred payment method
                    </p>
                  </div>
                </div>

                <div className="p-8">
                  <form onSubmit={handlePayment} className="space-y-8">
                    {/* Payment Methods */}
                    <div>
                      <h3 className="text-lg font-semibold text-stone-800 mb-6 flex items-center gap-2">
                        <CreditCard size={20} className="text-amber-700" />
                        Select Payment Method
                      </h3>

                      <div className="space-y-4">
                        {/* Credit Card Option */}
                        <label
                          className={`group relative flex items-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                            paymentMethod === "CREDIT_CARD"
                              ? "border-amber-400 bg-gradient-to-r from-amber-50 to-amber-100 shadow-md"
                              : "border-stone-200 bg-white hover:border-amber-300 hover:bg-amber-50/50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="CREDIT_CARD"
                            checked={paymentMethod === "CREDIT_CARD"}
                            onChange={() => setPaymentMethod("CREDIT_CARD")}
                            className="sr-only"
                          />

                          {/* Custom Radio Button */}
                          <div
                            className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-all duration-200 ${
                              paymentMethod === "CREDIT_CARD"
                                ? "border-amber-500 bg-amber-500"
                                : "border-stone-300 group-hover:border-amber-400"
                            }`}
                          >
                            {paymentMethod === "CREDIT_CARD" && (
                              <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                            )}
                          </div>

                          <div className="flex items-center flex-1">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 transition-all duration-200 ${
                                paymentMethod === "CREDIT_CARD"
                                  ? "bg-amber-200 text-amber-800"
                                  : "bg-stone-100 text-stone-600 group-hover:bg-amber-100 group-hover:text-amber-700"
                              }`}
                            >
                              <CreditCard size={20} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-stone-800 group-hover:text-amber-800">
                                Credit Card
                              </h4>
                              <p className="text-sm text-stone-500">
                                Visa, Mastercard, American Express
                              </p>
                            </div>
                          </div>

                          {/* Popular Badge */}
                          {paymentMethod === "CREDIT_CARD" && (
                            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg">
                              Most Popular
                            </div>
                          )}
                        </label>

                        {/* Bank Transfer Option */}
                        <label
                          className={`group relative flex items-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                            paymentMethod === "BANK_TRANSFER"
                              ? "border-amber-400 bg-gradient-to-r from-amber-50 to-amber-100 shadow-md"
                              : "border-stone-200 bg-white hover:border-amber-300 hover:bg-amber-50/50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="BANK_TRANSFER"
                            checked={paymentMethod === "BANK_TRANSFER"}
                            onChange={() => setPaymentMethod("BANK_TRANSFER")}
                            className="sr-only"
                          />

                          {/* Custom Radio Button */}
                          <div
                            className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-all duration-200 ${
                              paymentMethod === "BANK_TRANSFER"
                                ? "border-amber-500 bg-amber-500"
                                : "border-stone-300 group-hover:border-amber-400"
                            }`}
                          >
                            {paymentMethod === "BANK_TRANSFER" && (
                              <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                            )}
                          </div>

                          <div className="flex items-center flex-1">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 transition-all duration-200 ${
                                paymentMethod === "BANK_TRANSFER"
                                  ? "bg-amber-200 text-amber-800"
                                  : "bg-stone-100 text-stone-600 group-hover:bg-amber-100 group-hover:text-amber-700"
                              }`}
                            >
                              <Landmark size={20} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-stone-800 group-hover:text-amber-800">
                                Bank Transfer
                              </h4>
                              <p className="text-sm text-stone-500">
                                Direct bank account transfer
                              </p>
                            </div>
                          </div>

                          {/* Secure Badge */}
                          {paymentMethod === "BANK_TRANSFER" && (
                            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg">
                              Most Secure
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    {/* Premium Pay Button */}
                    <div className="pt-6 border-t border-stone-200">
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className={`w-full relative overflow-hidden py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 transform ${
                          isProcessing
                            ? "bg-stone-400 text-stone-100 cursor-not-allowed"
                            : "bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:via-amber-800 hover:to-amber-900 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                        }`}
                      >
                        {/* Button Shine Effect */}
                        {!isProcessing && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>
                        )}

                        <div className="relative z-10 flex items-center justify-center gap-3">
                          {isProcessing ? (
                            <>
                              <Loader size={20} className="animate-spin" />
                              <span>Processing Payment...</span>
                            </>
                          ) : (
                            <>
                              <Lock size={20} />
                              <span>
                                Pay ${totalAmount.toFixed(2)} Securely
                              </span>
                            </>
                          )}
                        </div>
                      </button>

                      <p className="text-center text-sm text-stone-500 mt-4">
                        By proceeding, you agree to our terms and conditions.
                        <br />
                        Your payment information is secured with 256-bit SSL
                        encryption.
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden sticky top-8">
                {/* Order Summary Header */}
                <div className="bg-gradient-to-r from-stone-700 to-stone-800 p-6 text-white">
                  <h3 className="text-xl font-serif font-bold mb-2">
                    Order Summary
                  </h3>
                  <p className="text-stone-300 text-sm">Order #{orderId}</p>
                </div>

                <div className="p-6 space-y-6">
                  {/* Amount Breakdown */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-stone-100">
                      <span className="text-stone-600">Subtotal</span>
                      <span className="font-semibold text-stone-800">
                        ${totalAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-stone-100">
                      <span className="text-stone-600">Processing Fee</span>
                      <span className="font-semibold text-green-600">FREE</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b-2 border-amber-200">
                      <span className="text-lg font-semibold text-stone-800">
                        Total
                      </span>
                      <span className="text-2xl font-bold text-amber-800">
                        ${totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Security Features */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                      <Shield size={16} />
                      Security Features
                    </h4>
                    <ul className="space-y-2 text-sm text-green-700">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        256-bit SSL encryption
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        PCI DSS compliant
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        Fraud protection
                      </li>
                    </ul>
                  </div>

                  {/* Support Info */}
                  <div className="text-center">
                    <p className="text-sm text-stone-500 mb-2">Need help?</p>
                    <button className="text-amber-700 hover:text-amber-800 font-semibold text-sm underline underline-offset-2">
                      Contact Support
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back Navigation */}
          <div className="mt-12 text-center">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-stone-600 hover:text-amber-700 transition-colors group"
            >
              <ChevronLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span>Back to previous step</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
