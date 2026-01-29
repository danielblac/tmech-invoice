"use client";
import { useState, useEffect, useRef } from "react";
import { X, Plus, Trash2, Printer, Edit } from "lucide-react";
import Image from "next/image";

const InvoiceApp = () => {
  const initialInvoiceData = {
    invoiceNo: "TMECH0199",
    invoiceDate: "14 Oct, 2025",
    dueDate: "04 Nov, 2025",
    billTo: {
      name: "FROSHTECH ACADEMY",
      address: "km 16, Jakande bustop Lekki, Lagos",
    },
    items: [
      {
        id: 1,
        description: "Student Uniform (12M & 12 L)",
        price: 15000,
        qty: 24,
      },
      {
        id: 2,
        description: "Standard Face Caps",
        price: 5000,
        qty: 24,
      },
    ],
    discount: 0,
    deliveryFee: 0,
    customInfo: [
      "Delivery fee = on the client",
      "Fabric color = Navy Blue and Maroon",
      "Branding = Company logo",
    ],
  };

  const contentRef = useRef(null);
  const [invoiceData, setInvoiceData] = useState(initialInvoiceData);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    const savedData = sessionStorage.getItem("tmech_invoice_data");
    if (savedData) {
      setInvoiceData(JSON.parse(savedData));
    }
  }, []);

  const calculateLineTotal = (price, qty) => {
    return price * qty;
  };

  const calculateSubtotal = (items) => {
    return items.reduce(
      (sum, item) => sum + calculateLineTotal(item.price, item.qty),
      0,
    );
  };

  const calculateVAT = (subtotal, discount, deliveryFee) => {
    const taxableAmount = subtotal - discount + deliveryFee;
    return taxableAmount * 0.075; // 7.5% VAT
  };

  const calculateTotal = (items, discount, deliveryFee) => {
    const subtotal = calculateSubtotal(items);
    const vat = calculateVAT(subtotal, discount, deliveryFee);
    return subtotal - discount + deliveryFee + vat;
  };

  const formatCurrency = (amount) => {
    return `₦${amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEditClick = () => {
    setEditData(JSON.parse(JSON.stringify(invoiceData)));
    setIsEditModalOpen(true);
  };

  const handleSave = () => {
    setInvoiceData(editData);
    sessionStorage.setItem("tmech_invoice_data", JSON.stringify(editData));
    setIsEditModalOpen(false);
  };

  const handleAddItem = () => {
    const newItem = {
      id: Date.now(),
      description: "",
      price: 0,
      qty: 1,
    };
    setEditData({
      ...editData,
      items: [...editData.items, newItem],
    });
  };

  const handleRemoveItem = (id) => {
    if (editData.items.length > 1) {
      setEditData({
        ...editData,
        items: editData.items.filter((item) => item.id !== id),
      });
    }
  };

  const handleItemChange = (id, field, value) => {
    setEditData({
      ...editData,
      items: editData.items.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === "price" || field === "qty"
                  ? Number(value) || 0
                  : value,
            }
          : item,
      ),
    });
  };

  const handleAddCustomInfo = () => {
    setEditData({
      ...editData,
      customInfo: [...editData.customInfo, ""],
    });
  };

  const handleRemoveCustomInfo = (index) => {
    setEditData({
      ...editData,
      customInfo: editData.customInfo.filter((_, i) => i !== index),
    });
  };

  const handleCustomInfoChange = (index, value) => {
    const newCustomInfo = [...editData.customInfo];
    newCustomInfo[index] = value;
    setEditData({
      ...editData,
      customInfo: newCustomInfo,
    });
  };

  const subtotal = calculateSubtotal(invoiceData.items);
  const vat = calculateVAT(
    subtotal,
    invoiceData.discount,
    invoiceData.deliveryFee,
  );
  const total = calculateTotal(
    invoiceData.items,
    invoiceData.discount,
    invoiceData.deliveryFee,
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 text-black">
      <style jsx global>{`
        @media print {
          /* Force exact color printing for iOS */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          /* Remove all default page margins */
          @page {
            margin: 0 !important;
            padding: 0 !important;
            size: A4 portrait;
          }

          /* Hide everything except print area */
          body * {
            visibility: hidden !important;
          }

          .print-area,
          .print-area * {
            visibility: visible !important;
          }

          /* Position print area */
          .print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            right: 0 !important; /* ADDED THIS LINE */
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            box-shadow: none !important; /* ADDED THIS LINE */
          }

          /* Force white background */
          html,
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
            width: 100% !important;
          }

          /* Hide buttons and modal */
          .no-print {
            display: none !important;
            visibility: hidden !important;
          }

          /* Force black text color for iOS Safari */
          .force-black-text {
            color: #000000 !important;
            -webkit-text-fill-color: #000000 !important;
          }

          .force-gray-text {
            color: #101828 !important;
            -webkit-text-fill-color: #101828 !important;
          }

          .force-light-gray-text {
            color: #4a5565 !important;
            -webkit-text-fill-color: #4a5565 !important;
          }

          .force-blue-text {
            color: #172554 !important;
            -webkit-text-fill-color: #172554 !important;
          }

          .force-red-text {
            color: #dc2626 !important;
            -webkit-text-fill-color: #dc2626 !important;
          }

          /* Ensure backgrounds print */
          .print-bg-black {
            background-color: #000000 !important;
            background: #000000 !important;
          }

          .print-bg-red {
            background-color: #dc2626 !important;
            background: #dc2626 !important;
          }

          .print-bg-blue {
            background-color: #172554 !important;
            background: #172554 !important;
          }

          /* Prevent page breaks */
          .print-area {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          /* Remove any container padding/margin */
          .max-w-6xl {
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Ensure proper sizing */
          .print-container {
            width: 100% !important;
            min-height: 297mm !important;
            max-height: 297mm !important;
            overflow: hidden !important;
          }

          .print-area .relative > div {
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
        }

        .no-print input,
        .no-print textarea,
        .no-print label,
        .no-print h2,
        .no-print h3,
        .no-print span,
        .no-print p,
        .no-print button {
          color: #000000 !important;
          -webkit-text-fill-color: #000000 !important;
        }

        .no-print input::placeholder {
          color: #9ca3af !important;
          -webkit-text-fill-color: #9ca3af !important;
        }

        /* Ensure white text stays white on colored buttons */
        .no-print button.bg-blue-600,
        .no-print button.bg-green-600,
        .no-print button.bg-red-600 {
          color: #ffffff !important;
          -webkit-text-fill-color: #ffffff !important;
        }

        .no-print .text-gray-500 {
          color: #6b7280 !important;
          -webkit-text-fill-color: #6b7280 !important;
        }

        .no-print .text-red-600 {
          color: #dc2626 !important;
          -webkit-text-fill-color: #dc2626 !important;
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        <div
          ref={contentRef}
          className="print-area bg-white shadow-lg min-h-[279mm] flex flex-col"
        >
          {/* Modern Clean Header */}
          <div className="px-2 pt-6 border-b-2 border-red-200">
            <div className="flex justify-between items-start mb-6">
              {/* Logo and Company Info */}
              <div>
                <div className="flex items-center gap-4">
                  <Image
                    src="/images/t.mech-logo.jpg"
                    alt="T.Mech Exclusive Logo"
                    className="w-[300] h-[145] object-contain"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                    width={909}
                    height={446}
                  />
                </div>
                <div className="space-y-1">
                  <p>
                    <strong className="text-gray-900 force-gray-text">
                      Email:
                    </strong>{" "}
                    taylor.mechanic018@gmail.com
                  </p>
                  <p>
                    <strong className="text-gray-900 force-gray-text">
                      Phone:
                    </strong>{" "}
                    +2349057336051
                  </p>
                </div>
              </div>

              {/* Invoice Title and Details */}
              <div className="text-right">
                <h1 className="text-5xl font-bold mb-2 text-blue-950 force-blue-text">
                  INVOICE
                </h1>
                <div className="space-y-1">
                  <p className="text-gray-900 force-gray-text force-light-gray-text">
                    <span className="font-semibold">Invoice No:</span>{" "}
                    {invoiceData.invoiceNo}
                  </p>
                  <p className="text-gray-900 force-gray-text force-light-gray-text">
                    <span className="font-semibold">Invoice Date:</span>{" "}
                    {invoiceData.invoiceDate}
                  </p>
                  <p className="text-gray-900 force-gray-text force-light-gray-text">
                    <span className="font-semibold">Due Date:</span>{" "}
                    {invoiceData.dueDate}
                  </p>
                </div>
                <div className="mt-6">
                  <p className="text-sm font-semibold text-gray-600 mb-1 force-black-text">
                    BILL TO
                  </p>
                  <p className="text-2xl font-bold force-black-text">
                    {invoiceData.billTo.name}
                  </p>
                  <p className="text-gray-700 force-black-text">
                    {invoiceData.billTo.address}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="px-2 flex-1">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-red-600">
                  <th className="text-left py-3 font-bold uppercase text-blue-950 force-blue-text">
                    Description
                  </th>
                  <th className="text-center py-3 font-bold uppercase text-blue-950 force-blue-text">
                    Price
                  </th>
                  <th className="text-center py-3 font-bold uppercase text-blue-950 force-blue-text">
                    Qty
                  </th>
                  <th className="text-right py-3 font-bold uppercase text-blue-950 force-blue-text">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="py-4 text-gray-900 force-gray-text">
                      {item.description}
                    </td>
                    <td className="py-4 text-center text-gray-700 force-gray-text">
                      ₦{item.price.toLocaleString()}
                    </td>
                    <td className="py-4 text-center text-gray-700 force-gray-text">
                      {item.qty}
                    </td>
                    <td className="py-4 text-right font-semibold text-gray-900 force-gray-text">
                      ₦
                      {calculateLineTotal(
                        item.price,
                        item.qty,
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Custom Info and Totals */}
            <div className="mt-6 flex justify-between gap-8">
              {/* Custom Information */}
              <div className="flex-1">
                <h3 className="font-bold text-blue-950 force-blue-text mb-3 uppercase">
                  Custom Information
                </h3>
                <div className="space-y-1 text-gray-700 force-gray-text">
                  {invoiceData.customInfo.map((info, index) => (
                    <p key={index}>{info}</p>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="w-96">
                <div className="space-y-3">
                  <div className="flex justify-between text-blue-950 force-blue-text">
                    <span>Sub-total:</span>
                    <span className="font-semibold">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-blue-950 force-blue-text">
                    <span>Discount:</span>
                    <span className="font-semibold">
                      {formatCurrency(invoiceData.discount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-blue-950 force-blue-text">
                    <span>Delivery Fee:</span>
                    <span className="font-semibold">
                      {formatCurrency(invoiceData.deliveryFee)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-3 text-blue-950 force-blue-text">
                    <span>VAT (7.5%):</span>
                    <span className="font-semibold">{formatCurrency(vat)}</span>
                  </div>
                  <div className="flex justify-between bg-blue-950 print-bg-blue text-white px-4 py-4 rounded-lg mt-3">
                    <span className="font-bold text-base uppercase">
                      Total:
                    </span>
                    <span className="text-2xl font-bold">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment and Terms */}
            <div className="mt-6 grid grid-cols-2 gap-8">
              {/* Payment Method */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="font-bold text-blue-950 force-blue-text uppercase">
                    Payment Method
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <p className="text-gray-900 force-gray-text">
                      <span className="font-semibold">Account No:</span>{" "}
                      6571460376
                    </p>
                    <p className="text-gray-700 force-light-gray-text">
                      <span className="font-semibold">Account Name:</span>{" "}
                      T-MECH EXCLUSIVE SERVICES
                    </p>
                    <p className="text-gray-700 force-light-gray-text">
                      <span className="font-semibold">Bank Name:</span>{" "}
                      MONIEPOINT
                    </p>
                  </div>

                  <div className="pt-5 mt-22">
                    <p className="font-bold text-red-600 mb-3 force-red-text text-sm uppercase">
                      Note:
                    </p>
                    <p className="font-bold text-gray-900 mt-1">
                      THIS INVOICE IS VALID FOR 30 DAYS
                    </p>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-red-600 mb-3 force-red-text uppercase">
                    Terms & Conditions
                  </h3>
                </div>
                <ol className="space-y-1 list-decimal list-inside text-gray-700 leading-relaxed">
                  <li>Payment Validates Order</li>
                  <li>
                    Minimum of 80% initial payment of the total charge required
                  </li>
                  <li>
                    Product will be delivered within 14 to 21 working days from
                    the date of initial payment.
                  </li>
                  <li>
                    Enjoy 3% discount when you make an outright payment (Only
                    After 3 consecutive outright payments)
                  </li>
                  <li>Payment balance to be paid on or before delivery.</li>
                  <li>Kindly send proof of payment for confirmation.</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-blue-950 print-bg-blue px-2 py-4 text-center mt-2">
            <p className="font-bold text-sm text-white tracking-wide">
              THANK YOU FOR YOUR BUSINESS
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="no-print mt-6 flex gap-4 justify-center">
          <button
            onClick={handleEditClick}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            <Edit size={20} />
            Edit Invoice
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            <Printer size={20} />
            Print Invoice
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editData && (
        <div className="no-print fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold">Edit Invoice</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Invoice No
                  </label>
                  <input
                    type="text"
                    value={editData.invoiceNo}
                    onChange={(e) =>
                      setEditData({ ...editData, invoiceNo: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Invoice Date
                  </label>
                  <input
                    type="text"
                    value={editData.invoiceDate}
                    onChange={(e) =>
                      setEditData({ ...editData, invoiceDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Due Date
                  </label>
                  <input
                    type="text"
                    value={editData.dueDate}
                    onChange={(e) =>
                      setEditData({ ...editData, dueDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Bill To */}
              <div>
                <h3 className="text-lg font-bold mb-3">Bill To</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editData.billTo.name}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          billTo: { ...editData.billTo, name: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={editData.billTo.address}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          billTo: {
                            ...editData.billTo,
                            address: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold">Items</h3>
                  <button
                    onClick={handleAddItem}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <Plus size={16} />
                    Add Item
                  </button>
                </div>
                <div className="space-y-3">
                  {editData.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-3">
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold mb-1">
                              Description
                            </label>
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) =>
                                handleItemChange(
                                  item.id,
                                  "description",
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold mb-1">
                              Price (₦)
                            </label>
                            <input
                              type="number"
                              value={item.price}
                              onChange={(e) =>
                                handleItemChange(
                                  item.id,
                                  "price",
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold mb-1">
                              Qty
                            </label>
                            <input
                              type="number"
                              value={item.qty}
                              onChange={(e) =>
                                handleItemChange(item.id, "qty", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        {editData.items.length > 1 && (
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="mt-6 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Charges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Discount (₦)
                  </label>
                  <input
                    type="number"
                    value={editData.discount}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        discount: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Delivery Fee (₦)
                  </label>
                  <input
                    type="number"
                    value={editData.deliveryFee}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        deliveryFee: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Custom Information */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold">Custom Information</h3>
                  <button
                    onClick={handleAddCustomInfo}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Plus size={16} />
                    Add Line
                  </button>
                </div>
                <div className="space-y-2">
                  {editData.customInfo.map((info, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={info}
                        onChange={(e) =>
                          handleCustomInfoChange(index, e.target.value)
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter custom information..."
                      />
                      <button
                        onClick={() => handleRemoveCustomInfo(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals Display */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">Subtotal:</span>
                  <span>
                    {formatCurrency(calculateSubtotal(editData.items))}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">Discount:</span>
                  <span>{formatCurrency(editData.discount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">Delivery Fee:</span>
                  <span>{formatCurrency(editData.deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-sm border-t pt-2">
                  <span className="font-semibold">VAT (7.5%):</span>
                  <span>
                    {formatCurrency(
                      calculateVAT(
                        calculateSubtotal(editData.items),
                        editData.discount,
                        editData.deliveryFee,
                      ),
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>
                    {formatCurrency(
                      calculateTotal(
                        editData.items,
                        editData.discount,
                        editData.deliveryFee,
                      ),
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t sticky bottom-0 bg-white">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceApp;
