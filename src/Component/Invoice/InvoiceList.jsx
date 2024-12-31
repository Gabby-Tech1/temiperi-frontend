import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { asset } from '../../assets/assets';
import './invoice.css';

const baseURL = process.env.NODE_ENV === 'production'
  ? "https://temiperi-stocks-backend.onrender.com/temiperi"
  : "http://localhost:4000/temiperi";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/get-invoices`);
      setInvoices(response.data.invoices);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setError('Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = (invoice) => {
    setSelectedInvoice(invoice);
    // Use setTimeout to ensure the print content is rendered
    setTimeout(() => {
      window.print();
    }, 100);
  };

  if (loading) return <div>Loading invoices...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="invoice-list-container">
      <div className="invoice-list">
        <h2>Invoices</h2>
        <table>
          <thead>
            <tr>
              <th>Invoice Number</th>
              <th>Customer Name</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice._id}>
                <td>{invoice.invoiceNumber}</td>
                <td>{invoice.customerName}</td>
                <td>GH₵{invoice.totalAmount.toFixed(2)}</td>
                <td>{invoice.status}</td>
                <td>{new Date(invoice.createdAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handlePrint(invoice)}>Print</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Print Preview Section - Only visible when printing */}
      <div className="print-section" style={{ display: 'none' }}>
        {selectedInvoice && (
          <div className="invoice-preview">
            <div className="preview-header">
              <img src={asset.logo} alt="Company Logo" width={100} />
              <div className="preview-date">
                <p>Date: {new Date(selectedInvoice.createdAt).toLocaleDateString()}</p>
                <p>Time: {new Date(selectedInvoice.createdAt).toLocaleTimeString()}</p>
              </div>
            </div>

            <div className="preview-customer-info">
              <div>
                <h4>Invoice #: {selectedInvoice.invoiceNumber}</h4>
                <h4>Customer: {selectedInvoice.customerName}</h4>
              </div>
            </div>

            <h3>Order Summary</h3>
            <table className="preview-table">
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
                {selectedInvoice.items.map((item, index) => {
                  // Get the correct price based on quantity
                  const isWholesale = item.quantity > 10;
                  const unitPrice = isWholesale 
                    ? (item.price?.wholeSale_price || 0)
                    : (item.price?.retail_price || 0);
                  
                  const itemTotal = (item.quantity || 0) * (unitPrice || 0);
                  
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.description}</td>
                      <td>{item.quantity || 0}</td>
                      <td>
                        <span className="currency-symbol">GH₵</span>
                        {(unitPrice || 0).toFixed(2)}
                        <span className="price-type">
                          ({isWholesale ? 'Wholesale' : 'Retail'})
                        </span>
                      </td>
                      <td>
                        <span className="currency-symbol">GH₵</span>
                        {itemTotal.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4"><strong>Total Amount:</strong></td>
                  <td>
                    <strong>
                      <span className="currency-symbol">GH₵</span>
                      {(selectedInvoice.totalAmount || 0).toFixed(2)}
                    </strong>
                  </td>
                </tr>
              </tfoot>
            </table>

            <div className="preview-footer">
              <div className="signature-section">
                <div className="signature-box">
                  <p>____________________</p>
                  <p>Authorized Signature</p>
                </div>
              </div>
              <div className="terms-section">
                <p>All Terms & Conditions applied</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceList;
