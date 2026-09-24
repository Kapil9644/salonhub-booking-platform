let cashfreeInstance = null;

export const getCashfree = () => {
  if (cashfreeInstance) {
    return cashfreeInstance;
  }

  if (!window.Cashfree) {
    throw new Error("Cashfree SDK is not loaded.");
  }

  cashfreeInstance = window.Cashfree({
    mode: "sandbox",
  });

  return cashfreeInstance;
};

export const openCashfreeCheckout = async (paymentSessionId) => {
  if (!paymentSessionId) {
    throw new Error("Payment session ID is required.");
  }

  const cashfree = getCashfree();

  return cashfree.checkout({
    paymentSessionId,
    redirectTarget: "_self",
  });
};
