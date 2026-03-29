/* =============================================
   TRINI CARNIVAL RENTALS — Main App Logic
   ============================================= */

// Global state
let PROPERTIES = [];
let ALL_LOCATIONS = [];

// Dynamic SVG Icons
const ICONS = {
  bed: '<svg viewBox="0 0 24 24"><path d="M3 7v11m0-4h18m0 4V8a1 1 0 0 0-1-1H10a1 1 0 0 0-1 1v4"/><rect x="3" y="7" width="4" height="4" rx="1"/></svg>',
  bath: '<svg viewBox="0 0 24 24"><path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1zM6 12V5a2 2 0 0 1 2-2h3v2H8v7"/></svg>',
  guests: '<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  location: '<svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  default: '<svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>'
};

/**
 * Renders a Luxury Property Card
 */
function renderPropertyCard(property) {
  return `
    <a href="property.html?id=${property.id}" class="property-card" id="card-${property.id}">
      <div class="property-img-wrapper">
        <img src="${property.image}" alt="${property.name}" loading="lazy">
        <div class="property-overlay">
          <div style="font-size:0.75rem; color:var(--accent); text-transform:uppercase; letter-spacing:0.1em; margin-bottom:5px;">${property.location}</div>
          <h3>${property.name}</h3>
          <p>${property.tagline}</p>
          <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.15em; color:var(--accent-red); margin-top:15px;">View Details →</div>
        </div>
      </div>
    </a>
  `;
}

document.addEventListener('DOMContentLoaded', async () => {
  initGlobalHeader();
  initFAQ();
  initForms();
  
  await fetchProperties();
  
  initDropdownInjections();
  initPageRendering();
});

/* ---------- Data Fetching ---------- */
async function fetchProperties() {
  try {
    const res = await fetch('/api/properties');
    if (res.ok) {
      PROPERTIES = await res.json();
      ALL_LOCATIONS = [...new Set(PROPERTIES.map(p => p.location))].sort();
    }
  } catch (err) {
    console.error('API Error:', err);
  }
}

