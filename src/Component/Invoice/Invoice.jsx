import { useEffect, useRef, useState } from "react";
import "./invoice.css";
import { asset } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const devUrl = "http://localhost:4000/temiperi/invoices";
const prodUrl = "https://temiperi-backend.onrender.com/temiperi/invoices";
const baseUrl = window.location.hostname === "localhost" ? devUrl : prodUrl;

const Invoice = () => {
  const [invoices, setInvoices] = useState([]);
  const printRef = useRef();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get(`${baseUrl}`);
        if (response.data && response.data.data) {
          setInvoices(response.data.data);
        } else {
          setInvoices([]);
        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
        toast.error("Failed to fetch invoices. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    };
    fetchInvoices();
  }, []);

  const handlePrint = (invoice) => {
    // Convert logo to base64 to ensure it prints
    const getBase64Image = (img) => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      return canvas.toDataURL("image/png");
    };

    // Preload the image
    const logoImg = new Image();
    logoImg.src = asset.logo;
    logoImg.onload = () => {
      const base64Logo = getBase64Image(logoImg);

      const printableContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              @media print {
                body { 
                  padding: 20px;
                  color: #000 !important;
                }
                th {
                  background-color: #2c3e50 !important;
                  color: white !important;
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
                .preview-customer-info, .terms-section {
                  background-color: #f8f9fa !important;
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
                tfoot td {
                  background-color: #f8f9fa !important;
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
              }
              body {
                font-family: Arial, sans-serif;
                padding: 40px;
                max-width: 800px;
                margin: 0 auto;
                color: #2c3e50;
              }
              .preview-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #eee;
              }
              .preview-company-info {
                text-align: center;
              }
              .preview-company-info h2 {
                color: #2c3e50;
                margin-bottom: 5px;
                font-size: 24px;
              }
              .preview-company-info p {
                color: #666;
                margin: 2px 0;
                font-size: 14px;
              }
              .preview-date {
                text-align: right;
              }
              .preview-customer-info {
                display: flex;
                justify-content: space-between;
                margin-bottom: 30px;
                padding: 15px;
                background-color: #f8f9fa;
                border-radius: 6px;
              }
              .preview-customer-info h4 {
                color: #2c3e50;
                margin: 5px 0;
                font-size: 16px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
                background-color: white;
              }
              th, td {
                padding: 12px;
                text-align: left;
                border-bottom: 1px solid #eee;
              }
              th {
                background-color: #2c3e50;
                color: white;
                font-weight: 500;
                text-transform: uppercase;
                font-size: 14px;
              }
              .currency-symbol {
                color: #666;
                margin-right: 2px;
              }
              tfoot td {
                font-weight: bold;
                background-color: #f8f9fa;
              }
              .signature-section {
                display: flex;
                justify-content: space-between;
                margin: 50px 0 30px;
                padding: 0 50px;
              }
              .signature-box {
                text-align: center;
              }
              .signature-box p:first-child {
                margin-bottom: 10px;
                color: #666;
                border-top: 1px solid #666;
                padding-top: 10px;
              }
              .terms-section {
                padding: 20px;
                background-color: #f8f9fa;
                border-radius: 6px;
                margin-top: 30px;
              }
              .terms-section p {
                font-weight: 600;
                margin-bottom: 10px;
                color: #2c3e50;
              }
              .terms-section small {
                display: block;
                color: #666;
                margin: 5px 0;
                font-size: 12px;
              }
              @media print {
                body { padding: 20px; }
                button { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="preview-header">
              <img src="${base64Logo}" alt="Company Logo" width="100" style="object-fit: contain;" />
              <div class="preview-company-info">
                <h2>Temiperi Enterprise</h2>
                <p>Wholesale and Retail of Drinks</p>
                <p>Contact: +233 24 123 4567</p>
              </div>
              <div class="preview-date">
                <p>Date: ${formattedDate}</p>
                <p>Time: ${formattedTime}</p>
              </div>
            </div>

            <div class="preview-customer-info">
              <div>
                <h4>Invoice #: ${invoice.invoiceNumber}</h4>
                <h4>Customer: ${invoice.customerName}</h4>
              </div>
            </div>

            <h3>Order Summary</h3>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.items
                  .map((item, index) => {
                    const price =
                      item.price.retail_price ||
                      item.price.wholeSale_price ||
                      0;
                    return `
                    <tr>
                      <td>${index + 1}</td>
                      <td>${item.description}</td>
                      <td>${item.quantity}</td>
                      <td><span class="currency-symbol">GH₵</span>${Number(
                        price
                      ).toFixed(2)}</td>
                      <td><span class="currency-symbol">GH₵</span>${(
                        item.quantity * price
                      ).toFixed(2)}</td>
                    </tr>
                  `;
                  })
                  .join("")}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="4"><strong>Total Amount:</strong></td>
                  <td>
                    <strong>
                      <span class="currency-symbol">GH₵</span>${invoice.totalAmount.toFixed(
                        2
                      )}
                    </strong>
                  </td>
                </tr>
              </tfoot>
            </table>

            <div class="signature-section">
              <div class="signature-box">
                <p>____________________</p>
                <p>Authorized Signature</p>
              </div>
            </div>

            <div class="terms-section">
              <p>All Terms & Conditions applied</p>
            </div>
          </body>
          </html>
        `;

      const printWindow = window.open("", "_blank", "width=800,height=600");
      printWindow.document.write(printableContent);
      printWindow.document.close();

      // Wait for images to load before printing
      setTimeout(() => {
        printWindow.print();
        // Optional: close the window after printing
        // printWindow.close();
      }, 500);
    };
  };

  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="invoice_container">
      <img src={asset.logo} alt="" width={120} />

      <div className="date">
        <b>Date: {formattedDate}</b>
        <b> Time: {formattedTime}</b>
      </div>

      <div className="company_name">
        <h1>Invoices</h1>
        <div className="way_bill">
          <h3>Way Bill</h3>
        </div>
      </div>

      <table className="invoice_table">
        <thead>
          <tr>
            <th>Invoice Number</th>
            <th>Customer Name</th>
            <th>Total Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(invoices) &&
            invoices.map((invoice) => (
              <tr key={invoice._id}>
                <td>{invoice.invoiceNumber}</td>
                <td>{invoice.customerName}</td>
                <td>GH{invoice.totalAmount}</td>
                <td>
                  <button
                    onClick={() => handlePrint(invoice)}
                    className="print_btn"
                  >
                    Print
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Invoice;
