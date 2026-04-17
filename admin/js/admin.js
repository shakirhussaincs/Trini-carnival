/* ---------- Utilities ---------- */
const escapeHTML = (str) => {
  if (!str) return '';
  return str.toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

document.addEventListener('DOMContentLoaded', () => {
  // --- AUTH GUARD ---
  const isAuthenticated = localStorage.getItem('admin_auth') === 'true';
  const path = window.location.pathname;

  if (!isAuthenticated && !path.includes('login.html')) {
    window.location.href = '/admin/login.html';
    return;
  }
  // ------------------

  if (path.endsWith('/admin') || path.endsWith('/admin/') || path.endsWith('admin/index.html')) fetchStats();
  if (path.includes('bookings.html')) fetchBookings();
  if (path.includes('properties.html')) {
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
        <div class="stat-card" onclick="window.location.href='/admin/properties.html'">
          <h3>Total Estates</h3>
          <div class="val">${totalProperties}</div>
          <div style="font-size: 0.7rem; color: var(--accent); margin-top: 10px; font-weight: 700;">BROWSE ALL &rarr;</div>
        </div>
        <div class="stat-card" onclick="window.location.href='/admin/bookings.html'">
          <h3>All Inquiries</h3>
          <div class="val">${totalBookings}</div>
          <div style="font-size: 0.7rem; color: var(--accent); margin-top: 10px; font-weight: 700;">VIEW HISTORY &rarr;</div>
        </div>
        <div class="stat-card stat-accent" onclick="window.location.href='/admin/bookings.html?filter=Pending'">
          <h3>Pending Review</h3>
          <div class="val">${pendingBookings}</div>
          <div style="font-size: 0.7rem; color: var(--accent); margin-top: 10px; font-weight: 700;">ACT NOW &rarr;</div>
        </div>
        <div class="stat-card" style="border-left: 4px solid var(--status-approved)" onclick="window.location.href='/admin/bookings.html?filter=Approved'">
          <h3>Approved</h3>
          <div class="val">${approvedBookings}</div>
          <div style="font-size: 0.7rem; color: var(--status-approved); margin-top: 10px; font-weight: 700;">CHECK GUESTS &rarr;</div>
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
        <td><code>${escapeHTML(p.id)}</code></td>
        <td>
          <div style="display: flex; align-items: center; gap: 15px;">
            <img src="${p.image}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px; background: #eee;" onerror="this.src='/images/logo.png'">
            <strong>${escapeHTML(p.name)}</strong>
          </div>
        </td>
        <td>${escapeHTML(p.location)}</td>
        <td>${escapeHTML(p.bedrooms)} Beds</td>
        <td>${escapeHTML(p.capacity)}</td>
        <td>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-outline" style="color:var(--accent); border-color:var(--accent); padding: 5px 10px; font-size: 0.6rem;" onclick="editProperty('${p.id}')">Edit</button>
            <button class="btn btn-outline" style="color:var(--status-rejected); border-color:var(--status-rejected); padding: 5px 10px; font-size: 0.6rem;" onclick="deleteProperty('${p.id}')">Delete</button>
          </div>
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

window.previewImages = async () => {
  const container = document.getElementById('image-preview-container');
  const fileInput = document.getElementById('p-image');
  const files = Array.from(fileInput.files);
  
  if (files.length === 0) return;

  // Show a "Processing" state if many files
  const originalLabel = fileInput.previousElementSibling;
  const originalText = originalLabel.innerText;
  if(files.length > 2) originalLabel.innerText = "Processing Images...";

  for (const f of files) {
    try {
      const base64 = await processImageFile(f);
      STAGED_IMAGES.push(base64);
    } catch (err) {
      console.error("Error processing file:", err);
    }
  }

  // Clear input so it doesn't hold files already staged
  fileInput.value = "";
  originalLabel.innerText = originalText;
  
  renderPreviews();
};

window.renderPreviews = () => {
  const container = document.getElementById('image-preview-container');
  if (!container) return;
  
  container.innerHTML = STAGED_IMAGES.map((img, index) => `
    <div class="preview-item">
      <img src="${img}">
      <button type="button" class="preview-remove" onclick="removeImage(${index})" title="Remove">×</button>
      ${index === 0 ? '<div class="featured-badge">Featured</div>' : ''}
    </div>
  `).join('');
};

window.removeImage = (index) => {
  STAGED_IMAGES.splice(index, 1);
  renderPreviews();
};

function showToast(msg, icon = '✨') {
  const overlay = document.getElementById('toast-overlay');
  const container = document.getElementById('toast-container');
  const msgEl = document.getElementById('toast-msg');
  const iconEl = document.getElementById('toast-icon');

  if (!container) return; // Fallback handled by UI presence

  msgEl.textContent = msg;
  iconEl.textContent = icon;
  
  // Clean classes
  overlay.classList.add('active');
  container.classList.add('active');

  setTimeout(() => {
    overlay.classList.remove('active');
    container.classList.remove('active');
  }, 3500);
}

function showConfirmModal({ title, msg, icon, onConfirm }) {
  const overlay = document.getElementById('confirm-overlay');
  const titleEl = document.getElementById('confirm-title');
  const textEl = document.getElementById('confirm-text');
  const iconEl = document.getElementById('confirm-icon');
  const okBtn = document.getElementById('confirm-ok');
  const cancelBtn = document.getElementById('confirm-cancel');

  if (!overlay) return;

  titleEl.textContent = title;
  textEl.textContent = msg;
  iconEl.textContent = icon || '❓';
  
  overlay.classList.add('active');

  const handleOk = () => {
    overlay.classList.remove('active');
    cleanup();
    if (onConfirm) onConfirm();
  };

  const handleCancel = () => {
    overlay.classList.remove('active');
    cleanup();
  };

  const cleanup = () => {
    okBtn.removeEventListener('click', handleOk);
    cancelBtn.removeEventListener('click', handleCancel);
  };

  okBtn.addEventListener('click', handleOk);
  cancelBtn.addEventListener('click', handleCancel);
}

let EDIT_DATA = null;
let STAGED_IMAGES = []; // Global store for images to be uploaded

async function editProperty(id) {
  try {
    const { data, error } = await supabase.from('properties').selectWhere('id', id);
    if (error) throw error;
    if (!data || data.length === 0) return;
    
    const p = data[0];
    EDIT_DATA = { ...p }; // Clone for comparison
    
    // Fill form
    document.getElementById('p-id').value = p.id;
    document.getElementById('p-name').value = p.name;
    document.getElementById('p-tagline').value = p.tagline || '';
    document.getElementById('p-location').value = p.location;
    document.getElementById('p-badge').value = p.badge || '';
    document.getElementById('p-beds').value = p.bedrooms;
    document.getElementById('p-baths').value = p.bathrooms;
    document.getElementById('p-cap').value = p.capacity;
    document.getElementById('p-ttd').value = p.priceTTD || '';
    document.getElementById('p-desc').value = p.description || '';
    
    // Preview image
    STAGED_IMAGES = p.gallery && p.gallery.length > 0 ? [...p.gallery] : (p.image ? [p.image] : []);
    renderPreviews();
    
    // Change UI mode
    document.getElementById('p-mode').value = 'update';
    document.getElementById('submit-btn').innerText = 'SAVE CHANGES';
    document.getElementById('cancel-edit').style.display = 'inline-block';
    document.querySelector('.panel-header h2').innerText = 'Editing: ' + p.name;
    
    // Scroll to form
    document.querySelector('.admin-panel').scrollIntoView({ behavior: 'smooth' });
    
  } catch (err) {
    showToast('Failed to load property data', '⚠️');
  }
}

function cancelEditing() {
  const form = document.getElementById('add-property-form');
  
  // Check if dirty (only if we were editing)
  if (EDIT_DATA) {
    const currentPayload = {
      id: document.getElementById('p-id').value,
      name: document.getElementById('p-name').value,
      tagline: document.getElementById('p-tagline').value,
      location: document.getElementById('p-location').value,
      badge: document.getElementById('p-badge').value,
      bedrooms: parseInt(document.getElementById('p-beds').value),
      bathrooms: parseFloat(document.getElementById('p-baths').value),
      capacity: parseInt(document.getElementById('p-cap').value),
      priceTTD: document.getElementById('p-ttd').value || '$3200 - $3500 TTD',
      description: document.getElementById('p-desc').value
    };

    const hasChanges = 
      currentPayload.id !== EDIT_DATA.id ||
      currentPayload.name !== EDIT_DATA.name ||
      currentPayload.tagline !== (EDIT_DATA.tagline || '') ||
      currentPayload.location !== EDIT_DATA.location ||
      currentPayload.badge !== (EDIT_DATA.badge || '') ||
      currentPayload.bedrooms !== (EDIT_DATA.bedrooms || 0) ||
      currentPayload.bathrooms !== (EDIT_DATA.bathrooms || 0) ||
      currentPayload.capacity !== (EDIT_DATA.capacity || 0) ||
      currentPayload.priceTTD !== (EDIT_DATA.priceTTD || '') ||
      currentPayload.description !== (EDIT_DATA.description || '');

    if (hasChanges) {
      showConfirmModal({
        title: 'Discard Changes?',
        msg: 'You have unsaved modifications to this property. Are you sure you want to cancel?',
        icon: '⚠️',
        onConfirm: () => resetForm(form)
      });
      return;
    }
  }

  resetForm(form);
}

function resetForm(form) {
  form.reset();
  EDIT_DATA = null;
  document.getElementById('p-mode').value = 'create';
  document.getElementById('submit-btn').innerText = 'PUBLISH ESTATE';
  document.getElementById('cancel-edit').style.display = 'none';
  document.querySelector('.panel-header h2').innerText = 'Add New Property';
  STAGED_IMAGES = [];
  document.getElementById('image-preview-container').innerHTML = '';
}

function initPropertyForm() {
  const form = document.getElementById('add-property-form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const mode = document.getElementById('p-mode').value;
    const btn = document.getElementById('submit-btn');
    const originalText = btn.innerText;
    btn.innerText = 'PROCESSING...';
    btn.disabled = true;
    
    if (STAGED_IMAGES.length === 0) {
      showToast('Please upload at least one image', '⚠️');
      btn.innerText = originalText;
      btn.disabled = false;
      return;
    }

    try {
      const mode = document.getElementById('p-mode').value;
      const title = mode === 'update' ? 'Confirm Update' : 'Confirm Publication';
      const msg = mode === 'update' ? 'Are you sure you want to save these changes to the property?' : 'Ready to publish this new property to the live catalog?';
      const icon = mode === 'update' ? '✍️' : '🚀';

      showConfirmModal({
        title,
        msg,
        icon,
        onConfirm: async () => {
          btn.innerText = 'SYNCING...';
          btn.disabled = true;

          try {
            const finalImage = STAGED_IMAGES.length > 0 ? STAGED_IMAGES[0] : null;
            const finalGallery = STAGED_IMAGES;

            const payload = {
              id: document.getElementById('p-id').value,
              name: document.getElementById('p-name').value,
              tagline: document.getElementById('p-tagline').value,
              location: document.getElementById('p-location').value,
              badge: document.getElementById('p-badge').value,
              bedrooms: parseInt(document.getElementById('p-beds').value),
              bathrooms: parseFloat(document.getElementById('p-baths').value),
              capacity: parseInt(document.getElementById('p-cap').value),
              priceTTD: document.getElementById('p-ttd').value || '$3200 - $3500 TTD',
              image: finalImage,
              description: document.getElementById('p-desc').value,
              descriptionLong: document.getElementById('p-desc').value,
              gallery: finalGallery
            };

            if (mode === 'update') {
              const { error } = await supabase.from('properties').update(payload, 'id', EDIT_DATA.id);
              if (error) throw error;
              showToast('Property updated successfully!', '✅');
            } else {
              const { error } = await supabase.from('properties').insert(payload);
              if (error) throw error;
              showToast('New property published!', '🎉');
            }
            
            resetForm(form);
            fetchProperties();
          } catch (err) {
            console.error('Save error:', err);
            showToast(err.message, '⚠️');
          } finally {
            btn.innerText = originalText;
            btn.disabled = false;
          }
        }
      });
    } catch (err) {
      console.error('Validation error:', err);
      showToast(err.message, '⚠️');
      btn.innerText = originalText;
      btn.disabled = false;
    }
  });
}


async function deleteProperty(id) {
  showConfirmModal({
    title: 'Delete Property?',
    msg: `Are you sure you want to remove '${id}'? This action is permanent and cannot be reversed.`,
    icon: '🗑️',
    onConfirm: async () => {
      try {
        const { error } = await supabase.from('properties').delete('id', id);
        if (error) throw error;
        showToast('Property deleted successfully', '✅');
        fetchProperties();
      } catch (err) {
        showToast('Delete error: ' + err.message, '⚠️');
      }
    }
  });
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

    const urlParams = new URLSearchParams(window.location.search);
    const statusFilter = urlParams.get('filter');

    ALL_BOOKINGS = (bookings || []).map(b => ({
      ...b,
      propertyName: propMap[b.propertyId] || b.propertyId || 'Unknown'
    })).filter(b => !statusFilter || b.status === statusFilter);
    
    // Update header title if filter is active
    const headerH1 = document.querySelector('.admin-header h1');
    if (statusFilter && headerH1) headerH1.textContent = `${statusFilter} Inquiries`;

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
      <td style="font-family:monospace;">#${escapeHTML(b.id.toString().padStart(4, '0'))}</td>
      <td><strong>${escapeHTML(b.firstName)} ${escapeHTML(b.lastName)}</strong><br><small style="color:var(--text-light)">${escapeHTML(b.email)}</small></td>
      <td style="font-weight:600; color:var(--accent);">${escapeHTML(b.propertyName)}</td>
      <td>${escapeHTML(b.checkIn)} to ${escapeHTML(b.checkOut)}</td>
      <td>${escapeHTML(b.guests)}</td>
      <td><span class="badge badge-${escapeHTML(b.status.toLowerCase())}">${escapeHTML(b.status)}</span></td>
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
      <p><strong>Property Selected</strong> ${escapeHTML(b.propertyName)}</p>
      <p><strong>Check In</strong> ${escapeHTML(b.checkIn)}</p>
      <p><strong>Check Out</strong> ${escapeHTML(b.checkOut)}</p>
      <p><strong>No. of Guests</strong> ${escapeHTML(b.guests)}</p>
      <p><strong>Current Status</strong> <span class="badge badge-${escapeHTML(b.status.toLowerCase())}">${escapeHTML(b.status)}</span></p>
    </div>
    <div>
      <p><strong>Primary Contact</strong> ${escapeHTML(b.firstName)} ${escapeHTML(b.lastName)}</p>
      <p><strong>Email Address</strong> <a href="mailto:${escapeHTML(b.email)}" style="color:var(--accent);">${escapeHTML(b.email)}</a></p>
      <p><strong>Phone Number</strong> ${escapeHTML(b.phone)}</p>
      <p><strong>Request Date</strong> ${escapeHTML(new Date(b.createdAt).toLocaleString())}</p>
    </div>
    <div style="grid-column: 1/-1; background: var(--bg-light); padding: 20px; border-radius: 4px; border: 1px solid var(--border);">
      <strong>User Message / Special Requests</strong>
      <p style="margin-top: 10px; font-style: italic; color: var(--text-gray);">${escapeHTML(b.message) || 'No additional message provided.'}</p>
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
  showConfirmModal({
    title: 'Change Status?',
    msg: `Set inquiry #${id} to ${newStatus}?`,
    icon: '📊',
    onConfirm: async () => {
      try {
        const { data, error } = await supabase.from('bookings').update({ status: newStatus }, 'id', id);
        if (error) throw error;
        showToast(`Status updated to ${newStatus}`, '✅');
        closeModal();
        fetchBookings();
      } catch (err) {
        console.error('Update error:', err);
        showToast('Failed to update status', '⚠️');
      }
    }
  });
}

