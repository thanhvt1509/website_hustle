import dateFormat from "dateformat";
import QueryString from "qs";
import crypto from "crypto";
import moment from "moment";
import Order from "../models/order.js";
const config = {
  vnp_TmnCode: "32JQJOZU",
  vnp_HashSecret: "RJRZUERJQDXYYBAXXESGCVHKGDTZXHDB",
  vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  vnp_Api: "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
  vnp_ReturnUrl: "http://localhost:5173/orders",
};
export const vnpayMethod = (req, res, next) => {

  var ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  var tmnCode = config.vnp_TmnCode;
  var secretKey = config.vnp_HashSecret;
  var vnpUrl = config.vnp_Url;
  var returnUrl = config.vnp_ReturnUrl;

  var date = new Date();

  var createDate = moment(date).format("YYYYMMDDHHmmss");
  var orderId = req.body._id
  var amount = req.body.totalMoney;
  var bankCode = 'NCB'
  // req.body.bankCode;
  var orderInfo = req.body.note;
  // req.body.bankCode;
  var orderInfo = req.body.note ? req.body.note : "Thanh toan VNPAY";
  var orderType = req.body.pay_method;
  var locale = req.body.language;
  if (locale === null || locale === "" || locale === undefined) {
    locale = "vn";
  }
  var currCode = "VND";
  var vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  // vnp_Params['vnp_Merchant'] = ''
  vnp_Params["vnp_Locale"] = locale;
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = orderId;
  vnp_Params["vnp_OrderInfo"] = orderInfo;
  vnp_Params["vnp_OrderType"] = orderType;
  vnp_Params["vnp_Amount"] = amount * 100;
  vnp_Params["vnp_ReturnUrl"] = returnUrl+`/${orderId}`;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;
  if (bankCode !== null && bankCode !== "") {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  var signData = QueryString.stringify(vnp_Params, { encode: false });
  var hmac = crypto.createHmac("sha512", secretKey);
  var signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  vnpUrl += "?" + QueryString.stringify(vnp_Params, { encode: false });
  // const redirectUrl = returnUrl+ vnp_Params.vnp_TxnRef

  // res.redirect(vnpUrl)
  res.status(200).json(vnpUrl);
};
function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

export const vnpayIpn = async (req, res, next) => {
  var vnp_Params = req.query;
  var secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);
  var secretKey = config.vnp_HashSecret;
  var signData = QueryString.stringify(vnp_Params, { encode: false });
  var hmac = crypto.createHmac("sha512", secretKey);
  var signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");


  let checkAmount = true;
  if (secureHash === signed) {
    var orderId = vnp_Params["vnp_TxnRef"];
    const amount = vnp_Params["vnp_Amount"];
    const checkOrderId = await Order.findOne({ _id: orderId });

    var rspCode = vnp_Params["vnp_ResponseCode"]; //kiểm tra checksum
    if (checkOrderId) {
      checkOrderId.totalMoney == amount ? checkAmount == true : checkAmount == false
      if (checkAmount) {
        if (checkOrderId.paymentStatus === 0) {
          if (rspCode == "00") {
            await Order.updateOne({ _id: orderId }, { paymentStatus: 1 });
            res.status(200).json({ RspCode: "00", Message: "Success" });
          } else {
            //that bai
           await Order.findByIdAndDelete(orderId)
            // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
            res.status(200).json({ RspCode: "00", Message: "Success" });
          }
        } else {
          await Order.findByIdAndDelete(orderId)
          res
            .status(200)
            .json({
              RspCode: "02",
              Message: "This order has been updated to the payment status",
            });
        }
      } else {
        res.status(200).json({ RspCode: "04", Message: "Amount invalid" });
      }
    } else {
      res.status(200).json({ RspCode: "01", Message: "Order not found" });
    }
  } else {
    res.status(200).json({ RspCode: "97", Message: "Checksum failed" });
  }
}
