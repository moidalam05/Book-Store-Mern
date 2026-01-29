import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
} from "../../app/features/orders/ordersApi";
import { FiShoppingBag } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import CheckoutForm from "./CheckoutForm";
import OrderSummary from "./OrderSummary";
import { useGetCartQuery } from "../../app/features/cart/cartApi";
import { useGetAddressesQuery } from "../../app/features/address/addressApi";
import { toast } from "react-hot-toast";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);

  // cart data
  const { data: cartData, isLoading, refetch } = useGetCartQuery();
  const cart = cartData?.data || {};

  // address data
  const { data: addressData } = useGetAddressesQuery();
  const addresses = addressData?.data || [];

  // order mutation
  const [createOrder] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  // 🔥 HARD GUARD: cart empty → checkout avoid
  useEffect(() => {
    if (!isLoading && cart?.items?.length === 0) {
      navigate("/orders");
    }
  }, [cart, isLoading, navigate]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const { currentUser } = useAuth();

  // Set default address on component mount
  useEffect(() => {
    const defaultAddress = addresses.find((addr) => addr.isDefault);
    if (defaultAddress) {
      setAddressFields(defaultAddress);
    }
  }, []);

  const setAddressFields = (address) => {
    setValue("address", address.addressLine1);
    setValue("landmark", address.addressLine2);
    setValue("city", address.city);
    setValue("state", address.state);
    setValue("country", address.country);
    setValue("zipcode", address.postalCode);
    setValue("phone", address.phone);
    setValue("name", address.fullName);
    setShowAddressDropdown(false);
  };

  const handleAddressSelect = (address) => {
    setAddressFields(address);
  };

  const handleCODOrder = async (payload) => {
    const orderPromise = createOrder(payload).unwrap();

    toast.promise(orderPromise, {
      loading: "Placing your order...",
      success: (res) => {
        navigate(`/order-confirmation/${res?.data?._id}`, {
          state: { success: true },
        });
        return res.message;
      },
      error: (err) => err?.data?.message || "Failed to place order",
    });

    await orderPromise;
    refetch();
  };

  const loadRazorpay = () => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => resolve(true);
      script.onerror = () => reject(false);

      document.body.appendChild(script);
    });
  };

  const forceCloseRazorpay = () => {
    try {
      if (window?.Razorpay) {
        document.querySelectorAll(".razorpay-container").forEach((el) => {
          el.remove();
        });
      }

      document.body.style.overflow = "auto";
    } catch (err) {
      console.warn("Failed to cleanup Razorpay modal", err);
    }
  };

  const redirectToConfirmation = (orderId) => {
    window.location.href = `/order-confirmation/${orderId}`;
  };

  const handleRazorpayOrder = async (payload) => {
    try {
      const res = await createOrder(payload).unwrap();
      console.log("res", res);

      const { orderId, amount, currency, key } = res.razorpay;

      const loaded = await loadRazorpay();
      if (!loaded) {
        toast.error("Payment service failed to load");
        return;
      }

      const options = {
        key,
        amount,
        currency,
        name: "Book Store",
        description: "Secure checkout for your book order",
        order_id: orderId,

        prefill: {
          name: payload.shippingAddress.name,
          email: payload.shippingAddress.email,
          contact: payload.shippingAddress.phone,
        },

        notes: {
          purpose: "Book Purchase",
          userPhone: payload.shippingAddress.phone,
          userName: payload.shippingAddress.name,
          userEmail: payload.shippingAddress.email,
        },

        handler: async (response) => {
          const verifyPayload = {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            shippingAddress: payload.shippingAddress,
          };

          await verifyPayment(verifyPayload).unwrap();
          forceCloseRazorpay();
          refetch();
          redirectToConfirmation(res.orderId);
        },

        modal: {
          ondismiss: () => {
            forceCloseRazorpay();
            redirectToConfirmation(res.orderId);
          },
        },

        theme: {
          color: "#2563eb",
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function () {
        rzp.close();
        redirectToConfirmation(res.orderId);
      });

      rzp.open();
    } catch (error) {
      console.error("Razorpay error:", error);
      toast.error("Payment failed");
    }
  };

  const onSubmit = async (data) => {
    const payload = {
      payment: {
        method: paymentMethod.toUpperCase(),
      },
      shippingAddress: {
        name: data.name,
        phone: data.phone,
        email: currentUser?.email,
        addressLine1: data.address,
        addressLine2: data?.landmark ? data.landmark : "",
        city: data.city,
        state: data.state,
        country: data.country,
        zipcode: data.zipcode,
      },
    };

    if (paymentMethod === "cod") {
      await handleCODOrder(payload);
    }

    if (paymentMethod === "razorpay") {
      await handleRazorpayOrder(payload);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiShoppingBag className="text-blue-600" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
              <p className="text-gray-600 mt-1">
                Complete your order in just a few steps
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2">
              <CheckoutForm
                register={register}
                handleSubmit={handleSubmit}
                errors={errors}
                onSubmit={onSubmit}
                showAddressDropdown={showAddressDropdown}
                setShowAddressDropdown={setShowAddressDropdown}
                addresses={addresses}
                handleAddressSelect={handleAddressSelect}
                setAddressFields={setAddressFields}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                currentUser={currentUser}
                cart={cart}
              />
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1 mt-8 lg:mt-0">
              <OrderSummary
                total={cart?.finalPayableAmount}
                original={cart?.originalPriceTotal}
                discount={cart?.productDiscountTotal}
                coupon={cart?.appliedCoupon}
                isLoading={isLoading}
                register={register}
                handleSubmit={handleSubmit}
                errors={errors}
                onSubmit={onSubmit}
                paymentMethod={paymentMethod}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
