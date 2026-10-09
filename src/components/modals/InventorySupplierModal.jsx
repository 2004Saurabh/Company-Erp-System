import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import Input from '../Input';
import Select from '../Select';
import { useERP } from '../../context/ERPContext';
import { Building2, User, Mail, Phone, MapPin, CreditCard, Star } from 'lucide-react';

const PAYMENT_TERMS_OPTIONS = [
  { value: 'Net 15', label: 'Net 15 Days' },
  { value: 'Net 30', label: 'Net 30 Days' },
  { value: 'Net 60', label: 'Net 60 Days' },
  { value: 'Immediate / Advance', label: 'Immediate / Advance' },
  { value: '50% Advance, 50% on Delivery', label: '50% Advance, 50% on Delivery' }
];

const STATUS_OPTIONS = [
  { value: 'Active', label: 'Active Partner' },
  { value: 'Under Review', label: 'Under Review' },
  { value: 'Preferred Tier-1', label: 'Preferred Tier-1' },
  { value: 'Inactive', label: 'Inactive' }
];

export const InventorySupplierModal = ({ isOpen, onClose, supplierToEdit = null }) => {
  const { addInventorySupplier, updateInventorySupplier } = useERP();

  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    city: 'Bengaluru, Karnataka',
    categoriesText: 'IT Hardware, Peripherals',
    paymentTerms: 'Net 30',
    rating: '4.8',
    status: 'Active',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (supplierToEdit) {
      setFormData({
        name: supplierToEdit.name || '',
        contactPerson: supplierToEdit.contactPerson || '',
        email: supplierToEdit.email || '',
        phone: supplierToEdit.phone || '',
        city: supplierToEdit.city || 'Bengaluru, Karnataka',
        categoriesText: Array.isArray(supplierToEdit.categories) ? supplierToEdit.categories.join(', ') : (supplierToEdit.categories || 'IT Hardware'),
        paymentTerms: supplierToEdit.paymentTerms || 'Net 30',
        rating: String(supplierToEdit.rating || '4.8'),
        status: supplierToEdit.status || 'Active',
        notes: supplierToEdit.notes || ''
      });
    } else {
      setFormData({
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        city: 'Bengaluru, Karnataka',
        categoriesText: 'IT Hardware, Peripherals',
        paymentTerms: 'Net 30',
        rating: '4.8',
        status: 'Active',
        notes: ''
      });
    }
    setErrors({});
  }, [supplierToEdit, isOpen]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Supplier / Vendor name is required';
    if (!formData.contactPerson.trim()) errs.contactPerson = 'Contact representative is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid vendor email is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: formData.name,
      contactPerson: formData.contactPerson,
      email: formData.email,
      phone: formData.phone || '+91 80 4100 2000',
      city: formData.city,
      categories: formData.categoriesText.split(',').map(c => c.trim()).filter(Boolean),
      paymentTerms: formData.paymentTerms,
      rating: Number(formData.rating) || 4.5,
      status: formData.status,
      notes: formData.notes
    };

    if (supplierToEdit) {
      updateInventorySupplier(supplierToEdit.id, payload);
    } else {
      addInventorySupplier(payload);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={supplierToEdit ? `Edit Vendor: ${supplierToEdit.name}` : 'Register New Vendor / Supplier'}
      subtitle="Manage authorized enterprise equipment distributors and procurement partners"
      maxWidth="max-w-xl"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {supplierToEdit ? 'Save Changes' : 'Register Vendor'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Vendor / Company Legal Name"
          placeholder="e.g. Dell Technologies Enterprise India"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          required
          leftIcon={<Building2 className="w-4 h-4 text-slate-400" />}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Key Account Manager"
            placeholder="e.g. Rahul Sharma"
            value={formData.contactPerson}
            onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
            error={errors.contactPerson}
            required
            leftIcon={<User className="w-4 h-4 text-slate-400" />}
          />

          <Input
            label="Corporate Email"
            type="email"
            placeholder="rahul.sharma@vendor.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            required
            leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Phone Number"
            placeholder="+91 80 4100 2000"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
          />

          <Input
            label="Operational Location / Hub"
            placeholder="e.g. Bengaluru, Karnataka"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            leftIcon={<MapPin className="w-4 h-4 text-slate-400" />}
          />
        </div>

        <Input
          label="Product Categories (Comma separated)"
          placeholder="e.g. IT Hardware, Laptops, Servers, Storage"
          value={formData.categoriesText}
          onChange={(e) => setFormData({ ...formData, categoriesText: e.target.value })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Payment Terms"
            options={PAYMENT_TERMS_OPTIONS}
            value={formData.paymentTerms}
            onChange={(val) => setFormData({ ...formData, paymentTerms: val })}
          />

          <Select
            label="Vendor Status"
            options={STATUS_OPTIONS}
            value={formData.status}
            onChange={(val) => setFormData({ ...formData, status: val })}
          />

          <Input
            label="Partner Rating (1-5)"
            type="number"
            step="0.1"
            min="1"
            max="5"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
            leftIcon={<Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Contract Notes & SLA Commitments
          </label>
          <textarea
            rows="2"
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
            placeholder="Warranty response turnaround, credit limits, account manager mobile..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>
      </form>
    </Modal>
  );
};

export default InventorySupplierModal;
