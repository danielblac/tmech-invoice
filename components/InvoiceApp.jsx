"use client";
import { useState, useEffect, useRef } from "react";
import { X, Plus, Trash2, Printer, Edit } from "lucide-react";
import Image from "next/image";
import { useReactToPrint } from "react-to-print";

const InvoiceApp = () => {
  const initialInvoiceData = {
    invoiceNo: "TMECH0199",
    dueDate: "14 Oct, 2025",
    invoiceDate: "04 Nov, 2025",
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
    const savedData = localStorage.getItem("tmech_invoice_data");
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
      0
    );
  };

  const calculateTotal = (items, discount) => {
    return calculateSubtotal(items) - discount;
  };

  const formatCurrency = (amount) => {
    return `₦${amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // const handlePrint = useReactToPrint({
  //   content: () => contentRef.current,
  //   documentTitle: "Your Document Name",
  //   pageStyle: `
  //     @page {
  //       size: auto;
  //       margin: 0mm;
  //     }
  //     @media print {
  //       body {
  //         -webkit-print-color-adjust: exact;
  //         print-color-adjust: exact;
  //         color-adjust: exact;
  //       }print-container
  //       * {
  //         margin: 0 !important;
  //         padding: 0 !important;
  //       }
  //     }
  //   `,
  // });

  const handlePrint = useReactToPrint({ contentRef });

  const handleEditClick = () => {
    setEditData(JSON.parse(JSON.stringify(invoiceData)));
    setIsEditModalOpen(true);
  };

  const handleSave = () => {
    setInvoiceData(editData);
    localStorage.setItem("tmech_invoice_data", JSON.stringify(editData));
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
          : item
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
  const total = calculateTotal(invoiceData.items, invoiceData.discount);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area,
          .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
          .bg-gray-50 {
            background: white !important;
          }
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        <div
          ref={contentRef}
          className="print-area bg-white shadow-lg overflow-hidden min-h-screen flex flex-col"
        >
          {/* Header */}
          <div className="relative">
            <div className="absolute top-0 right-0 w-full h-8 bg-black"></div>
            <div
              className="absolute top-0 left-0 w-56 h-12 bg-red-600"
              style={{ clipPath: "polygon(0 0, 100% 0, 85% 100%, 0 100%)" }}
            ></div>
          </div>

          <main className="flex-1">
            <div className="px-6 pt-12 pb-6 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-4 mb-2">
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
                    <strong>Address:</strong> 72, Ojuelegba road, beside GT
                    Bank, Lagos
                  </p>
                  <p>
                    <strong>Email:</strong> taylor.mechanic018@gmail.com
                  </p>
                  <p>
                    <strong>Phone:</strong> +2349057336051
                  </p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-5xl font-bold mb-2">INVOICE</h2>
                <div className="space-y-1">
                  <p>
                    <strong>Invoice No:</strong> {invoiceData.invoiceNo}
                  </p>
                  <p>
                    <strong>Due Date:</strong> {invoiceData.dueDate}
                  </p>
                  <p>
                    <strong>Invoice Date:</strong> {invoiceData.invoiceDate}
                  </p>
                </div>
                <div className="mt-6">
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    BILL TO
                  </p>
                  <p className="text-2xl font-bold">
                    {invoiceData.billTo.name}
                  </p>
                  <p className="text-gray-700">{invoiceData.billTo.address}</p>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="px-6">
              <table className="w-full border-t border-red-600">
                <thead>
                  <tr className="border-b border-red-600">
                    <th className="text-left pt-3 pb-2 font-bold">
                      DESCRIPTION
                    </th>
                    <th className="text-center pt-3 pb-2 font-bold">PRICE</th>
                    <th className="text-center pt-3 pb-2 font-bold">QTY</th>
                    <th className="text-right pt-3 pb-2 font-bold">SUBTOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((item, index) => (
                    <tr
                      key={item.id}
                      // className={
                      //   index !== invoiceData.items.length - 1
                      //     ? "border-b border-gray-200"
                      //     : ""
                      // }
                    >
                      <td className="py-2">{item.description}</td>
                      <td className="py-2 text-center">
                        ₦{item.price.toLocaleString()}
                      </td>
                      <td className="py-2 text-center">{item.qty}</td>
                      <td className="py-2 text-right font-semibold">
                        ₦
                        {calculateLineTotal(
                          item.price,
                          item.qty
                        ).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-6 flex justify-between">
                <div>
                  <p className="font-bold mb-3">Custom Information:</p>
                  <div className="space-y-1">
                    {invoiceData.customInfo.map((info, index) => (
                      <p key={index}>{info}</p>
                    ))}
                  </div>
                </div>
                <div className="w-80">
                  <div className="flex justify-between py-2">
                    <span>Sub-total :</span>
                    <span className="font-semibold">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Discount :</span>
                    <span className="font-semibold">
                      {formatCurrency(invoiceData.discount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg py-3 px-2 bg-blue-950 text-white font-bold rounded">
                    <span>Total :</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="px-6 pt-8 pb-2 flex gap-12">
              <div className="flex-1">
                <h3 className="font-bold mb-3">PAYMENT METHOD</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Account No:</strong> 7825836128
                  </p>
                  <p>
                    <strong>Account Name:</strong> Imoninya Raymond
                  </p>
                  <p>
                    <strong>Bank Name:</strong> Pocket App
                  </p>
                </div>
                <div className="mt-4 space-y-1 text-sm">
                  <p className="font-bold">ATLERNATE ACCOUNT</p>
                  <p>
                    <strong>Account No:</strong> 1006027241
                  </p>
                  <p>
                    <strong>Account Name:</strong> Imoninya Raymond
                  </p>
                  <p>
                    <strong>Bank Name:</strong> VFD Microfinance bank
                  </p>
                </div>
                <div className="mt-4 text-sm">
                  <p className="font-bold text-red-600">NOTE:</p>
                  <p className="font-bold">THIS INVOICE IS VALID FOR 30 DAYS</p>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-red-600 mb-3">
                  TERMS AND CONDITIONS
                </h3>
                <ol className="space-y-2 text-sm list-decimal list-inside">
                  <li>Payment Validates Order</li>
                  <li>
                    Minimum of 80% initial payment of the total charge required
                  </li>
                  <li>
                    Product will be delivered within 14 to 21 working days from
                    the date of initial payment.
                  </li>
                  <li>
                    Enjoy 3% discount when you make an outright payment(Only
                    After 3 consecutive outright payments)
                  </li>
                  <li>Payment balance to be paid on or before delivery.</li>
                  <li>Kindly send proof of payment for confirmation.</li>
                </ol>
              </div>
            </div>
          </main>

          {/* Footer */}
          <div className="relative pt-2 mt-auto">
            <div className="absolute bottom-0 left-0 w-full h-8 bg-black"></div>
            <div
              className="absolute bottom-0 right-0 w-48 h-12 bg-red-600"
              style={{ clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0 100%)" }}
            ></div>
            <p className="px-6 pb-8 font-semibold">
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
            onClick={() => handlePrint()}
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
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold">Edit Invoice</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Basic Info */}
              <div className="grid grid-cols-3 gap-4">
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
              </div>

              {/* Bill To */}
              <div>
                <h3 className="text-lg font-bold mb-3">Bill To</h3>
                <div className="space-y-3">
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
                  {editData.items.map((item, index) => (
                    <div
                      key={item.id}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 grid grid-cols-3 gap-3">
                          <div className="col-span-3">
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
                                  e.target.value
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
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold mb-1">
                              Quantity
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
                          <div>
                            <label className="block text-xs font-semibold mb-1">
                              Total
                            </label>
                            <input
                              type="text"
                              value={formatCurrency(
                                calculateLineTotal(item.price, item.qty)
                              )}
                              disabled
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-100"
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

              {/* Discount */}
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
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>
                    {formatCurrency(
                      calculateTotal(editData.items, editData.discount)
                    )}
                  </span>
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
            </div>

            <div className="flex justify-end gap-3 p-6 border-t">
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
