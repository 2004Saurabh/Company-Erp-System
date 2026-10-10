import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import Input from '../Input';
import Select from '../Select';
import { useERP } from '../../context/ERPContext';
import { ShoppingCart, Plus, Trash2, Calendar, FileText, Building2 } from 'lucide-react';

export const PurchaseOrderModal = ({ isOpen, onClose }) => {
  const { inventorySuppliers, inventoryProducts, createPurchaseOrder } = useERP();

  const [supplierName, setSupplierName] = useState('');
  const [expectedDelivery, setExpectedDelivery] = useState('2026-10-25');
  const [notes, setNotes] = useState('Quarterly hardware refresh & infrastructure requisitions');
  const [items, setItems] = useState([
    {
      productId: inventoryProducts[0]?.id || '',
      sku: inventoryProducts[0]?.sku || '',
      name: inventoryProducts[0]?.name || '',
      quantity: 5,
      unitCost: inventoryProducts[0]?.costPrice || 5000
    }
  ]);

  useEffect(() => {
    if (inventorySuppliers.length > 0) {
      setSupplierName(inventorySuppliers[0].name);
    }
    if (inventoryProducts.length > 0) {
      const p = inventoryProducts[0];
      setItems([
        {
          productId: p.id,
          sku: p.sku,
          name: p.name,
          quantity: 5,
          unitCost: p.costPrice
        }
      ]);
    }
  }, [isOpen, inventorySuppliers, inventoryProducts]);

  const handleProductChange = (index, prodId) => {
    const prd = inventoryProducts.find(p => p.id === prodId);
    if (!prd) return;

    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      productId: prd.id,
      sku: prd.sku,
      name: prd.name,
      unitCost: prd.costPrice
    };
    setItems(newItems);
  };

  const handleQuantityChange = (index, qty) => {
    const newItems = [...items];
    newItems[index].quantity = Math.max(1, Number(qty) || 1);
    setItems(newItems);
  };

  const handleUnitCostChange = (index, cost) => {
    const newItems = [...items];
    newItems[index].unitCost = Math.max(0, Number(cost) || 0);
    setItems(newItems);
  };

  const addItemRow = () => {
    const fallback = inventoryProducts[0] || { id: 'PRD-NEW', sku: 'SKU-NEW', name: 'Item', costPrice: 1000 };
    setItems(prev => [
      ...prev,
      {
        productId: fallback.id,
        sku: fallback.sku,
        name: fallback.name,
        quantity: 1,
        unitCost: fallback.costPrice
      }
    ]);
  };

  const removeItemRow = (index) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const totalAmount = items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unitCost)), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!supplierName) return;

    createPurchaseOrder({
      supplierName,
      expectedDelivery,
      notes,
      items
    });
    onClose();
  };

  const supplierOptions = inventorySuppliers.map(s => ({ value: s.name, label: s.name }));
  const productOptions = inventoryProducts.map(p => ({
    value: p.id,
    label: `${p.name} (${p.sku})`
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Procurement Purchase Order"
      subtitle="Requisition batch equipment inventory with automatic warehouse intake upon receipt"
      maxWidth="max-w-3xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Total Requisition: <span className="text-lg font-bold text-primary-600 dark:text-primary-400">₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Issue Purchase Order
            </Button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Vendor / Supplier"
            options={supplierOptions}
            value={supplierName}
            onChange={(val) => setSupplierName(val)}
          />

          <Input
            label="Expected Delivery Due Date"
            type="date"
            value={expectedDelivery}
            onChange={(e) => setExpectedDelivery(e.target.value)}
            leftIcon={<Calendar className="w-4 h-4 text-slate-400" />}
          />
        </div>

        {/* Line Items Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Procurement Items ({items.length})
            </label>
            <Button type="button" size="sm" variant="outline" icon={Plus} onClick={addItemRow}>
              Add Product Line
            </Button>
          </div>

          <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-3 py-2.5">Product Asset</th>
                  <th className="px-3 py-2.5 w-24">Qty</th>
                  <th className="px-3 py-2.5 w-32">Unit Cost (₹)</th>
                  <th className="px-3 py-2.5 w-32 text-right">Subtotal</th>
                  <th className="px-3 py-2.5 w-12 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {items.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-2">
                      <select
                        className="w-full px-2.5 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        value={row.productId}
                        onChange={(e) => handleProductChange(idx, e.target.value)}
                      >
                        {productOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        min="1"
                        className="w-full px-2 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        value={row.quantity}
                        onChange={(e) => handleQuantityChange(idx, e.target.value)}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        min="0"
                        className="w-full px-2 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        value={row.unitCost}
                        onChange={(e) => handleUnitCostChange(idx, e.target.value)}
                      />
                    </td>
                    <td className="p-2 text-right font-semibold text-slate-800 dark:text-slate-200">
                      ₹{(Number(row.quantity) * Number(row.unitCost)).toLocaleString('en-IN')}
                    </td>
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        disabled={items.length <= 1}
                        onClick={() => removeItemRow(idx)}
                        className={`p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors ${items.length <= 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Procurement Justification & Delivery Instructions
          </label>
          <textarea
            rows="2"
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
            placeholder="Reason for requisition, target department deployment, gate delivery pass instructions..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </form>
    </Modal>
  );
};

export default PurchaseOrderModal;
