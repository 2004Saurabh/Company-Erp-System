import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import Input from '../Input';
import Select from '../Select';
import { useERP } from '../../context/ERPContext';
import { Package, Hash, Tag, DollarSign, Layers, Warehouse, Truck, ShieldAlert } from 'lucide-react';

const CATEGORIES = [
  'IT Hardware',
  'Networking & Servers',
  'Office Furniture',
  'Peripherals & Accessories',
  'Data Infrastructure',
  'HR & Employee Kits',
  'Spare Components'
];

const WAREHOUSE_LOCATIONS = [
  'Warehouse Alpha - Bay 1A (Laptops & Mobile)',
  'Warehouse Alpha - Bay 2B (Workstations)',
  'Warehouse Alpha - Bay 3C (Monitors & Displays)',
  'Warehouse Alpha - Bay 4D (Peripherals)',
  'Warehouse Beta - Zone N (Networking & Server Racks)',
  'Warehouse Beta - Zone S (Data Storage Units)',
  'Warehouse Gamma - Section F (Ergonomic Furniture)',
  'HQ Central Store - Bay H (Onboarding Kits)'
];

export const InventoryProductModal = ({ isOpen, onClose, productToEdit = null }) => {
  const { addInventoryProduct, updateInventoryProduct, inventorySuppliers } = useERP();

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: CATEGORIES[0],
    quantity: 10,
    minThreshold: 5,
    unit: 'units',
    costPrice: 5000,
    sellingPrice: 7500,
    warehouseLocation: WAREHOUSE_LOCATIONS[0],
    supplier: inventorySuppliers[0]?.name || 'Dell Technologies Enterprise',
    description: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || '',
        sku: productToEdit.sku || '',
        category: productToEdit.category || CATEGORIES[0],
        quantity: productToEdit.quantity ?? 10,
        minThreshold: productToEdit.minThreshold ?? 5,
        unit: productToEdit.unit || 'units',
        costPrice: productToEdit.costPrice ?? 5000,
        sellingPrice: productToEdit.sellingPrice ?? 7500,
        warehouseLocation: productToEdit.warehouseLocation || WAREHOUSE_LOCATIONS[0],
        supplier: productToEdit.supplier || (inventorySuppliers[0]?.name || ''),
        description: productToEdit.description || ''
      });
    } else {
      const generatedSKU = `SKU-${Date.now().toString().slice(-5)}`;
      setFormData({
        name: '',
        sku: generatedSKU,
        category: CATEGORIES[0],
        quantity: 20,
        minThreshold: 5,
        unit: 'units',
        costPrice: 5000,
        sellingPrice: 7000,
        warehouseLocation: WAREHOUSE_LOCATIONS[0],
        supplier: inventorySuppliers[0]?.name || 'Dell Technologies Enterprise',
        description: ''
      });
    }
    setErrors({});
  }, [productToEdit, isOpen, inventorySuppliers]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Product name is required';
    if (!formData.sku.trim()) errs.sku = 'SKU identifier is required';
    if (isNaN(Number(formData.quantity)) || Number(formData.quantity) < 0) {
      errs.quantity = 'Quantity must be 0 or higher';
    }
    if (isNaN(Number(formData.minThreshold)) || Number(formData.minThreshold) < 0) {
      errs.minThreshold = 'Minimum threshold must be 0 or higher';
    }
    if (isNaN(Number(formData.costPrice)) || Number(formData.costPrice) < 0) {
      errs.costPrice = 'Valid cost price is required';
    }
    if (isNaN(Number(formData.sellingPrice)) || Number(formData.sellingPrice) < 0) {
      errs.sellingPrice = 'Valid selling / valuation price is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (productToEdit) {
      updateInventoryProduct(productToEdit.id, formData);
    } else {
      addInventoryProduct(formData);
    }
    onClose();
  };

  const supplierOptions = inventorySuppliers.map(s => ({ value: s.name, label: s.name }));
  const categoryOptions = CATEGORIES.map(c => ({ value: c, label: c }));
  const warehouseOptions = WAREHOUSE_LOCATIONS.map(w => ({ value: w, label: w }));
  const unitOptions = [
    { value: 'units', label: 'Units' },
    { value: 'sets', label: 'Sets' },
    { value: 'kits', label: 'Kits' },
    { value: 'pcs', label: 'Pieces' },
    { value: 'boxes', label: 'Boxes' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={productToEdit ? `Edit Product: ${productToEdit.sku}` : 'Add New Inventory Item'}
      subtitle={productToEdit ? 'Modify item specifications, pricing or reorder thresholds' : 'Register a new enterprise hardware asset or inventory supply'}
      maxWidth="max-w-2xl"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {productToEdit ? 'Save Changes' : 'Catalog Item'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Product Name"
            placeholder="e.g. Dell Latitude 7440 Ultrabook"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
            leftIcon={<Package className="w-4 h-4 text-slate-400" />}
          />

          <Input
            label="SKU Identifier"
            placeholder="e.g. SKU-DELL-7440"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            error={errors.sku}
            required
            leftIcon={<Hash className="w-4 h-4 text-slate-400" />}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Category"
            options={categoryOptions}
            value={formData.category}
            onChange={(val) => setFormData({ ...formData, category: val })}
          />

          <Select
            label="Unit of Measurement"
            options={unitOptions}
            value={formData.unit}
            onChange={(val) => setFormData({ ...formData, unit: val })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Cost Price (₹ INR)"
            type="number"
            min="0"
            value={formData.costPrice}
            onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
            error={errors.costPrice}
            required
            leftIcon={<span className="text-sm font-semibold text-slate-400">₹</span>}
          />

          <Input
            label="Selling / Asset Value (₹ INR)"
            type="number"
            min="0"
            value={formData.sellingPrice}
            onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
            error={errors.sellingPrice}
            required
            leftIcon={<span className="text-sm font-semibold text-slate-400">₹</span>}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Current On-Hand Quantity"
            type="number"
            min="0"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            error={errors.quantity}
            required
            leftIcon={<Layers className="w-4 h-4 text-slate-400" />}
          />

          <Input
            label="Low-Stock Alert Threshold"
            type="number"
            min="1"
            value={formData.minThreshold}
            onChange={(e) => setFormData({ ...formData, minThreshold: e.target.value })}
            error={errors.minThreshold}
            required
            leftIcon={<ShieldAlert className="w-4 h-4 text-amber-500" />}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Storage Warehouse & Bay"
            options={warehouseOptions}
            value={formData.warehouseLocation}
            onChange={(val) => setFormData({ ...formData, warehouseLocation: val })}
          />

          <Select
            label="Primary Vendor / Supplier"
            options={supplierOptions.length > 0 ? supplierOptions : [{ value: 'Default Supplier', label: 'Default Supplier' }]}
            value={formData.supplier}
            onChange={(val) => setFormData({ ...formData, supplier: val })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Technical Specs & Internal Notes
          </label>
          <textarea
            rows="3"
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
            placeholder="Specifications, model numbers, warranty terms, or special storage requirements..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
      </form>
    </Modal>
  );
};

export default InventoryProductModal;
