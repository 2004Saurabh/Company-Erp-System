import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Boxes,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  ShoppingCart,
  Building2,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Printer,
  Download,
  Eye,
  Edit2,
  Trash2,
  Layers,
  IndianRupee,
  ShieldAlert,
  Truck,
  FileText,
  Star,
  MapPin,
  Check,
  XCircle,
  ExternalLink
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useERP } from '../../context/ERPContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Badge from '../../components/Badge';
import InventoryProductModal from '../../components/modals/InventoryProductModal';
import StockTransactionModal from '../../components/modals/StockTransactionModal';
import InventorySupplierModal from '../../components/modals/InventorySupplierModal';
import PurchaseOrderModal from '../../components/modals/PurchaseOrderModal';

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'];

export const InventoryPage = () => {
  const {
    inventoryProducts,
    inventorySuppliers,
    inventoryPurchaseOrders,
    inventoryStockMovements,
    deleteInventoryProduct,
    deleteInventorySupplier,
    updatePurchaseOrderStatus
  } = useERP();
  const { role, currentUser } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('overview'); // overview | products | transactions | purchase_orders | suppliers | reports
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedMovementType, setSelectedMovementType] = useState('All');

  // Modals state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [stockModalType, setStockModalType] = useState('IN');
  const [stockModalProductId, setStockModalProductId] = useState(null);

  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [supplierToEdit, setSupplierToEdit] = useState(null);

  const [poModalOpen, setPoModalOpen] = useState(false);
  const [viewingPO, setViewingPO] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);

  // Permission flags
  const canManage = role === 'owner' || role === 'admin';
  const canTransact = role === 'owner' || role === 'admin' || role === 'manager' || role === 'hr';

  // Overall calculations
  const totalValuation = useMemo(() => {
    return inventoryProducts.reduce((sum, p) => sum + (Number(p.quantity || 0) * Number(p.costPrice || 0)), 0);
  }, [inventoryProducts]);

  const totalSellingValuation = useMemo(() => {
    return inventoryProducts.reduce((sum, p) => sum + (Number(p.quantity || 0) * Number(p.sellingPrice || 0)), 0);
  }, [inventoryProducts]);

  const totalStockUnits = useMemo(() => {
    return inventoryProducts.reduce((sum, p) => sum + Number(p.quantity || 0), 0);
  }, [inventoryProducts]);

  const lowStockProducts = useMemo(() => {
    return inventoryProducts.filter(p => p.quantity > 0 && p.quantity <= p.minThreshold);
  }, [inventoryProducts]);

  const outOfStockProducts = useMemo(() => {
    return inventoryProducts.filter(p => p.quantity === 0);
  }, [inventoryProducts]);

  // Category distribution for Charts
  const categoryChartData = useMemo(() => {
    const map = {};
    inventoryProducts.forEach(p => {
      const cat = p.category || 'General';
      if (!map[cat]) {
        map[cat] = { name: cat, count: 0, totalUnits: 0, totalValue: 0 };
      }
      map[cat].count += 1;
      map[cat].totalUnits += Number(p.quantity || 0);
      map[cat].totalValue += (Number(p.quantity || 0) * Number(p.costPrice || 0));
    });
    return Object.values(map);
  }, [inventoryProducts]);

  // Categories list
  const categoriesList = useMemo(() => {
    const set = new Set(inventoryProducts.map(p => p.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [inventoryProducts]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return inventoryProducts.filter(p => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.warehouseLocation && p.warehouseLocation.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.supplier && p.supplier.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [inventoryProducts, searchQuery, selectedCategory, selectedStatus]);

  // Filtered movements
  const filteredMovements = useMemo(() => {
    return inventoryStockMovements.filter(m => {
      const matchesSearch =
        m.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.referenceNo && m.referenceNo.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.performedBy && m.performedBy.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = selectedMovementType === 'All' || m.type === selectedMovementType;

      return matchesSearch && matchesType;
    });
  }, [inventoryStockMovements, searchQuery, selectedMovementType]);

  // Quick action triggers
  const handleOpenStockIn = (productId = null) => {
    setStockModalType('IN');
    setStockModalProductId(productId);
    setStockModalOpen(true);
  };

  const handleOpenStockOut = (productId = null) => {
    setStockModalType('OUT');
    setStockModalProductId(productId);
    setStockModalOpen(true);
  };

  const handleEditProduct = (prod) => {
    setProductToEdit(prod);
    setProductModalOpen(true);
  };

  const handleDeleteProduct = (prod) => {
    if (window.confirm(`Are you sure you want to remove "${prod.name}" (${prod.sku}) from catalog?`)) {
      deleteInventoryProduct(prod.id);
    }
  };

  const handleDeleteSupplier = (sup) => {
    if (window.confirm(`Are you sure you want to delete vendor "${sup.name}"?`)) {
      deleteInventorySupplier(sup.id);
    }
  };

  const handleExportCSV = () => {
    const headers = ['SKU', 'Name', 'Category', 'Quantity', 'MinThreshold', 'Unit', 'CostPrice', 'SellingPrice', 'TotalValuation', 'Status', 'Warehouse', 'Supplier'];
    const rows = inventoryProducts.map(p => [
      `"${p.sku}"`,
      `"${p.name}"`,
      `"${p.category}"`,
      p.quantity,
      p.minThreshold,
      p.unit,
      p.costPrice,
      p.sellingPrice,
      p.quantity * p.costPrice,
      `"${p.status}"`,
      `"${p.warehouseLocation || ''}"`,
      `"${p.supplier || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NEXORA_Inventory_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Inventory report exported as CSV!', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 rounded-xl shadow-sm">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Inventory & Enterprise Hardware Assets
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Centralized stock control, procurement purchase orders, valuation in ₹ INR, and warehouse audit trails
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {canManage && (
            <Button
              variant="outline"
              onClick={() => { setSupplierToEdit(null); setSupplierModalOpen(true); }}
              className="text-xs sm:text-sm"
            >
              <Building2 className="w-4 h-4 mr-1.5" />
              Add Vendor
            </Button>
          )}

          {canTransact && (
            <>
              <Button
                variant="outline"
                onClick={() => setPoModalOpen(true)}
                className="text-xs sm:text-sm"
              >
                <ShoppingCart className="w-4 h-4 mr-1.5" />
                Create PO
              </Button>

              <Button
                variant="outline"
                onClick={() => handleOpenStockIn()}
                className="text-xs sm:text-sm text-emerald-600 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
              >
                <ArrowDownLeft className="w-4 h-4 mr-1.5 text-emerald-600" />
                Stock In / Out
              </Button>
            </>
          )}

          {canManage && (
            <Button
              variant="primary"
              onClick={() => { setProductToEdit(null); setProductModalOpen(true); }}
              className="text-xs sm:text-sm shadow-md shadow-primary-500/20"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Catalog Item
            </Button>
          )}

          <Button
            variant="ghost"
            onClick={handleExportCSV}
            className="text-xs sm:text-sm border border-slate-200 dark:border-slate-700"
            title="Export CSV"
          >
            <Download className="w-4 h-4 mr-1.5" />
            Export
          </Button>
        </div>
      </div>

      {/* Critical Stock Alert Banner */}
      {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex flex-col md:flex-row md:items-center justify-between gap-3 text-amber-900 dark:text-amber-200"
        >
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/60 rounded-xl text-amber-600 dark:text-amber-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">
                Attention Required: {outOfStockProducts.length > 0 ? `${outOfStockProducts.length} Out-of-Stock, ` : ''}{lowStockProducts.length} Items Below Safe Threshold
              </h4>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                {outOfStockProducts.map(p => p.name).concat(lowStockProducts.map(p => p.name)).slice(0, 3).join(', ')}
                {outOfStockProducts.length + lowStockProducts.length > 3 ? ` and ${outOfStockProducts.length + lowStockProducts.length - 3} more items` : ''} need immediate replenishment.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end md:self-center">
            {canTransact && (
              <Button
                size="sm"
                variant="primary"
                onClick={() => setPoModalOpen(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs h-8"
              >
                <ShoppingCart className="w-3.5 h-3.5 mr-1" /> Requisition via PO
              </Button>
            )}
            <button
              onClick={() => { setSelectedStatus('Low Stock'); setActiveTab('products'); }}
              className="text-xs font-semibold underline text-amber-800 dark:text-amber-300 hover:text-amber-900"
            >
              Filter Low Stock
            </button>
          </div>
        </motion.div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Valuation */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Inventory Valuation
            </span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              ₹{totalValuation.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
              <span>Retail Value: ₹{totalSellingValuation.toLocaleString('en-IN')}</span>
              <span className="text-emerald-600 font-medium">Verified Cost</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
        </div>

        {/* Card 2: Total Units On Hand */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Units On Hand
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {totalStockUnits.toLocaleString()} <span className="text-sm font-normal text-slate-500">units</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Across <span className="font-semibold text-slate-700 dark:text-slate-300">{inventoryProducts.length}</span> unique catalog SKUs
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
        </div>

        {/* Card 3: Stock Health */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Stock Alert Items
            </span>
            <div className={`p-2 rounded-xl ${lowStockProducts.length + outOfStockProducts.length > 0 ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400' : 'bg-emerald-50 text-emerald-600'}`}>
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className={lowStockProducts.length > 0 ? 'text-amber-600' : ''}>{lowStockProducts.length} Low</span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span className={outOfStockProducts.length > 0 ? 'text-rose-600' : 'text-slate-400'}>{outOfStockProducts.length} Out</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Reorder threshold auto-monitored
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-rose-500" />
        </div>

        {/* Card 4: Vendors & Active POs */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Procurement & Vendors
            </span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {inventorySuppliers.length} <span className="text-sm font-normal text-slate-500">Vendors</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span className="font-semibold text-primary-600 dark:text-primary-400">{inventoryPurchaseOrders.length}</span> Purchase Orders on file
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Analytics Dashboard', icon: Layers },
          { id: 'products', label: `Products Roster (${inventoryProducts.length})`, icon: Package },
          { id: 'transactions', label: `Movements & In/Out (${inventoryStockMovements.length})`, icon: ArrowDownLeft },
          { id: 'purchase_orders', label: `Purchase Orders (${inventoryPurchaseOrders.length})`, icon: ShoppingCart },
          { id: 'suppliers', label: `Suppliers Directory (${inventorySuppliers.length})`, icon: Building2 },
          { id: 'reports', label: 'Valuation & Audit Report', icon: FileText }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }}
              className={`flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW DASHBOARD */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Category Stock Distribution */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                Stock Distribution by Category
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Total physical unit count held across equipment classifications
              </p>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      dataKey="totalUnits"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={95}
                      paddingAngle={3}
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val, name) => [`${val} Units`, name]}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Inventory Valuation by Category */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                Inventory Valuation by Category (₹ INR)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Book value comparison calculated from cost price × current on-hand units
              </p>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: 20, bottom: 25 }}>
                    <CartesianGrid strokeDashcharts="3 3" vertical={false} opacity={0.15} />
                    <XAxis
                      dataKey="name"
                      angle={-20}
                      textAnchor="end"
                      tick={{ fontSize: 11 }}
                      interval={0}
                    />
                    <YAxis
                      tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Valuation']}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                    />
                    <Bar dataKey="totalValue" fill="#3b82f6" radius={[6, 6, 0, 0]}>
                      {categoryChartData.map((_, index) => (
                        <Cell key={`bar-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Quick High-Value & Low-Stock Highlights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top 5 High-Value Assets */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Top High-Value Enterprise Assets
                </h4>
                <button
                  onClick={() => setActiveTab('products')}
                  className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                >
                  View All <ExternalLink className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-3">
                {[...inventoryProducts]
                  .sort((a, b) => (b.quantity * b.costPrice) - (a.quantity * a.costPrice))
                  .slice(0, 5)
                  .map(p => (
                    <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{p.name}</div>
                        <div className="text-xs text-slate-400">{p.sku} • {p.quantity} {p.unit} in stock</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900 dark:text-white text-sm">₹{(p.quantity * p.costPrice).toLocaleString('en-IN')}</div>
                        <div className="text-xs text-slate-400">@ ₹{p.costPrice.toLocaleString('en-IN')} / unit</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Recent Stock Movement Stream */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Recent Stock In / Stock Out Movements
                </h4>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                >
                  View All <ExternalLink className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-3">
                {inventoryStockMovements.slice(0, 5).map(m => (
                  <div key={m.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${m.type === 'IN' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60' : 'bg-amber-100 text-amber-600 dark:bg-amber-950/60'}`}>
                        {m.type === 'IN' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">{m.productName}</div>
                        <div className="text-[11px] text-slate-400">{m.reason} • {m.timestamp}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold text-xs sm:text-sm ${m.type === 'IN' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {m.type === 'IN' ? `+${m.quantity}` : `-${m.quantity}`}
                      </div>
                      <div className="text-[11px] text-slate-400">{m.destination || m.supplier || m.performedBy}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS ROSTER */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 flex flex-col sm:flex-row items-center gap-3">
              <div className="w-full sm:w-80">
                <Input
                  placeholder="Search by name, SKU, warehouse, supplier..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="w-4 h-4 text-slate-400" />}
                />
              </div>

              <div className="w-full sm:w-48">
                <Select
                  options={categoriesList.map(c => ({ value: c, label: c === 'All' ? 'All Categories' : c }))}
                  value={selectedCategory}
                  onChange={(val) => setSelectedCategory(val)}
                />
              </div>

              <div className="w-full sm:w-44">
                <Select
                  options={[
                    { value: 'All', label: 'All Statuses' },
                    { value: 'In Stock', label: 'In Stock' },
                    { value: 'Low Stock', label: 'Low Stock Alert' },
                    { value: 'Out of Stock', label: 'Out of Stock' }
                  ]}
                  value={selectedStatus}
                  onChange={(val) => setSelectedStatus(val)}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              <span className="text-xs font-semibold text-slate-500">
                Showing {filteredProducts.length} of {inventoryProducts.length} items
              </span>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/70 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Product / SKU</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Stock Level</th>
                    <th className="px-4 py-3">Cost Price</th>
                    <th className="px-4 py-3">Total Value</th>
                    <th className="px-4 py-3">Location & Supplier</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-4 py-8 text-center text-slate-400">
                        No inventory products match the search or filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map(p => {
                      const isLow = p.quantity <= p.minThreshold && p.quantity > 0;
                      const isOut = p.quantity === 0;

                      return (
                        <tr key={p.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="px-4 py-3.5">
                            <div className="font-semibold text-slate-900 dark:text-white">
                              {p.name}
                            </div>
                            <div className="text-xs text-slate-400 font-mono">
                              {p.sku}
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                            {p.category}
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <span className={`font-bold ${isOut ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-slate-900 dark:text-white'}`}>
                                {p.quantity} {p.unit}
                              </span>
                            </div>
                            <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${isOut ? 'bg-rose-500 w-0' : isLow ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                style={{ width: `${Math.min(100, (p.quantity / (p.minThreshold * 2.5)) * 100)}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-slate-400">Min safe: {p.minThreshold}</span>
                          </td>
                          <td className="px-4 py-3.5 font-medium text-slate-700 dark:text-slate-300">
                            ₹{p.costPrice.toLocaleString('en-IN')}
                          </td>
                          <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">
                            ₹{(p.quantity * p.costPrice).toLocaleString('en-IN')}
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate max-w-[160px]" title={p.warehouseLocation}>
                              {p.warehouseLocation?.split('(')[0] || 'HQ Store'}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate max-w-[160px]">
                              {p.supplier}
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <Badge
                              variant={isOut ? 'danger' : isLow ? 'warning' : 'success'}
                              dot
                            >
                              {p.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {canTransact && (
                                <>
                                  <button
                                    onClick={() => handleOpenStockIn(p.id)}
                                    title="Quick Stock In"
                                    className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                                  >
                                    <ArrowDownLeft className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleOpenStockOut(p.id)}
                                    title="Quick Stock Out"
                                    disabled={p.quantity === 0}
                                    className={`p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 ${p.quantity === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
                                  >
                                    <ArrowUpRight className="w-4 h-4" />
                                  </button>
                                </>
                              )}

                              <button
                                onClick={() => setViewingProduct(p)}
                                title="View Details"
                                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {canManage && (
                                <>
                                  <button
                                    onClick={() => handleEditProduct(p)}
                                    title="Edit Product"
                                    className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(p)}
                                    title="Delete Product"
                                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STOCK MOVEMENTS & TRANSACTIONS */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 flex flex-col sm:flex-row items-center gap-3">
              <div className="w-full sm:w-80">
                <Input
                  placeholder="Search movements, references, personnel..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="w-4 h-4 text-slate-400" />}
                />
              </div>

              <div className="w-full sm:w-48">
                <Select
                  options={[
                    { value: 'All', label: 'All Movement Types' },
                    { value: 'IN', label: 'Stock Inward (Receipts)' },
                    { value: 'OUT', label: 'Stock Outward (Dispatches)' }
                  ]}
                  value={selectedMovementType}
                  onChange={(val) => setSelectedMovementType(val)}
                />
              </div>
            </div>

            {canTransact && (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenStockIn()}
                  className="text-emerald-600 border-emerald-300"
                >
                  <ArrowDownLeft className="w-4 h-4 mr-1" /> New Stock In
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenStockOut()}
                  className="text-amber-600 border-amber-300"
                >
                  <ArrowUpRight className="w-4 h-4 mr-1" /> New Stock Out
                </Button>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/70 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Movement ID & Time</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Item & SKU</th>
                    <th className="px-4 py-3">Qty & Stock Impact</th>
                    <th className="px-4 py-3">Unit Cost & Value</th>
                    <th className="px-4 py-3">Reason / Reference</th>
                    <th className="px-4 py-3">Destination / Vendor</th>
                    <th className="px-4 py-3">Authorized By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredMovements.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-4 py-8 text-center text-slate-400">
                        No stock movement logs found.
                      </td>
                    </tr>
                  ) : (
                    filteredMovements.map(m => (
                      <tr key={m.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                        <td className="px-4 py-3">
                          <div className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">{m.id}</div>
                          <div className="text-[11px] text-slate-400">{m.timestamp}</div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={m.type === 'IN' ? 'success' : 'warning'}
                            dot
                          >
                            {m.type === 'IN' ? 'STOCK IN' : 'STOCK OUT'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-800 dark:text-slate-200">{m.productName}</div>
                          <div className="text-xs text-slate-400 font-mono">{m.sku}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className={`font-bold ${m.type === 'IN' ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {m.type === 'IN' ? `+${m.quantity}` : `-${m.quantity}`} units
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {m.previousStock} → <span className="font-semibold text-slate-700 dark:text-slate-300">{m.newStock}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-800 dark:text-slate-200">
                            ₹{(m.totalAmount || (m.quantity * (m.unitPrice || 0))).toLocaleString('en-IN')}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            @ ₹{(m.unitPrice || 0).toLocaleString('en-IN')}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-700 dark:text-slate-300 text-xs">{m.reason}</div>
                          {m.referenceNo && (
                            <div className="text-[11px] text-slate-400 font-mono">{m.referenceNo}</div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400">
                          {m.destination || m.supplier || 'Warehouse Alpha'}
                        </td>
                        <td className="px-4 py-3 text-xs font-medium text-slate-700 dark:text-slate-300">
                          {m.performedBy}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PURCHASE ORDERS */}
      {activeTab === 'purchase_orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Enterprise Purchase Orders</h3>
              <p className="text-xs text-slate-500">Track requisitions, supplier approvals, and automatic stock inward fulfillment</p>
            </div>
            {canTransact && (
              <Button onClick={() => setPoModalOpen(true)} className="text-xs sm:text-sm">
                <Plus className="w-4 h-4 mr-1" /> New Purchase Order
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inventoryPurchaseOrders.map(po => {
              const isReceived = po.status === 'Received';
              const isApproved = po.status === 'Approved';
              const isPending = po.status === 'Pending';

              return (
                <div key={po.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-primary-600 dark:text-primary-400">{po.poNumber}</span>
                      <Badge
                        variant={isReceived ? 'success' : isApproved ? 'info' : 'warning'}
                        dot
                      >
                        {po.status}
                      </Badge>
                    </div>

                    <h4 className="font-bold text-slate-900 dark:text-white text-base">{po.supplierName}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Order Date: {po.orderDate} • Due: {po.expectedDelivery}</p>

                    <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Line Items:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{po.items?.length || 0} product(s)</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Total PO Value:</span>
                        <span className="font-bold text-slate-900 dark:text-white text-sm">₹{po.totalAmount.toLocaleString('en-IN')}</span>
                      </div>
                      {po.notes && (
                        <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-700 italic">
                          "{po.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setViewingPO(po)}
                      className="text-xs font-semibold text-primary-600 hover:underline flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Line Items
                    </button>

                    <div className="flex items-center gap-1.5">
                      {isPending && canManage && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updatePurchaseOrderStatus(po.id, 'Approved')}
                          className="text-xs h-7 text-indigo-600 border-indigo-200"
                        >
                          Approve
                        </Button>
                      )}

                      {isApproved && canTransact && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => updatePurchaseOrderStatus(po.id, 'Received')}
                          className="text-xs h-7 bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <Check className="w-3 h-3 mr-1" /> Mark Received
                        </Button>
                      )}

                      {isReceived && (
                        <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Stock Updated
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: SUPPLIERS DIRECTORY */}
      {activeTab === 'suppliers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Authorized Equipment Vendors & Suppliers</h3>
              <p className="text-xs text-slate-500">Vetted suppliers for OEM hardware, network hardware, and enterprise office peripherals</p>
            </div>
            {canManage && (
              <Button onClick={() => { setSupplierToEdit(null); setSupplierModalOpen(true); }} className="text-xs sm:text-sm">
                <Plus className="w-4 h-4 mr-1" /> Register Vendor
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inventorySuppliers.map(sup => (
              <div key={sup.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={sup.status === 'Active' ? 'success' : 'info'} dot>
                      {sup.status}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      {sup.rating}
                    </div>
                  </div>

                  <h4 className="font-bold text-slate-900 dark:text-white text-base">{sup.name}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {sup.city}
                  </div>

                  <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1.5 text-xs">
                    <div>
                      <span className="text-slate-400">Account Lead: </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{sup.contactPerson}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Email: </span>
                      <span className="text-slate-600 dark:text-slate-300">{sup.email}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Phone: </span>
                      <span className="text-slate-600 dark:text-slate-300">{sup.phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Terms: </span>
                      <span className="font-semibold text-primary-600 dark:text-primary-400">{sup.paymentTerms}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {sup.categories?.map((c, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {canManage && (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                    <button
                      onClick={() => { setSupplierToEdit(sup); setSupplierModalOpen(true); }}
                      className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSupplier(sup)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: VALUATION & AUDIT REPORT */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Quarterly Asset Audit & Valuation Report</h3>
              <p className="text-xs text-slate-500">Comprehensive breakdown of enterprise holdings for fiscal reporting</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Printer className="w-4 h-4 mr-1" /> Print Report
              </Button>
              <Button variant="primary" size="sm" onClick={handleExportCSV}>
                <Download className="w-4 h-4 mr-1" /> Download CSV
              </Button>
            </div>
          </div>

          {/* Category Breakdown Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-white">
              Category Valuation Summary
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/70 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3">Category Classification</th>
                  <th className="px-4 py-3">Cataloged SKUs</th>
                  <th className="px-4 py-3">Total Physical Units</th>
                  <th className="px-4 py-3">Cost Valuation (₹)</th>
                  <th className="px-4 py-3">Valuation Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {categoryChartData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">{row.name}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{row.count} SKUs</td>
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{row.totalUnits.toLocaleString()} units</td>
                    <td className="px-4 py-3 font-bold text-primary-600 dark:text-primary-400">₹{row.totalValue.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary-600 rounded-full"
                            style={{ width: `${totalValuation > 0 ? (row.totalValue / totalValuation) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                          {totalValuation > 0 ? ((row.totalValue / totalValuation) * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
                <tr className="bg-slate-50/80 dark:bg-slate-800/50 font-bold">
                  <td className="px-4 py-3.5 text-slate-900 dark:text-white">Total Enterprise Holdings</td>
                  <td className="px-4 py-3.5">{inventoryProducts.length} SKUs</td>
                  <td className="px-4 py-3.5">{totalStockUnits.toLocaleString()} units</td>
                  <td className="px-4 py-3.5 text-primary-600 dark:text-primary-400 text-base">₹{totalValuation.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3.5">100.0%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: Product Add / Edit */}
      <InventoryProductModal
        isOpen={productModalOpen}
        onClose={() => { setProductModalOpen(false); setProductToEdit(null); }}
        productToEdit={productToEdit}
      />

      {/* MODAL 2: Stock Transaction */}
      <StockTransactionModal
        isOpen={stockModalOpen}
        onClose={() => { setStockModalOpen(false); setStockModalProductId(null); }}
        initialType={stockModalType}
        initialProductId={stockModalProductId}
      />

      {/* MODAL 3: Supplier Add / Edit */}
      <InventorySupplierModal
        isOpen={supplierModalOpen}
        onClose={() => { setSupplierModalOpen(false); setSupplierToEdit(null); }}
        supplierToEdit={supplierToEdit}
      />

      {/* MODAL 4: Create Purchase Order */}
      <PurchaseOrderModal
        isOpen={poModalOpen}
        onClose={() => setPoModalOpen(false)}
      />

      {/* MODAL 5: View PO Line Items */}
      {viewingPO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">PO Breakdown: {viewingPO.poNumber}</h3>
                <p className="text-xs text-slate-500">Vendor: {viewingPO.supplierName} • Date: {viewingPO.orderDate}</p>
              </div>
              <button onClick={() => setViewingPO(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase text-[11px]">
                  <tr>
                    <th className="px-3 py-2">Item</th>
                    <th className="px-3 py-2">SKU</th>
                    <th className="px-3 py-2">Quantity</th>
                    <th className="px-3 py-2">Unit Cost</th>
                    <th className="px-3 py-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {viewingPO.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2.5 font-semibold text-slate-800 dark:text-slate-200">{item.name}</td>
                      <td className="px-3 py-2.5 font-mono text-slate-500">{item.sku}</td>
                      <td className="px-3 py-2.5">{item.quantity}</td>
                      <td className="px-3 py-2.5">₹{Number(item.unitCost).toLocaleString('en-IN')}</td>
                      <td className="px-3 py-2.5 text-right font-bold text-slate-900 dark:text-white">
                        ₹{(Number(item.quantity) * Number(item.unitCost)).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50/50 dark:bg-slate-800/30 font-bold">
                    <td colSpan="4" className="px-3 py-2.5 text-right">Total Order Value:</td>
                    <td className="px-3 py-2.5 text-right text-primary-600 dark:text-primary-400 text-base">
                      ₹{viewingPO.totalAmount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button variant="ghost" onClick={() => setViewingPO(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: View Product Details */}
      {viewingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold text-primary-600 dark:text-primary-400">{viewingProduct.sku}</span>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{viewingProduct.name}</h3>
              </div>
              <button onClick={() => setViewingProduct(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <div className="text-xs text-slate-400">Current Stock</div>
                  <div className="font-bold text-base text-slate-900 dark:text-white">{viewingProduct.quantity} {viewingProduct.unit}</div>
                  <div className="text-[10px] text-slate-400">Min safe: {viewingProduct.minThreshold}</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <div className="text-xs text-slate-400">Unit Cost & Selling</div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">Cost: ₹{viewingProduct.costPrice.toLocaleString('en-IN')}</div>
                  <div className="text-xs text-emerald-600">Asset: ₹{viewingProduct.sellingPrice.toLocaleString('en-IN')}</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1.5 text-xs">
                <div><span className="text-slate-400">Category: </span><span className="font-medium text-slate-800 dark:text-slate-200">{viewingProduct.category}</span></div>
                <div><span className="text-slate-400">Warehouse Location: </span><span className="font-medium text-slate-800 dark:text-slate-200">{viewingProduct.warehouseLocation}</span></div>
                <div><span className="text-slate-400">Supplier: </span><span className="font-medium text-slate-800 dark:text-slate-200">{viewingProduct.supplier}</span></div>
                <div><span className="text-slate-400">Last Restocked: </span><span className="font-medium text-slate-800 dark:text-slate-200">{viewingProduct.lastRestocked}</span></div>
              </div>

              {viewingProduct.description && (
                <div>
                  <div className="text-xs font-semibold text-slate-400 mb-1">Specifications & Notes:</div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl">
                    {viewingProduct.description}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              {canTransact && (
                <Button size="sm" variant="primary" onClick={() => { setViewingProduct(null); handleOpenStockIn(viewingProduct.id); }}>
                  <ArrowDownLeft className="w-3.5 h-3.5 mr-1" /> Quick Stock In
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => setViewingProduct(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
