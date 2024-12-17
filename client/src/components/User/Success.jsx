import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from './CartContext';
const Success = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const navigate = useNavigate();

  // State to track loading and error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const { clearCart } = useCart();

  const verifyPayment = async () => {
    try {
      const response = await axios.post("http://localhost:4000/api/orders/verify", {
        success,
        orderId,
      },
        { headers: { token } });

      if (response.data.success) {
        clearCart();
        navigate("/myorders");
      } else {
        setError(response.data.message || "Payment verification failed");
        navigate("/");
      }
    } catch (err) {
      console.error("Error verifying payment:", err);
      setError("An error occurred while verifying payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []); // Runs only once after the component is mounted

  if (loading) {
    return <div>Verifying payment...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <div>Success</div>;
};

export default Success;