async function fetchPropertyDetails(id) {
  try {
    const res = await fetch(`/api/properties/${id}`);
    if (res.ok) {
      const prop = await res.json();
      
      // Inject Hero
      const heroBg = document.getElementById('hero-bg-img');
      const heroName = document.getElementById('villa-name-main');
      if (heroBg) heroBg.style.backgroundImage = `url('${prop.image}')`;
      if (heroName) heroName.textContent = prop.name;

      // Inject Pricing
      const priceTTD = document.getElementById('price-ttd');
      const priceUSD = document.getElementById('price-usd');
      if (priceTTD) priceTTD.textContent = prop.priceTTD || '$2800 - $3000 TTD';
      if (priceUSD) priceUSD.textContent = prop.priceUSD || '$412 - $441 USD';

      // Inject Details
      const bedDetail = document.getElementById('bed-detail');
      const bathDetail = document.getElementById('bath-detail');
      const capDetail = document.getElementById('capacity-detail');
      if (bedDetail) bedDetail.textContent = prop.bedroomDetail || `${prop.bedrooms} Bedrooms`;
      if (bathDetail) bathDetail.textContent = `${prop.bathrooms} Bathrooms`;
      if (capDetail) capDetail.textContent = `${prop.capacity} Persons`;

      // Inject Amenities
      const amenityList = document.getElementById('amenity-list-main');
      if (amenityList) {
        let amenities = [];
        try {
          amenities = typeof prop.amenities === 'string' ? JSON.parse(prop.amenities) : prop.amenities;
        } catch(e) { amenities = prop.amenities || []; }
        amenityList.innerHTML = amenities.map(a => `<li>${a}</li>`).join('');
      }

      // Inject Large Feature Image
      const featureImg = document.getElementById('main-feature-img');
      if (featureImg) featureImg.src = prop.image;

      // Inject Dense Gallery
      const galleryGrid = document.getElementById('gallery-dense-grid');
      if (galleryGrid) {
        let gallery = [];
        try {
          if (typeof prop.gallery === 'string') {
            gallery = JSON.parse(prop.gallery);
          } else {
            gallery = prop.gallery || [];
          }
        } catch(e) { 
          console.error('Gallery Parse Error:', e);
          gallery = []; 
        }
        
        console.log('Rendering Gallery:', gallery);
        if (gallery.length > 0) {
          galleryGrid.innerHTML = gallery.map(img => `
            <div class="gallery-item">
              <img src="${img}" alt="${prop.name} gallery" loading="lazy">
            </div>
          `).join('');
        } else {
          galleryGrid.innerHTML = '<p style="grid-column: 1/-1; opacity:0.5; padding:40px;">Detailed gallery views arriving soon.</p>';
        }
      }

      // Inject Long Description
      const descLong = document.getElementById('villa-description-long');
      if (descLong) descLong.textContent = prop.descriptionLong || prop.description;

      // Inject New Layout Sections (Arara Flow)
      const nameSecondary = document.getElementById('villa-name-secondary');
      if (nameSecondary) nameSecondary.textContent = prop.name;

      const locSecondary = document.getElementById('villa-location-secondary');
      if (locSecondary) locSecondary.textContent = prop.location;

      const calTitle = document.getElementById('calendar-title');
      if (calTitle) calTitle.textContent = `Check Availability - ${prop.name}`;

      const touchText = document.getElementById('get-in-touch-text');
      if (touchText) touchText.textContent = `Interested in ${prop.name}? Get in touch!`;

      const revTitle = document.getElementById('review-title');
      if (revTitle) revTitle.textContent = `Leave a review about your experience at ${prop.name}!`;

      // Inject Bedroom Layout Grid
      const bedroomContainer = document.getElementById('bedroom-layout-container');
      if (bedroomContainer) {
        let layouts = [];
        try {
          if (typeof prop.bedroomLayout === 'string') layouts = JSON.parse(prop.bedroomLayout);
          else if (prop.bedroomLayout) layouts = prop.bedroomLayout;
        } catch(e) {}

        // Fallback if no specific layout is defined in DB
        if (!layouts || layouts.length === 0) {
          layouts = [];
          for(let i=1; i<=prop.bedrooms; i++) {
            layouts.push({ title: `Bedroom ${i}`, type: 'Ensuite', bed: '1 Queen Bed' });
          }
        }

        bedroomContainer.innerHTML = layouts.map(bed => `
          <div class="bedroom-card">
            <svg class="bedroom-icon" viewBox="0 0 24 24"><path d="M2 22v-3a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v3M5 18V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v13M2 8h20"/></svg>
            <div class="bedroom-title">${bed.title}</div>
            <div class="bedroom-type">${bed.type || 'Standard'}</div>
            <div class="bedroom-bed">${bed.bed}</div>
          </div>
        `).join('');
      }

      // Update Page Title
      document.title = `${prop.name} | Trini Carnival Rentals`;
    }
  } catch (err) {
    console.error('Failed to fetch property details:', err);
  }
}

/* ---------- Header & Dropdown Logic ---------- */
function initGlobalHeader() {
  const header = document.querySelector('.header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  });

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      mobileToggle.classList.toggle('active');
    });
  }

  // Handle mobile dropdowns
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    const link = item.querySelector('a');
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 1024) {
        const dropdown = item.querySelector('.dropdown-menu');
        if (dropdown) {
          e.preventDefault();
          item.classList.toggle('active');
        }
      }
    });
  });
}

function initDropdownInjections() {
  const villasDropdown = document.getElementById('villas-dropdown');
  const locationsDropdown = document.getElementById('locations-dropdown');

  if (villasDropdown) {
    // Clear existing (except View All)
    const viewAll = villasDropdown.querySelector('a[style*="font-weight: 700"]');
    villasDropdown.innerHTML = '';
    if (viewAll) villasDropdown.appendChild(viewAll);

    PROPERTIES.sort((a,b) => a.name.localeCompare(b.name)).forEach(p => {
      const a = document.createElement('a');
      a.href = `property.html?id=${p.id}`;
      a.textContent = p.name;
      villasDropdown.appendChild(a);
    });
  }

  if (locationsDropdown) {
    locationsDropdown.innerHTML = '<div class="dropdown-header">Explore Regions</div>';
    ALL_LOCATIONS.forEach(loc => {
      const a = document.createElement('a');
      a.href = `location.html?place=${encodeURIComponent(loc)}`;
      a.textContent = loc;
      locationsDropdown.appendChild(a);
    });
  }
}

