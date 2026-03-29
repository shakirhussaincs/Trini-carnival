const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files (from Phase 1)
app.use(express.static(path.join(__dirname)));
// Serve admin files specifically under /admin/
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// --- API ROUTES ---

// 1. Get all properties
app.get('/api/properties', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM properties').all();
    
    // Parse JSON strings back into arrays
    const properties = rows.map(row => ({
      ...row,
      gallery: JSON.parse(row.gallery || '[]'),
      amenities: JSON.parse(row.amenities || '[]')
    }));
    
    res.json(properties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 2. Get single property
app.get('/api/properties/:id', (req, res) => {
  try {
    const property = db.prepare('SELECT * FROM properties WHERE id = ?').get(req.params.id);
    if (!property) return res.status(404).json({ error: 'Property not found' });
    
    property.gallery = JSON.parse(property.gallery || '[]');
    property.amenities = JSON.parse(property.amenities || '[]');
    
    res.json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 3. Submit a new booking request
app.post('/api/bookings', (req, res) => {
  const { propertyId, checkIn, checkOut, firstName, lastName, email, phone, guests, message } = req.body;
  
  if (!propertyId || !checkIn || !checkOut || !firstName || !lastName || !email || !phone || !guests) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO bookings (propertyId, checkIn, checkOut, firstName, lastName, email, phone, guests, message)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const info = stmt.run(propertyId, checkIn, checkOut, firstName, lastName, email, phone, guests, message || '');
    res.status(201).json({ success: true, bookingId: info.lastInsertRowid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 4. Get all bookings (Admin API)
app.get('/api/bookings', (req, res) => {
  try {
    // Join with properties table to get property name
    const bookings = db.prepare(`
      SELECT b.*, p.name as propertyName 
      FROM bookings b
      LEFT JOIN properties p ON b.propertyId = p.id
      ORDER BY b.createdAt DESC
    `).all();
    
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 5. Update booking status (Admin API)
app.put('/api/bookings/:id/status', (req, res) => {
  const { status } = req.body;
  if (!status || !['Pending', 'Approved', 'Rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const stmt = db.prepare('UPDATE bookings SET status = ? WHERE id = ?');
    const info = stmt.run(status, req.params.id);
    
    if (info.changes === 0) return res.status(404).json({ error: 'Booking not found' });
    res.json({ success: true, status });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Dashboard Analytics Endpoint (Admin API)
app.get('/api/stats', (req, res) => {
  try {
    const totalProperties = db.prepare('SELECT COUNT(*) as count FROM properties').get().count;
    const totalBookings = db.prepare('SELECT COUNT(*) as count FROM bookings').get().count;
    const pendingBookings = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'Pending'").get().count;
    const approvedBookings = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'Approved'").get().count;

    res.json({ totalProperties, totalBookings, pendingBookings, approvedBookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Handle 404s
app.use((req, res) => {
  res.status(404).send('Not Found');
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log(`Admin Dashboard available at http://localhost:${PORT}/admin/index.html`);
  });
}

// Export for serverless environments (like Vercel)
module.exports = app;
