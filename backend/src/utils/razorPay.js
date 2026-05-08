import Razorpay from "razorpay";

export const createRazorpayInstance = ({
  keyId,
  keySecret
}) => {

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret
  });
};