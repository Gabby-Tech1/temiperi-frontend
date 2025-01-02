import { useEffect, useRef, useState } from "react";
import "./invoice.css";
import { asset } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const devUrl = "http://localhost:4000/temiperi/invoices";
const prodUrl = "https://temiperi-stocks-backend.onrender.com/temiperi/invoices";
const baseUrl = window.location.hostname === "localhost" ? devUrl : prodUrl;

const Invoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showPhonePrompt, setShowPhonePrompt] = useState(false);
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [currentTotal, setCurrentTotal] = useState(0);
  const printRef = useRef();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get(`${prodUrl}`);
        console.log(response.data)
        if (response.data && response.data.data) {
          // Sort invoices by date, most recent first
          const sortedInvoices = response.data.data.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          );
          setInvoices(sortedInvoices);
          setFilteredInvoices(sortedInvoices);
          
          // Calculate initial total (all invoices)
          const total = sortedInvoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);
          setCurrentTotal(total);
        } else {
          setInvoices([]);
          setFilteredInvoices([]);
          setCurrentTotal(0);
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

  const filterInvoices = (filter) => {
    setActiveFilter(filter);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - 7);

    let filtered;
    switch (filter) {
      case 'today':
        filtered = invoices.filter(invoice => {
          const invoiceDate = new Date(invoice.createdAt);
          return invoiceDate >= today;
        });
        break;
      case 'yesterday':
        filtered = invoices.filter(invoice => {
          const invoiceDate = new Date(invoice.createdAt);
          return invoiceDate >= yesterday && invoiceDate < today;
        });
        break;
      case 'thisWeek':
        filtered = invoices.filter(invoice => {
          const invoiceDate = new Date(invoice.createdAt);
          return invoiceDate >= weekStart;
        });
        break;
      case 'past':
        filtered = invoices.filter(invoice => {
          const invoiceDate = new Date(invoice.createdAt);
          return invoiceDate < weekStart;
        });
        break;
      default:
        filtered = invoices;
    }
    
    // Sort filtered results by date, most recent first
    const sortedFiltered = filtered.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    setFilteredInvoices(sortedFiltered);

    // Calculate total for filtered invoices
    const total = sortedFiltered.reduce((sum, invoice) => sum + invoice.totalAmount, 0);
    setCurrentTotal(total);
  };

  const handlePrint = (invoice) => {
    console.log(invoice)
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
                    const price = typeof item.price === "object" ? (item.price.retail_price || item.price.whole_sale_price || 0) : (item.price || 0)
                    return `
                    <tr>
                      <td>${index + 1}</td>
                      <td>${item.description}</td>
                      <td>${item.quantity}</td>
                      <td><span class="currency-symbol">GH₵</span>${Number(price).toFixed(2)}</td>
                      <td><span class="currency-symbol">GH₵</span>${(item.quantity * Number(price)).toFixed(2)}</td>
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
              <p>Items sold out cannot be returned</p>
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

  const handleWhatsAppShare = (invoice) => {
    setSelectedInvoice(invoice);
    setShowPhonePrompt(true);
  };

  const sendWhatsAppMessage = () => {
    if (!customerPhone || !selectedInvoice) return;

    const message = 
      `*TEMIPERI ENTERPRISE*\n\n` +
      `*Invoice #:* ${selectedInvoice.invoiceNumber}\n` +
      `*Customer:* ${selectedInvoice.customerName}\n` +
      `*Date:* ${new Date(selectedInvoice.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      })}\n` +
      `*Time:* ${new Date(selectedInvoice.createdAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
      })}\n\n` +
      `*Order Details:*\n` +
      `${selectedInvoice.items.map((item, index) => 
        `${index + 1}. ${item.description} - Qty: ${item.quantity}, Price: GH₵${item.price.toFixed(2)}`
      ).join("\n")}\n\n` +
      `*Total Amount:* GH₵${selectedInvoice.totalAmount.toFixed(2)}\n\n` +
      `Thank you for your business!`;

    const whatsappUrl = `https://wa.me/${customerPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    setShowPhonePrompt(false);
    setCustomerPhone("");
    setSelectedInvoice(null);
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
      {showPhonePrompt && (
        <div className="phone-prompt-overlay">
          <div className="phone-prompt-modal">
            <h3>Enter Customer's WhatsApp Number</h3>
            <p>Please include country code (e.g., 233 for Ghana)</p>
            <input
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="e.g., 233XXXXXXXXX"
            />
            <div className="phone-prompt-buttons">
              <button onClick={sendWhatsAppMessage}>Send</button>
              <button onClick={() => {
                setShowPhonePrompt(false);
                setCustomerPhone("");
                setSelectedInvoice(null);
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      

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

      <div className="filter-buttons">
        <button 
          className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => filterInvoices('all')}
        >
          All Invoices
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'today' ? 'active' : ''}`}
          onClick={() => filterInvoices('today')}
        >
          Today's Invoices
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'yesterday' ? 'active' : ''}`}
          onClick={() => filterInvoices('yesterday')}
        >
          Yesterday's Invoices
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'thisWeek' ? 'active' : ''}`}
          onClick={() => filterInvoices('thisWeek')}
        >
          This Week's Invoices
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'past' ? 'active' : ''}`}
          onClick={() => filterInvoices('past')}
        >
          Past Invoices
        </button>
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
          {Array.isArray(filteredInvoices) &&
            filteredInvoices.map((invoice) => (
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
                  <button
                    onClick={() => handleWhatsAppShare(invoice)}
                    className="whatsapp_btn"
                  >
                    WhatsApp
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="daily-total">
        <h3>
          {activeFilter === 'all' && "Total Sales: "}
          {activeFilter === 'today' && "Today's Total Sales: "}
          {activeFilter === 'yesterday' && "Yesterday's Total Sales: "}
          {activeFilter === 'thisWeek' && "This Week's Total Sales: "}
          {activeFilter === 'past' && "Past Total Sales: "}
          <span className="amount">GH₵{currentTotal.toFixed(2)}</span>
        </h3>
      </div>
    </div>
  );
};

export default Invoice;
