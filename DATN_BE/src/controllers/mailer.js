import nodemailer from "nodemailer";
export const sendMail = async (req, res) => {
  try {
    const { to, subject, text } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "hustle.nodemail@gmail.com",
        pass: "gntgzxkqcefgjsvy",
      },
    });

    const mailOptions = {
      from: "hustle.nodemail@gmail.com",
      to,
      subject,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Error sending email" });
  }
};

export const sendConfirmationEmail = async (userEmail, confirmationCode) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "hustle.nodemail@gmail.com",
        pass: "gntgzxkqcefgjsvy",
      },
    });

    const confirmationLink = `http://localhost:5173/signin?confirmationCode=${confirmationCode}`;
    const mailOptions = {
      from: "hustle.nodemail@gmail.com",
      to: userEmail,
      subject: "Xác nhận tài khoản",
      html: `
      <div style="width:100%;text-align:center;height: 100vh">
    <p>Chào bạn đến với HUSTLE</p>
    <div class="text-center w-[350px]"> Chào mừng bạn đến với <span style="font-weight: 600;">Hustle</span> click
      vào
      nút <span style="font-weight: 600;">bên dưới</span>
      dể tạo
      một tài khoản</div>
    <table align="center" border="0" cellspacing="0" cellpadding="0" width="720" bgcolor="#ffffff">
    <tr>
      <td style="padding:0 16px;line-height:30px;">
        <p align="center" style="margin-top: 20px;cursor: pointer;">
          <a href=${confirmationLink}
            style="width:300px;display:block;background-color:#000;border-radius:12px;margin-top:0px auto;color:#fff;text-decoration:none;text-align:center;padding:12px 24px;box-sizing:border-box"
            target="_blank"
            data-saferedirecturl="https://www.google.com/url?q=https://qv3ydl8m.r.ap-southeast-1.awstrack.me/L0/https:%252F%252Fwww.coolmate.me%252Faccount%252Factivation%252F6c18aedbb88ffb5a50b01f3a3f3db4ab80db0921b848e76f9609b1c405f4b5a5/1/010e018b6bcf2461-32031420-acd1-4d15-8a48-2524aea37e5d-000000/SbaNfPRdpmNbHR9FqYx1Y1nS2Og%3D130&amp;source=gmail&amp;ust=1701851859129000&amp;usg=AOvVaw1LuM25Y4eGBRD4OK9gTCRe">
            Xác minh email
          </a>
        </p>
      </td>
    </tr>
    </table>
    <p style="margin-right: -250px;margin-top: 10px;">Thanks !</p>
  </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending confirmation email:", error);
  }
};
export const forgotPasswordMail = async (userEmail, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "hustle.nodemail@gmail.com",
        pass: "gntgzxkqcefgjsvy",
      },
    });

    const confirmationLink = `http://localhost:5173/resetPassword?token=${token}`;
    const mailOptions = {
      from: "hustle.nodemail@gmail.com",
      to: userEmail,
      subject: "Quên mật khẩu",
      html: `
      <div style="width:100%;text-align:center;height: 100vh">
    <p>Chào bạn đến với HUSTLE</p>
    <div class="text-center w-[350px]"> Chào mừng bạn đến với <span style="font-weight: 600;">Hustle</span> click
      vào
      nút <span style="font-weight: 600;">bên dưới</span>
      dể tạo
      một tài khoản</div>
    <table align="center" border="0" cellspacing="0" cellpadding="0" width="720" bgcolor="#ffffff">
    <tr>
      <td style="padding:0 16px;line-height:30px;">
        <p align="center" style="margin-top: 20px;cursor: pointer;">
          <a href=${confirmationLink}
            style="width:300px;display:block;background-color:#000;border-radius:12px;margin-top:0px auto;color:#fff;text-decoration:none;text-align:center;padding:12px 24px;box-sizing:border-box"
            target="_blank"
            data-saferedirecturl="https://www.google.com/url?q=https://qv3ydl8m.r.ap-southeast-1.awstrack.me/L0/https:%252F%252Fwww.coolmate.me%252Faccount%252Factivation%252F6c18aedbb88ffb5a50b01f3a3f3db4ab80db0921b848e76f9609b1c405f4b5a5/1/010e018b6bcf2461-32031420-acd1-4d15-8a48-2524aea37e5d-000000/SbaNfPRdpmNbHR9FqYx1Y1nS2Og%3D130&amp;source=gmail&amp;ust=1701851859129000&amp;usg=AOvVaw1LuM25Y4eGBRD4OK9gTCRe">
            Đặt lại mật khẩu
          </a>
        </p>
      </td>
    </tr>
    </table>
    <p style="margin-right: -250px;margin-top: 10px;">Thanks !</p>
  </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending confirmation email:", error);
  }
};
export const mailOrder = async (userEmail, order) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "hustle.nodemail@gmail.com",
        pass: "gntgzxkqcefgjsvy",
      },
    });
console.log(order);
    const mailOptions = {
      from: "hustle.nodemail@gmail.com",
      to: userEmail,
      subject: "Thông báo đơn hàng từ Hustle",
      html: `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" dir="ltr" align="center"
      style="background-color:#fff;font-size:16px">
      <tbody>
          <tr>
              <td align="left" valign="top" style="margin:0;padding:0">
                  <table align="center" border="0" cellspacing="0" cellpadding="0" width="720" bgcolor="#ffffff">
                      <tbody>
                          <tr>
                              <td style="margin:0">
                                  <a href="http://localhost:5173/" target="_blank"
                                      data-saferedirecturl="http://localhost:5173/">
                                      <img src="https://theme.hstatic.net/200000690725/1001078549/14/slide_4_img.jpg?v=235"
                                          width="100%" class="CToWUd" data-bit="iit">
                                  </a>
                              </td>
                          </tr>
                          <tr>
                              <td style="padding:0 16px;line-height:30px">
                                  <p style="margin:16px 0 10px">
                                      Trong cuộc sống có quá nhiều sự lựa chọn cám ơn Huy đã
                                      chọn <span class="il">Hustle</span>.
                                  </p>
                                  <p style="margin:10px 0">
                                      <span class="il">Hustle</span> rất vui thông báo đơn hàng <b>#${
                                        order._id
                                      }</b> của quý
                                      khách đã được tiếp nhận và
                                      đang trong quá trình xử lý.
                                  </p>
                                  <p style="margin:10px 0 0">
                                      <span class="il">Hustle</span> sẽ gửi email thông báo đến quý khách khi đơn hàng
                                      được đóng gói và chuyển sang đơn
                                      vị vận chuyển.
                                  </p>
                              </td>
                          </tr>
                          <tr>
                              <td>
                                  <div
                                      style="border:2px solid #2f5acf;padding:8px 16px;border-radius:16px;margin-top:16px">
                                      <p style="margin:10px 0 20px;font-weight:bold;font-size:20px">
                                          THÔNG TIN ĐƠN HÀNG
                                          <a href="http://localhost:5173/orders/${order._id}"
                                              style="color:#2f5acf;text-decoration:none" target="_blank"
                                              data-saferedirecturl="http://localhost:5173/">
                                              ${order._id}
                                          </a>
                                          <span style="font-weight:normal">${order.createdAt}</span>
                                      </p>
                                      <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                          <tbody>
                                              <tr>
                                                  <td valign="top">
                                                      <p style="margin:10px 0;font-weight:bold">
                                                          <b>Thông tin tài khoản</b>
                                                      </p>
                                                      <p style="margin:10px 0">
                                                          Tên khách hàng: ${
                                                            order.fullName
                                                          }
                                                      </p>
                                                      <p style="margin:10px 0">
                                                          Email: <a href="mailto:${
                                                            order.email
                                                          }"
                                                              target="_blank">${
                                                                order.email
                                                              }</a>
                                                      </p>
                                                      <p style="margin:10px 0">
                                                          Số điện thoại: ${
                                                            order.phoneNumber
                                                          }
                                                      </p>
                                                  </td>
                                                  <td valign="top">
                                                      <p style="margin:10px 0;font-weight:bold">
                                                          <b>Địa chỉ giao hàng</b>
                                                      </p>
                                                      <p style="margin:10px 0">
                                                      Tên khách hàng: ${
                                                        order.fullName
                                                      }

                                                      </p>
                                                      <p style="margin:10px 0">
                                                      Email: <a href="mailto:${
                                                        order.email
                                                      }"

                                                      target="_blank">${
                                                        order.email
                                                      }</a>

                                                      </p>
                                                      <p style="margin:10px 0">
                                                          Số điện thoại: ${
                                                            order.phoneNumber
                                                          }
                                                      </p>
                                                      <p style="margin:10px 0">
                                                          Địa chỉ: ${
                                                            order.detailAddress +
                                                            order.myWard +
                                                            order.myDistrict +
                                                            order.myProvince
                                                          }
                                                      </p>
                                                  </td>
                                              </tr>
                                              <tr>
                                                  <td colspan="2">
                                                      <p style="margin:10px 0">
                                                          <b>Phương thức thanh toán:</b> ${
                                                            order.pay_method
                                                          }
                                                      </p>
                                                  </td>
                                              </tr>
                                          </tbody>
                                      </table>
                                  </div>
                              </td>
                          </tr>
                          <tr>
                              <td>
                                  <div
                                      style="border:2px solid #2f5acf;padding:8px 16px;border-radius:16px;margin-top:16px">
                                      <p style="margin:10px 0 20px;font-weight:bold;font-size:20px">
                                          CHI TIẾT ĐƠN HÀNG
                                      </p>
                                      <table class="m_6043823984108940880table" cellpadding="0" cellspacing="0" border="0"
                                          width="100%" style="font-size:14px">
                                          <thead>
                                              <tr>
                                                  <th width="150px" style="text-align:left">Tên sản phẩm</th>
                                                  <th>SL</th>
                                                  <th width="150px">Giá bán</th>
                                                  <th width="150px">Ảnh</th>
                                                  <th style="text-align:right">Thành tiền</th>
                                              </tr>
                                          </thead>
                                          <tbody>
                                            ${order.orderDetails.map((item) => {
                                              return `<tr>
                                              <td style="text-align:left">
                                                  <p style="margin:5px 0 0">
                                                      ${
                                                        item.productDetailId
                                                          .product_id.title
                                                      }
                                                  </p>
                                                  <p style="margin-top:3px">
                                                      <span style="font-size:12px;display:block">
                                                          Màu sắc: ${item.color}
                                                      </span>
                                                      <span style="font-size:12px;display:block">
                                                          Kích thước: ${
                                                            item.size
                                                          }
                                                      </span>
                                                  </p>
                                              </td>
                                              <td style="text-align:center">
                                              ${item.quantity}
                                              </td>
                                              <td style="text-align:center">
                                                  <b>
                                                  ${item.price}
                                                  </b>
                                              </td>
                                              <td style="text-align:right">
                                              <img src="${item.productDetailId.imageColor}" width="130"/>

                                              </td>
                                              <td style="text-align:right">
                                              ${item.price * item.quantity}

                                              </td>
                                          </tr>`;
                                            })}
                                          </tbody>
                                          <tfoot>