/* ---------- Page Initialization ---------- */
function initPageRendering() {
  const path = window.location.pathname;
  const urlParams = new URLSearchParams(window.location.search);

  // Home Page logic
  if (path.endsWith('index.html') || path === '/' || path.endsWith('/')) {
    const featuredGrid = document.getElementById('featured-grid');
    if (featuredGrid) {
      const featured = PROPERTIES.filter(p => p.badge === 'Featured' || p.badge === 'Ultimate' || p.badge === 'Popular').slice(0, 3);
      featuredGrid.innerHTML = featured.map(renderPropertyCard).join('');
    }
  }

  // All Villas Grid
  if (path.endsWith('villas.html')) {
    const villasGrid = document.getElementById('villas-grid');
    if (villasGrid) {
      villasGrid.innerHTML = PROPERTIES.map(renderPropertyCard).join('');
    }
  }

  // Region / Location Page logic
  if (path.endsWith('location.html')) {
    const place = urlParams.get('place');
    const filteredProps = PROPERTIES.filter(p => p.location === place);
    const placeNameText = document.getElementById('place-name');
    if (placeNameText) placeNameText.textContent = place || 'Tobago Estates';
    document.title = `${place || 'Portfolio'} | Trini Carnival Rentals`;
    
    const regionGrid = document.getElementById('region-grid');
    if (regionGrid) {
      regionGrid.innerHTML = filteredProps.length 
        ? filteredProps.map(renderPropertyCard).join('') 
        : '<p class="text-center" style="grid-column: 1/-1;">Check back soon for more properties in this area.</p>';
    }
  }

  // Single Property Detail Page logic
  if (path.endsWith('property.html')) {
    const propId = urlParams.get('id');
    if (propId) {
      fetchPropertyDetails(propId);
    } else if (PROPERTIES.length > 0) {
      fetchPropertyDetails(PROPERTIES[0].id);
    }
  }

  // Form Pre-fill
  if (path.endsWith('book.html')) {
    const propId = urlParams.get('id');
    const select = document.getElementById('property-select');
    if (select && PROPERTIES.length) {
      select.innerHTML = '<option value="">Select a Property...</option>' + 
        PROPERTIES.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
      if (propId) select.value = propId;
    }
  }
}

/* ---------- FAQ & Forms ---------- */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const q = item.querySelector('.faq-question');
    if (q) {
      q.addEventListener('click', () => {
        const active = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!active) item.classList.add('active');
      });
    }
  });
}

function initForms() {
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (!btn) return;
      
      const originalText = btn.innerHTML;
      btn.innerHTML = 'PROCESSING...';
      btn.disabled = true;

      // Inquiry Submission logic
      if (form.id === 'booking-form') {
        const payload = {
          propertyId: document.getElementById('property-select').value,
          checkIn: document.getElementById('check-in').value,
          checkOut: document.getElementById('check-out').value,
          firstName: document.getElementById('fname').value,
          lastName: document.getElementById('lname').value,
          email: document.getElementById('email').value,
          phone: document.getElementById('phone').value,
          guests: document.getElementById('guests').value,
          message: document.getElementById('message').value
        };

        try {
          const res = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (res.ok) {
            form.style.display = 'none';
            const success = document.querySelector('.form-success');
            if (success) success.classList.add('show');
          } else { alert('Error. Please contact us directly.'); }
        } catch (err) { alert('Connection error.'); } finally {
          btn.innerHTML = originalText; btn.disabled = false;
        }
      } else {
        // Generic contact form mock
        setTimeout(() => {
          form.style.display = 'none';
          const success = document.querySelector('.form-success');
          if (success) success.classList.add('show');
          btn.innerHTML = originalText; btn.disabled = false;
        }, 1000);
      }
    });
  });
}
