import express from 'express';
import { query, getOne, execute } from '../config/db.js';

const router = express.Router();

const calculateStatus = (qty, threshold) => {
  const q = Number(qty) || 0;
  const t = Number(threshold) || 10;
  if (q <= 0) return 'Out of Stock';
  if (q <= t) return 'Low Stock';
  return 'In Stock';
};

// ================= PRODUCTS =================
// GET all products
router.get('/products', async (req, res) => {
  try {
    const products = await query('SELECT * FROM inventory_products ORDER BY id ASC');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single product
router.get('/products/:id', async (req, res) => {
  try {
    const product = await getOne('SELECT * FROM inventory_products WHERE id = ?', [req.params.id]);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add new product
router.post('/products', async (req, res) => {
  try {
    const data = req.body;
    const newId = data.id || `PRD-${Date.now().toString().slice(-4)}`;
    const sku = data.sku || `SKU-${Date.now().toString().slice(-4)}`;
    const quantity = Number(data.quantity) || 0;
    const minThreshold = Number(data.minThreshold) || 10;
    const status = calculateStatus(quantity, minThreshold);
    const costPrice = Number(data.costPrice) || 0;
    const sellingPrice = Number(data.sellingPrice) || 0;
    const today = '2026-10-01';

    await execute(
      `INSERT INTO inventory_products (id, sku, name, category, quantity, minThreshold, unit, costPrice, sellingPrice, warehouseLocation, supplier, description, status, lastRestocked)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newId, sku, data.name || 'New Item', data.category || 'Office IT',
        quantity, minThreshold, data.unit || 'units', costPrice, sellingPrice,
        data.warehouseLocation || 'Rack A-01', data.supplier || 'Primary Supplier',
        data.description || '', status, today
      ]
    );

    // Initial movement record if quantity > 0
    if (quantity > 0) {
      const movId = `MOV-${Date.now().toString().slice(-5)}`;
      await execute(
        `INSERT INTO inventory_stock_movements (id, productId, productName, sku, type, quantity, unitPrice, totalAmount, previousStock, newStock, reason, referenceNo, performedBy, timestamp, notes)
         VALUES (?, ?, ?, ?, 'IN', ?, ?, ?, 0, ?, 'Initial Inventory Intake', 'INIT-STOCK', ?, ?, 'Initial stock intake upon product registration')`,
        [
          movId, newId, data.name, sku, quantity, costPrice,
          quantity * costPrice, quantity,
          data.performedBy || 'Administrator', `${today} 10:00 AM`
        ]
      );
    }

    const created = await getOne('SELECT * FROM inventory_products WHERE id = ?', [newId]);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update product
router.put('/products/:id', async (req, res) => {
  try {
    const target = await getOne('SELECT * FROM inventory_products WHERE id = ?', [req.params.id]);
    if (!target) return res.status(404).json({ error: 'Product not found' });

    const data = req.body;
    const qty = data.quantity !== undefined ? Number(data.quantity) : target.quantity;
    const thresh = data.minThreshold !== undefined ? Number(data.minThreshold) : target.minThreshold;
    const status = calculateStatus(qty, thresh);

    await execute(
      `UPDATE inventory_products 
       SET name = ?, category = ?, quantity = ?, minThreshold = ?, unit = ?,
           costPrice = ?, sellingPrice = ?, warehouseLocation = ?, supplier = ?,
           description = ?, status = ?
       WHERE id = ?`,
      [
        data.name || target.name,
        data.category || target.category,
        qty,
        thresh,
        data.unit || target.unit,
        data.costPrice !== undefined ? Number(data.costPrice) : target.costPrice,
        data.sellingPrice !== undefined ? Number(data.sellingPrice) : target.sellingPrice,
        data.warehouseLocation || target.warehouseLocation,
        data.supplier || target.supplier,
        data.description !== undefined ? data.description : target.description,
        status,
        target.id
      ]
    );

    const updated = await getOne('SELECT * FROM inventory_products WHERE id = ?', [target.id]);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE product
router.delete('/products/:id', async (req, res) => {
  try {
    await execute('DELETE FROM inventory_products WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Product removed from catalog' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= STOCK MOVEMENTS & STOCK IN / OUT =================
// GET all stock movements
router.get('/movements', async (req, res) => {
  try {
    const movements = await query('SELECT * FROM inventory_stock_movements ORDER BY timestamp DESC, id DESC');
    res.json(movements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST stock in (Restock / Inward Shipment)
router.post('/stock-in', async (req, res) => {
  try {
    const { productId, quantity, reference, notes, unitCost, supplierName, performedBy } = req.body;
    const qty = Number(quantity);
    if (!productId || isNaN(qty) || qty <= 0) {
      return res.status(400).json({ error: 'Valid productId and positive quantity required' });
    }

    const prd = await getOne('SELECT * FROM inventory_products WHERE id = ?', [productId]);
    if (!prd) return res.status(404).json({ error: 'Product not found' });

    const prevStock = prd.quantity;
    const newStock = prevStock + qty;
    const effectiveCost = Number(unitCost) || prd.costPrice;
    const status = calculateStatus(newStock, prd.minThreshold);
    const today = '2026-10-01';
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Update product
    await execute(
      `UPDATE inventory_products 
       SET quantity = ?, status = ?, lastRestocked = ?, costPrice = ?
       WHERE id = ?`,
      [newStock, status, today, effectiveCost, prd.id]
    );

    // Create movement
    const movId = `MOV-${Date.now().toString().slice(-5)}`;
    await execute(
      `INSERT INTO inventory_stock_movements (id, productId, productName, sku, type, quantity, unitPrice, totalAmount, previousStock, newStock, reason, referenceNo, supplier, performedBy, timestamp, notes)
       VALUES (?, ?, ?, ?, 'IN', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        movId, prd.id, prd.name, prd.sku, qty, effectiveCost,
        qty * effectiveCost, prevStock, newStock,
        reference || 'Inbound Shipment / Restock',
        `IN-${Date.now().toString().slice(-4)}`,
        supplierName || prd.supplier || 'Primary Supplier',
        performedBy || 'Administrator',
        `${today} ${nowTime}`,
        notes || 'Stock received into warehouse'
      ]
    );

    const updatedProduct = await getOne('SELECT * FROM inventory_products WHERE id = ?', [prd.id]);
    const movement = await getOne('SELECT * FROM inventory_stock_movements WHERE id = ?', [movId]);

    res.status(201).json({
      success: true,
      product: updatedProduct,
      movement
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST stock out (Dispatch / Usage)
router.post('/stock-out', async (req, res) => {
  try {
    const { productId, quantity, reference, notes, destination, department, performedBy } = req.body;
    const qty = Number(quantity);
    if (!productId || isNaN(qty) || qty <= 0) {
      return res.status(400).json({ error: 'Valid productId and positive quantity required' });
    }

    const prd = await getOne('SELECT * FROM inventory_products WHERE id = ?', [productId]);
    if (!prd) return res.status(404).json({ error: 'Product not found' });

    if (prd.quantity < qty) {
      return res.status(400).json({
        error: `Insufficient stock! Available: ${prd.quantity}, Requested: ${qty}`,
        available: prd.quantity
      });
    }

    const prevStock = prd.quantity;
    const newStock = prevStock - qty;
    const status = calculateStatus(newStock, prd.minThreshold);
    const today = '2026-10-01';
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Update product
    await execute(
      'UPDATE inventory_products SET quantity = ?, status = ? WHERE id = ?',
      [newStock, status, prd.id]
    );

    // Create movement
    const movId = `MOV-${Date.now().toString().slice(-5)}`;
    await execute(
      `INSERT INTO inventory_stock_movements (id, productId, productName, sku, type, quantity, unitPrice, totalAmount, previousStock, newStock, reason, referenceNo, destination, department, performedBy, timestamp, notes)
       VALUES (?, ?, ?, ?, 'OUT', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        movId, prd.id, prd.name, prd.sku, qty, prd.costPrice,
        qty * prd.costPrice, prevStock, newStock,
        reference || 'Stock Issuance / Dispatch',
        `OUT-${Date.now().toString().slice(-4)}`,
        destination || department || 'Operations',
        department || 'General',
        performedBy || 'Administrator',
        `${today} ${nowTime}`,
        notes || 'Stock dispatched for company use'
      ]
    );

    const updatedProduct = await getOne('SELECT * FROM inventory_products WHERE id = ?', [prd.id]);
    const movement = await getOne('SELECT * FROM inventory_stock_movements WHERE id = ?', [movId]);

    res.status(201).json({
      success: true,
      product: updatedProduct,
      movement
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= SUPPLIERS =================
// GET all suppliers
router.get('/suppliers', async (req, res) => {
  try {
    const suppliers = await query('SELECT * FROM inventory_suppliers ORDER BY id ASC');
    res.json(suppliers.map(s => ({
      ...s,
      categories: s.categories ? JSON.parse(s.categories) : []
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add supplier
router.post('/suppliers', async (req, res) => {
  try {
    const data = req.body;
    const newId = data.id || `SUP-${Date.now().toString().slice(-4)}`;
    const catStr = JSON.stringify(data.categories || ['IT Hardware']);

    await execute(
      `INSERT INTO inventory_suppliers (id, name, contactPerson, email, phone, city, categories, paymentTerms, rating, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newId, data.name, data.contactPerson || '', data.email || '', data.phone || '',
        data.city || 'Bangalore', catStr, data.paymentTerms || 'Net 30',
        Number(data.rating) || 4.8, data.status || 'Active', data.notes || ''
      ]
    );

    const created = await getOne('SELECT * FROM inventory_suppliers WHERE id = ?', [newId]);
    res.status(201).json({
      ...created,
      categories: JSON.parse(created.categories || '[]')
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update supplier
router.put('/suppliers/:id', async (req, res) => {
  try {
    const target = await getOne('SELECT * FROM inventory_suppliers WHERE id = ?', [req.params.id]);
    if (!target) return res.status(404).json({ error: 'Supplier not found' });

    const data = req.body;
    const catStr = data.categories ? JSON.stringify(data.categories) : target.categories;

    await execute(
      `UPDATE inventory_suppliers 
       SET name = ?, contactPerson = ?, email = ?, phone = ?, city = ?, categories = ?,
           paymentTerms = ?, rating = ?, status = ?, notes = ?
       WHERE id = ?`,
      [
        data.name || target.name,
        data.contactPerson !== undefined ? data.contactPerson : target.contactPerson,
        data.email !== undefined ? data.email : target.email,
        data.phone !== undefined ? data.phone : target.phone,
        data.city || target.city,
        catStr,
        data.paymentTerms || target.paymentTerms,
        data.rating !== undefined ? Number(data.rating) : target.rating,
        data.status || target.status,
        data.notes !== undefined ? data.notes : target.notes,
        target.id
      ]
    );

    const updated = await getOne('SELECT * FROM inventory_suppliers WHERE id = ?', [target.id]);
    res.json({
      ...updated,
      categories: JSON.parse(updated.categories || '[]')
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE supplier
router.delete('/suppliers/:id', async (req, res) => {
  try {
    await execute('DELETE FROM inventory_suppliers WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Supplier removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= PURCHASE ORDERS =================
// GET all purchase orders
router.get('/purchase-orders', async (req, res) => {
  try {
    const pos = await query('SELECT * FROM inventory_purchase_orders ORDER BY id DESC');
    res.json(pos.map(po => ({
      ...po,
      items: po.items ? JSON.parse(po.items) : []
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create purchase order
router.post('/purchase-orders', async (req, res) => {
  try {
    const data = req.body;
    const newId = data.id || `PO-${Date.now().toString().slice(-4)}`;
    const poNumber = data.poNumber || `PO-2026-${Date.now().toString().slice(-4)}`;
    const items = data.items || [];
    const totalAmount = data.totalAmount || items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unitCost || 0)), 0);
    const today = '2026-10-01';

    await execute(
      `INSERT INTO inventory_purchase_orders (id, poNumber, supplierName, orderDate, expectedDelivery, status, items, totalAmount, requestedBy, receivedDate, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?)`,
      [
        newId, poNumber, data.supplierName || 'Primary Supplier',
        data.orderDate || today, data.expectedDelivery || '2026-10-25',
        data.status || 'Pending', JSON.stringify(items),
        totalAmount, data.requestedBy || 'Administrator', data.notes || ''
      ]
    );

    const created = await getOne('SELECT * FROM inventory_purchase_orders WHERE id = ?', [newId]);
    res.status(201).json({
      ...created,
      items: JSON.parse(created.items || '[]')
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update PO status (Approve, Cancel)
router.put('/purchase-orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await execute('UPDATE inventory_purchase_orders SET status = ? WHERE id = ?', [status, req.params.id]);
    const updated = await getOne('SELECT * FROM inventory_purchase_orders WHERE id = ?', [req.params.id]);
    if (!updated) return res.status(404).json({ error: 'Purchase Order not found' });
    res.json({
      ...updated,
      items: JSON.parse(updated.items || '[]')
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST receive purchase order items (Marks PO 'Received' & Auto-stocks products into warehouse)
router.post('/purchase-orders/:id/receive', async (req, res) => {
  try {
    const po = await getOne('SELECT * FROM inventory_purchase_orders WHERE id = ?', [req.params.id]);
    if (!po) return res.status(404).json({ error: 'Purchase order not found' });

    const today = '2026-10-01';
    await execute(
      "UPDATE inventory_purchase_orders SET status = 'Received', receivedDate = ? WHERE id = ?",
      [today, po.id]
    );

    const items = po.items ? JSON.parse(po.items) : [];
    // Auto increment stock for each item in product database
    for (const item of items) {
      if (item.productId) {
        const prd = await getOne('SELECT * FROM inventory_products WHERE id = ?', [item.productId]);
        if (prd) {
          const qty = Number(item.quantity) || 0;
          const newQty = prd.quantity + qty;
          const status = calculateStatus(newQty, prd.minThreshold);
          await execute(
            'UPDATE inventory_products SET quantity = ?, status = ?, lastRestocked = ? WHERE id = ?',
            [newQty, status, today, prd.id]
          );

          // Add movement
          const movId = `MOV-${Date.now().toString().slice(-5)}`;
          await execute(
            `INSERT INTO inventory_stock_movements (id, productId, productName, sku, type, quantity, unitPrice, totalAmount, previousStock, newStock, reason, referenceNo, supplier, performedBy, timestamp, notes)
             VALUES (?, ?, ?, ?, 'IN', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              movId, prd.id, prd.name, prd.sku, qty, Number(item.unitCost) || prd.costPrice,
              qty * (Number(item.unitCost) || prd.costPrice), prd.quantity, newQty,
              `PO Delivery Received (${po.poNumber})`, po.poNumber, po.supplierName,
              req.body.receivedBy || 'Administrator', `${today} 11:00 AM`,
              `Goods received against PO ${po.poNumber}`
            ]
          );
        }
      }
    }

    const updatedPO = await getOne('SELECT * FROM inventory_purchase_orders WHERE id = ?', [po.id]);
    res.json({
      success: true,
      po: {
        ...updatedPO,
        items: JSON.parse(updatedPO.items || '[]')
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
