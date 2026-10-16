require("dotenv").config();

const { getRefund } = require("./services/cashfreeRefundService");

async function main() {
  try {
    const result = await getRefund(
      "RUPIVA_1792082720060",
      "RF_RUPIVA_1792082720060",
    );

    console.log("Cashfree refund response:");
    console.dir(result, { depth: null });
  } catch (error) {
    console.error("Refund status check failed:", error.message);
    if (error.details) {
      console.dir(error.details, { depth: null });
    }
  }
}

main();