${
  order.voucher_code
    ? `                                               <tr>
  <td colspan="3">
      Mã giảm giá
  </td>
  <td style="text-align:right">
      ${order.voucher_code}
  </td>
</tr>`
    : ""  
}
                                              <tr>
                                              <td colspan="3">
                                              Tổng giá trị sản phẩm
                                              </td>
                                              <td></td>
                                              <td style="text-align:right">
                                                  ${order.orderDetails.reduce((acc, item)=>acc+= item.price*item.quantity, 0)}đ
                                                  </td>
                                              </tr>
                                              ${
                                                order.voucher_code
                                                  ? `                                               <tr>
  <td colspan="3">
  Voucher
  </td>
  <td style="text-align:right">
      -${order.voucherDiscounted}
  </td>
</tr>`
                                                  : "<td></td>"
                                              }
${
  order.totalMoney< 540000
    ? `                                               <tr>
  <td colspan="3">
     Phí vận chuyển
  </td><td></td>
  <td style="text-align:right">
      40.000đ
  </td>
</tr>`
    : "<td></td>"
}
                                              <tr>
                                              <td colspan="3">
                                              <b>Tổng thanh toán</b>
                                              </td>
                                              <td></td>
                                                  <td style="text-align:right">
                                                      <b>
                                                      ${order.totalMoney}
                                                      đ
                                                      </b>
                                                  </td>
                                              </tr>
                                              <tr>
                                              <td colspan="3">
                                              <b>Hình thức thanh toán</b>
                                              </td>
                                              <td></td>
                                                  <td style="text-align:right">
                                                      <b>
                                                      ${order.pay_method}

                                                      </b>
                                                  </td>
                                              </tr>
                                          </tfoot>
                                      </table>
                                      <table cellspacing="0" cellpadding="0" border="0" width="100%"
                                          style="margin-top:20px;font-size:14px;line-height:24px">
                                          <tbody>
                                              <tr>
                                                  <td width="50px">
                                                      <img src="https://ci3.googleusercontent.com/meips/ADKq_NYwOwoQrnlN7wuTHaIgFIe4Pmb5nYUelNwREgQAQL3c6BZ88TNIH1pM6rQ-XFk0z8ocauR5xzqi5W2s06gzixo=s0-d-e1-ft#https://mcdn.coolmate.me/uploads/icon2.png"
                                                          alt="" class="CToWUd" data-bit="iit">
                                                  </td>
                                                  <td>
                                                      <p style="font-weight:bold;margin:0 0 5px">
                                                          Quý khách cần được hỗ trợ ngay?
                                                      </p>
                                                      Chỉ cần phản hồi đến <a href="mailto:cool@coolmate.me"
                                                          style="text-decoration:none;color:black" target="_blank">
                                                          <b>
                                                              <span class="il">hustle</span>@<span
                                                                  class="il">hustle</span>.me
                                                          </b>
                                                      </a>
                                                      , hoặc gọi số điện thoại <a href="tel:1900272737"
                                                          style="text-decoration:none;color:black" target="_blank">
                                                          <b>1900272737</b>
                                                      </a> hoặc inbox trực tiếp cho
                                                      <span class="il">hustle</span> <a
                                                          href="https://www.facebook.com/hustle.me/"
                                                          style="text-decoration:none;color:black" target="_blank"
                                                          data-saferedirecturl="http://localhost:5173/">
                                                          <b>
                                                              tại đây
                                                          </b>
                                                      </a> (8-21h cả T7,CN).
                                                  </td>
                                              </tr>
                                              <tr>
                                                  <td width="50px">
                                                      <img src="https://ci3.googleusercontent.com/meips/ADKq_NZIQiwtKxZ2JsnRpLSm3YuogGH0I-spV8YZsRf4OT1hww5NmTGJlOve0DVL73-OXCOPJ-VTxcnwWSEiOi76duA=s0-d-e1-ft#https://mcdn.coolmate.me/uploads/icon5.png"
                                                          alt="" class="CToWUd" data-bit="iit">
                                                  </td>
                                                  <td>
                                                      <p style="margin:20px 0">
                                                          Quý khách hàng có thể tham khảo thêm <a
                                                              href="https://coolmate.me/page/chinh-sach-bao-mat-thong-tin-ca-nhan"
                                                              style="color:black;text-decoration:none" target="_blank"
                                                              data-saferedirecturl="https://www.google.com/url?q=https://coolmate.me/page/chinh-sach-bao-mat-thong-tin-ca-nhan&amp;source=gmail&amp;ust=1702918315569000&amp;usg=AOvVaw3XHL0Tc71B0_xDWJ38net5">
                                                              <b>
                                                                  chính sách bảo mật thông tin cá nhân
                                                              </b>
                                                          </a>
                                                          <br>
                                                          và
                                                          <a href="https://coolmate.me/page/chinh-sach-doi-tra"
                                                              style="color:black;text-decoration:none" target="_blank"
                                                              data-saferedirecturl="https://www.google.com/url?q=https://coolmate.me/page/chinh-sach-doi-tra&amp;source=gmail&amp;ust=1702918315569000&amp;usg=AOvVaw24NTP2Bk2BiyT7BXnvNymg">
                                                              <b>
                                                                  chính sách đổi trả hàng.
                                                              </b>
                                                          </a>
                                                      </p>
                                                  </td>
                                              </tr>
                                              <tr>
                                                  <td width="50px">
                                                      <img src="https://ci3.googleusercontent.com/meips/ADKq_NZfE--Rkygec21FoMsLAmv3C4ICJI4fphfuVE-nV6DYvEKTJUo9fdwUxnLdNVpEDHoIjFa9F8cgY47DuIfhxv4=s0-d-e1-ft#https://mcdn.coolmate.me/uploads/icon6.png"
                                                          alt="" class="CToWUd" data-bit="iit">
                                                  </td>
                                                  <td>
                                                      <p style="margin:0 0 20px">
                                                          Quý khách hãy cảnh giác với các cuộc gọi nhận quà tặng không
                                                          phải từ <span class="il">Coolmate</span>.
                                                          Tất cả các chương trình tặng quà tri ân chính thức từ <span
                                                              class="il">Coolmate</span> tới bạn đều là
                                                          <b>MIỄN PHÍ</b>.
                                                          <a href="https://www.coolmate.me/page/qua-tang-tu-coolmate-bao-mat-thong-tin-khach-hang"
                                                              style="color:black;text-decoration:none" target="_blank"
                                                              data-saferedirecturl="https://www.google.com/url?q=https://www.coolmate.me/page/qua-tang-tu-coolmate-bao-mat-thong-tin-khach-hang&amp;source=gmail&amp;ust=1702918315570000&amp;usg=AOvVaw0lwYYG-kh3fH49wzKthupm">
                                                              <b>
                                                                  Thông tin thêm tại đây
                                                              </b>
                                                          </a>.
                                                      </p>
                                                  </td>
                                              </tr>
                                          </tbody>
                                      </table>
                                  </div>
                              </td>
                          </tr>
  
                      </tbody>
                  </table>
  
              </td>
          </tr>
      </tbody>
  </table>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending confirmation email:", error);
  }
};
