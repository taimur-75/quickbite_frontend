import React, { useEffect } from "react";

const PaymentCancel = () => {
  useEffect(() => {
    document.title = "Payment Cancelled";
  }, []);

  return (
    <div>
      <p>Payment Cancelled.</p>
    </div>
  );
};

export default PaymentCancel;
