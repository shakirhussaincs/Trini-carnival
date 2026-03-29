/* =============================================
   ADMIN JS — Supabase-powered (no backend)
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  if (path.endsWith('index.html') || path.endsWith('/admin/')) fetchStats();
  if (path.endsWith('bookings.html')) fetchBookings();
});

/* ---------- Stats ---------- */
async function fetchStats() {
  try {
    const totalProperties = await supabase.from('properties').count();
    const totalBookings = await supabase.from('bookings').count();
    const pendingBookings = await supabase.from('bookings').count('status', 'Pending');
    const approvedBookings = await supabase.from('bookings').count('status', 'Approved');

    const grid = document.getElementById('stats-grid');
    if (grid) {
      grid.innerHTML = `
        <div class="stat-card">
          <h3>Total Estates</h3>
          <div class="val">${totalProperties}</div>
        </div>
        <div class="stat-card">
          <h3>All Inquiries</h3>
          <div class="val">${totalBookings}</div>
        </div>
        <div class="stat-card stat-accent">
          <h3>Pending Review</h3>
          <div class="val">${pendingBookings}</div>
        </div>
        <div class="stat-card" style="border-top-color: var(--status-approved)">
          <h3>Approved</h3>
          <div class="val">${approvedBookings}</div>
        </div>
      `;
    }
  } catch (err) {
    console.error('Stats error:', err);
    const grid = document.getElementById('stats-grid');
    if (grid) grid.innerHTML = '<div class="stat-card"><h3>Error loading stats</h3></div>';
  }
}

/* ---------- Inquiries ---------- */
let ALL_BOOKINGS = [];

async function fetchBookings() {
  const tbody = document.getElementById('bookings-tbody');
  if (tbody) tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Loading requests...</td></tr>';
  try {
    // Fetch bookings ordered by createdAt descending
    const { data: bookings, error } = await supabase.from('bookings').selectOrdered('*', 'createdAt', false);
    if (error) throw error;

    // Fetch properties for name lookup
    const { data: properties } = await supabase.from('properties').select('id,name');
    const propMap = {};
    if (properties) properties.forEach(p => propMap[p.id] = p.name);

    // Attach property name to each booking
    ALL_BOOKINGS = (bookings || []).map(b => ({
      ...b,
      propertyName: propMap[b.propertyId] || b.propertyId || 'Unknown'
    }));
    
    renderBookings();
  } catch (err) {
    console.error('Bookings error:', err);
    if (tbody) tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Connection error.</td></tr>';
  }
}

function renderBookings() {
  const tbody = document.getElementById('bookings-tbody');
  if (!tbody) return;
  if (ALL_BOOKINGS.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No inquiries found.</td></tr>';
    return;
  }
  tbody.innerHTML = ALL_BOOKINGS.map(b => `
    <tr>
      <td style="font-family:'Inter',serif;">#${b.id.toString().padStart(4, '0')}</td>
      <td><strong>${b.firstName} ${b.lastName}</strong><br><small style="color:var(--text-light)">${b.email}</small></td>
      <td style="font-weight:500;">${b.propertyName}</td>
      <td>${b.checkIn} to ${b.checkOut}</td>
      <td>${b.guests}</td>
      <td><span class="badge badge-${b.status.toLowerCase()}">${b.status}</span></td>
      <td><button class="btn" onclick="viewBooking(${b.id})">Review</button></td>
    </tr>
  `).join('');
}

/* ---------- Modal Logic ---------- */
function viewBooking(id) {
  const b = ALL_BOOKINGS.find(x => x.id === id);
  if (!b) return;

  const overlay = document.getElementById('booking-modal');
  document.getElementById('modal-id').textContent = `#${b.id.toString().padStart(4, '0')}`;
  
  document.getElementById('modal-body').innerHTML = `
    <div>
      <p><strong>Property Selected</strong> ${b.propertyName}</p>
      <p><strong>Check In</strong> ${b.checkIn}</p>
      <p><strong>Check Out</strong> ${b.checkOut}</p>
      <p><strong>No. of Guests</strong> ${b.guests}</p>
      <p><strong>Current Status</strong> <span class="badge badge-${b.status.toLowerCase()}">${b.status}</span></p>
    </div>
    <div>
      <p><strong>Primary Contact</strong> ${b.firstName} ${b.lastName}</p>
      <p><strong>Email Address</strong> <a href="mailto:${b.email}" style="color:var(--accent);">${b.email}</a></p>
      <p><strong>Phone Number</strong> ${b.phone}</p>
      <p><strong>Request Date</strong> ${new Date(b.createdAt).toLocaleString()}</p>
    </div>
    <div style="grid-column: 1/-1; background: var(--bg-light); padding: 20px; border-radius: 4px; border: 1px solid var(--border);">
      <strong>User Message / Special Requests</strong>
      <p style="margin-top: 10px; font-style: italic; color: var(--text-gray);">${b.message || 'No additional message provided.'}</p>
    </div>
  `;

  document.getElementById('modal-footer').innerHTML = `
    <button class="btn" onclick="closeModal()">Close</button>
    ${b.status !== 'Approved' ? `<button class="btn btn-primary" style="background:var(--status-approved); border-color:var(--status-approved);" onclick="updateStatus(${b.id}, 'Approved')">Mark Approved</button>` : ''}
    ${b.status !== 'Rejected' ? `<button class="btn btn-primary" style="background:var(--status-rejected); border-color:var(--status-rejected);" onclick="updateStatus(${b.id}, 'Rejected')">Reject Inquiry</button>` : ''}
  `;

  overlay.classList.add('active');
}

function closeModal() {
  document.getElementById('booking-modal').classList.remove('active');
}

async function updateStatus(id, newStatus) {
  if (!confirm(`Confirm status change to ${newStatus}?`)) return;
  try {
    const { data, error } = await supabase.from('bookings').update({ status: newStatus }, 'id', id);
    if (error) throw error;
    closeModal();
    fetchBookings();
  } catch (err) {
    console.error('Update error:', err);
    alert('Failed to update.');
  }
}
