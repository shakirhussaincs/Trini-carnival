/* =============================================
   ADMIN JS — Supabase-powered (no backend)
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  if (path.endsWith('index.html') || path.endsWith('/admin/')) fetchStats();
  if (path.endsWith('bookings.html')) fetchBookings();
  if (path.endsWith('properties.html')) {
    fetchProperties();
    initPropertyForm();
  }
});

/* ---------- Navigation ---------- */
// Handled by static 'active' class on each HTML page for simplicity as shown in HTML

/* ---------- Stats ---------- */
async function fetchStats() {
  try {
    // Count exact items if count() is not direct
    const { data: props } = await supabase.from('properties').select('id');
    const { data: books } = await supabase.from('bookings').select('id, status');

    const totalProperties = props ? props.length : 0;
    const totalBookings = books ? books.length : 0;
    const pendingBookings = books ? books.filter(b => b.status === 'Pending').length : 0;
    const approvedBookings = books ? books.filter(b => b.status === 'Approved').length : 0;

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

/* ---------- Estates Management ---------- */
async function fetchProperties() {
  const tbody = document.getElementById('properties-tbody');
  if (!tbody) return;
  try {
    const { data, error } = await supabase.from('properties').select('*');
    if (error) throw error;

    tbody.innerHTML = (data || []).map(p => `
      <tr>
        <td><code>${p.id}</code></td>
        <td><strong>${p.name}</strong></td>
        <td>${p.location}</td>
        <td>${p.bedrooms} Beds</td>
        <td>${p.capacity}</td>
        <td>
          <button class="btn btn-outline" style="color:var(--status-rejected); border-color:var(--status-rejected);" onclick="deleteProperty('${p.id}')">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Props error:', err);
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Failed to fetch estates.</td></tr>';
  }
}

const processImageFile = (file, maxWidth = 1200) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

function initPropertyForm() {
  const form = document.getElementById('add-property-form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button');
    btn.innerText = 'PROCESSING IMAGES...';
    btn.disabled = true;

    try {
      const fileInput = document.getElementById('p-image');
      const files = Array.from(fileInput.files);
      if (files.length === 0) throw new Error("At least one image is required.");
      
      const base64Images = [];
      for (const file of files) {
        const base64 = await processImageFile(file);
        base64Images.push(base64);
      }

      btn.innerText = 'PUBLISHING...';

      const payload = {
        id: document.getElementById('p-id').value,
        name: document.getElementById('p-name').value,
        tagline: document.getElementById('p-tagline').value,
        location: document.getElementById('p-location').value,
        badge: document.getElementById('p-badge').value,
        bedrooms: parseInt(document.getElementById('p-beds').value),
        bathrooms: parseFloat(document.getElementById('p-baths').value),
        capacity: parseInt(document.getElementById('p-cap').value),
        priceTTD: document.getElementById('p-ttd').value,
        image: base64Images[0],
        description: document.getElementById('p-desc').value,
        descriptionLong: document.getElementById('p-desc').value,
        gallery: base64Images,
        amenities: []
      };

      const { data, error } = await supabase.from('properties').insert(payload);
      if (error) throw error;
      alert('Estate Published Successfully');
      form.reset();
      fetchProperties();
    } catch (err) {
      console.error('Save error:', err);
      alert('Error saving property: ' + err.message);
    } finally {
      btn.innerText = 'PUBLISH ESTATE';
      btn.disabled = false;
    }
  });
}

async function deleteProperty(id) {
  if (!confirm(`Are you sure you want to delete ${id}? This action is permanent.`)) return;
  try {
    const { error } = await supabase.from('properties').delete('id', id);
    if (error) throw error;
    fetchProperties();
  } catch (err) {
    alert('Delete error: ' + err.message);
  }
}

/* ---------- Inquiries ---------- */
let ALL_BOOKINGS = [];

async function fetchBookings() {
  const tbody = document.getElementById('bookings-tbody');
  if (tbody) tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Loading requests...</td></tr>';
  try {
    const { data: bookings, error } = await supabase.from('bookings').selectOrdered('*', 'createdAt', false);
    if (error) throw error;

    const { data: properties } = await supabase.from('properties').select('id,name');
    const propMap = {};
    if (properties) properties.forEach(p => propMap[p.id] = p.name);

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
      <td style="font-family:monospace;">#${b.id.toString().padStart(4, '0')}</td>
      <td><strong>${b.firstName} ${b.lastName}</strong><br><small style="color:var(--text-light)">${b.email}</small></td>
      <td style="font-weight:600; color:var(--accent);">${b.propertyName}</td>
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

