import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import Input from '../Input';
import Select from '../Select';
import { useERP } from '../../context/ERPContext';
import { ArrowDownLeft, ArrowUpRight, Package, Building2, FileText, CheckCircle2 } from 'lucide-react';

export const StockTransactionModal = ({ isOpen, onClose, initialType = 'IN', initialProductId = null }) => {
  const { inventoryProducts, performStockIn, performStockOut, departments } = useERP();

  const [transactionType, setTransactionType] = useState(initialType);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unitCost, setUnitCost] = useState('');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [destination, setDestination] = useState('Engineering Team');
  const [department, setDepartment] = useState('Engineering');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setTransactionType(initialType);
    if (initialProductId) {
      setSelectedProductId(initialProductId);
    } else if (inventoryProducts.length > 0) {
      setSelectedProductId(inventoryProducts[0].id);
    }
    setQuantity(1);
    setReference(initialType === 'IN' ? 'Supplier Restock Shipment' : 'Department Hardware Allocation');
    setNotes('');
    setErrors({});
  }, [isOpen, initialType, initialProductId, inventoryProducts]);

  const activeProduct = inventoryProducts.find(p => p.id === selectedProductId) || inventoryProducts[0];

  useEffect(() => {
    if (activeProduct && transactionType === 'IN') {
      setUnitCost(activeProduct.costPrice || 0);
    }
  }, [activeProduct, transactionType]);

  const validate = () => {
    const errs = {};
    const qtyNum = Number(quantity);
    if (!selectedProductId) errs.productId = 'Please select a product';
    if (isNaN(qtyNum) || qtyNum <= 0) errs.quantity = 'Quantity must be at least 1';

    if (transactionType === 'OUT' && activeProduct) {
      if (qtyNum > activeProduct.quantity) {
        errs.quantity = `Cannot dispatch more than current stock (${activeProduct.quantity} available)`;
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (transactionType === 'IN') {
      const ok = performStockIn({
        productId: selectedProductId,
        quantity: Number(quantity),
        reference,
        notes,
        unitCost: Number(unitCost) || activeProduct?.costPrice || 0,
        supplierName: activeProduct?.supplier || 'Primary Supplier'
      });
      if (ok) onClose();
    } else {
      const ok = performStockOut({
        productId: selectedProductId,
        quantity: Number(quantity),
        reference,
        notes,
        destination,
        department
      });
      if (ok) onClose();
    }
  };

  const productOptions = inventoryProducts.map(p => ({
    value: p.id,
    label: `${p.name} (${p.sku}) — Stock: ${p.quantity} ${p.unit}`
  }));

  const departmentOptions = departments.map(d => ({ value: d.name, label: d.name }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={transactionType === 'IN' ? 'Stock Inward (Receipt / Restock)' : 'Stock Outward (Issuance / Dispatch)'}
      subtitle="Record verified inventory movements with automatic stock audit trailing"
      maxWidth="max-w-xl"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={transactionType === 'IN' ? 'success' : 'danger'}
            icon={transactionType === 'IN' ? ArrowDownLeft : ArrowUpRight}
            onClick={handleSubmit}
          >
            {transactionType === 'IN' ? 'Confirm Stock In' : 'Confirm Stock Out'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Toggle Mode Selector */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => setTransactionType('IN')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${
              transactionType === 'IN'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4" />
            Stock In (Receive)
          </button>
          <button
            type="button"
            onClick={() => setTransactionType('OUT')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${
              transactionType === 'OUT'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            Stock Out (Dispatch)
          </button>
        </div>

        {/* Product Picker */}
        <Select
          label="Select Inventory Product"
          options={productOptions}
          value={selectedProductId}
          onChange={(val) => setSelectedProductId(val)}
          error={errors.productId}
        />

        {/* Current Product Info Banner */}
        {activeProduct && (
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700 flex items-center justify-between text-xs sm:text-sm">
            <div>
              <span className="text-slate-500 dark:text-slate-400">Current Stock: </span>
              <span className={`font-bold ${activeProduct.quantity <= activeProduct.minThreshold ? 'text-amber-500' : 'text-emerald-500'}`}>
                {activeProduct.quantity} {activeProduct.unit}
              </span>
              <span className="text-slate-400 mx-2">•</span>
              <span className="text-slate-500 dark:text-slate-400">Min Alert: {activeProduct.minThreshold}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 dark:text-slate-400">Location: </span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{activeProduct.warehouseLocation?.split('(')[0] || 'HQ Bay'}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Transaction Quantity"
            type="number"
            min="1"
            max={transactionType === 'OUT' ? activeProduct?.quantity : undefined}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            error={errors.quantity}
            required
            leftIcon={<Package className="w-4 h-4 text-slate-400" />}
          />

          {transactionType === 'IN' ? (
            <Input
              label="Purchase Unit Cost (₹ INR)"
              type="number"
              min="0"
              value={unitCost}
              onChange={(e) => setUnitCost(e.target.value)}
              required
              leftIcon={<span className="text-sm font-semibold text-slate-400">₹</span>}
            />
          ) : (
            <Select
              label="Allocated Department"
              options={departmentOptions}
              value={department}
              onChange={(val) => setDepartment(val)}
            />
          )}
        </div>

        {transactionType === 'OUT' && (
          <Input
            label="Issuance Destination / Assignee"
            placeholder="e.g. New Joiner Kit / Dev Cluster Bay / Austin Remote"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
            leftIcon={<Building2 className="w-4 h-4 text-slate-400" />}
          />
        )}

        <Input
          label="Reference / Document Number"
          placeholder={transactionType === 'IN' ? 'e.g. PO-2026-9042 / Inv-781' : 'e.g. REQ-IT-109 / Sprint Deployment'}
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          leftIcon={<FileText className="w-4 h-4 text-slate-400" />}
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Audit Remarks / Serial Numbers
          </label>
          <textarea
            rows="2"
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
            placeholder="Internal tracking notes, hardware asset serial numbers, or condition remarks..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </form>
    </Modal>
  );
};

export default StockTransactionModal;
