/* =============================================
   TRINI CARNIVAL RENTALS — Main App Logic
   (Supabase-powered, no backend required)
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
  default: '<svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>',
  pin: '<svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>'
};

const PALM_LEAF_SVG = `
<svg class="palm-leaf-icon" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M100 180C100 180 110 140 160 110C170 104 185 100 185 85C185 70 160 75 150 85C140 95 130 115 130 115M100 180C100 180 80 150 40 140C30 137.5 15 135 15 120C15 105 40 110 50 120C60 130 70 150 70 150M100 180V40M100 40C100 40 85 20 60 20C40 20 20 30 20 60C20 90 60 110 100 120M100 40C100 40 115 20 140 20C160 20 180 30 180 60C180 90 140 110 100 120" stroke="#FF7F50" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

/**
 * Renders a Luxury Property Card
 */
/**
 * Renders the High-Fidelity Bracket Card (used across the site)
 */
function renderPropertyCard(property) {
  return `
    <a href="property.html?id=${property.id}" class="v-card-ref" data-reveal>
      <div class="v-card-img-box">
        <img src="${property.image}" alt="${property.name}" loading="lazy">
        <div class="v-card-fade"></div>
      </div>
      
      <div class="v-card-icons">
        <div class="v-icon-col">
          <svg viewBox="0 0 24 24"><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8M4 10V8a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v2M12 10v10M2 17h20"/></svg>
          <div class="v-label">${property.bedrooms}</div>
        </div>
        <div class="v-divider"></div>
        <div class="v-icon-col">
          <svg viewBox="0 0 24 24"><path d="M9 6h7a2 2 0 0 1 2 2v5l-1.5 2H11l-1.5-2V8a2 2 0 0 1 2-2zM4 11h16a2 2 0 0 1 2 2v2a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5v-2a2 2 0 0 1 2-2z"/></svg>
          <div class="v-label">${property.bathrooms}</div>
        </div>
        <div class="v-divider"></div>
        <div class="v-icon-col">
          <svg viewBox="0 0 24 24"><circle cx="9" cy="7" r="4"/><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="17" cy="11" r="3"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg>
          <div class="v-label">${property.capacity}</div>
        </div>
        <div class="v-divider"></div>
        <div class="v-price-col">
          <div class="ttd-price">${property.priceTTD || 'Price on Inquiry'} TTD</div>
          <div class="usd-price">${property.priceUSD || (property.priceTTD ? '$' + Math.round(parseInt(property.priceTTD.replace(/[^0-9]/g, '') || 0)/6.8) + ' USD' : 'Bespoke Pricing')}</div>
        </div>
      </div>

      <div class="v-card-footer">
        <div class="v-footer-content">
          <h3 class="v-title">${property.name}</h3>
          <div class="v-location">
            <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="3"/></svg>
            ${property.location}
          </div>
        </div>
        <div class="v-bracket-left"></div>
        <div class="v-bracket-right"></div>
        <div class="v-bracket-bottom"></div>
      </div>
    </a>
  `;
}

// Alias for villas page consistency
function renderVillaCardRef(property) {
  return renderPropertyCard(property);
}


function renderBedroomHeader(label) {
  return `
    <div class="bedroom-header-wrapper" data-reveal>
      <div class="bedroom-oval">
        <div class="num">${label}</div>
        <div class="text">BEDROOMS</div>
        ${PALM_LEAF_SVG}
      </div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', async () => {
  initGlobalHeader();
  initFAQ();
  initForms();
  initScrollReveal();
  
  await fetchProperties();
  
  initDropdownInjections();
  initPageRendering();
});

/* ---------- Data Fetching (Supabase) ---------- */
async function fetchProperties() {
  try {
    const { data, error } = await supabase.from('properties').select();
    if (error) throw error;
    PROPERTIES = data || [];
    ALL_LOCATIONS = [...new Set(PROPERTIES.map(p => p.location))].sort();
  } catch (err) {
    console.error('Supabase Error:', err);
  }
}

async function fetchPropertyDetails(id) {
  try {
    const { data, error } = await supabase.from('properties').selectWhere('id', id);
    if (error) throw error;
    if (!data || data.length === 0) return;
    const prop = data[0];
    
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

    // Inject Amenities (Supabase returns JSONB as native arrays)
    const amenityList = document.getElementById('amenity-list-main');
    if (amenityList) {
      let amenities = [];
      if (Array.isArray(prop.amenities)) {
        amenities = prop.amenities;
      } else if (typeof prop.amenities === 'string') {
        try { amenities = JSON.parse(prop.amenities); } catch(e) { amenities = []; }
      }
      amenityList.innerHTML = amenities.map(a => `<li>${a}</li>`).join('');
    }

    // Inject Large Feature Image
    const featureImg = document.getElementById('main-feature-img');
    if (featureImg) featureImg.src = prop.image;

    // Inject Dense Gallery (Supabase returns JSONB as native arrays)
    const galleryGrid = document.getElementById('gallery-dense-grid');
    if (galleryGrid) {
      let gallery = [];
      if (Array.isArray(prop.gallery)) {
        gallery = prop.gallery;
      } else if (typeof prop.gallery === 'string') {
        try { gallery = JSON.parse(prop.gallery); } catch(e) { gallery = []; }
      }
      
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

    // Inject New Layout Sections
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
      if (Array.isArray(prop.bedroomLayout)) {
        layouts = prop.bedroomLayout;
      } else if (typeof prop.bedroomLayout === 'string') {
        try { layouts = JSON.parse(prop.bedroomLayout); } catch(e) {}
      }

      // Fallback if no specific layout is defined
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
    if (window.scrollY > 30) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  });

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      mobileToggle.classList.toggle('active');
      document.body.classList.toggle('nav-active');
    });
  }

  // Handle mobile dropdowns
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    const link = item.querySelector('a');
    if (!link) return;
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

function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
}

function initDropdownInjections() {
  const villasDropdown = document.getElementById('villas-dropdown');
  const locationsDropdown = document.getElementById('locations-dropdown');

  if (villasDropdown) {
    // 1. Prepare Spotlight Villas (Top 3 with images)
    let spotlight = PROPERTIES.filter(p => p.badge === 'Featured' || p.badge === 'Ultimate' || p.badge === 'Popular').slice(0, 3);
    if (spotlight.length === 0) spotlight = PROPERTIES.slice(0, 3);

    // 2. Build High-End Gallery Structure
    villasDropdown.classList.add('dropdown-mega');
    villasDropdown.innerHTML = `
      <div class="mega-gallery">
        <h5>Spotlight Collection</h5>
        <div class="mega-grid" id="mega-gallery-grid"></div>
      </div>
      <div class="mega-links">
        <h5>Discover By Size</h5>
        <a href="villas.html?filter=2">Two Bedroom Retreats</a>
        <a href="villas.html?filter=3">Three Bedroom Villas</a>
        <a href="villas.html?filter=4">Four Bedroom Masterpieces</a>
        <a href="villas.html?filter=6-8">Grande Estates (6-8 beds)</a>
        
        <h5 style="margin-top:20px;">Discovery</h5>
        <a href="location.html">Browse by Destination</a>
        <a href="villas.html" class="view-all-link">VIEW ALL PROPERTIES &rarr;</a>
      </div>
    `;

    const grid = villasDropdown.querySelector('#mega-gallery-grid');
    spotlight.forEach(p => {
      const a = document.createElement('a');
      a.href = `property.html?id=${p.id}`;
      a.className = 'mega-item';
      a.innerHTML = `
        <div class="mega-img"><img src="${p.image}" alt="${p.name}"></div>
        <div class="mega-info">${p.name}</div>
      `;
      grid.appendChild(a);
    });
  }

  if (locationsDropdown) {
    locationsDropdown.innerHTML = '<div class="dropdown-header">Explore Regions</div>';
    if (ALL_LOCATIONS.length > 10) locationsDropdown.classList.add('dropdown-scrollable');
    
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
      let featured = PROPERTIES.filter(p => p.badge === 'Featured' || p.badge === 'Ultimate' || p.badge === 'Popular').slice(0, 3);
      if (featured.length === 0) featured = PROPERTIES.slice(0, 3); // Fallback: Show first 3 if None marked as featured
      
      featuredGrid.innerHTML = featured.map(renderPropertyCard).join('');
      initScrollReveal(); // Reveal dynamically added cards
    }
  }

  // All Villas Grid — Grouped by Bedrooms
  if (path.endsWith('villas.html')) {
    initVillasToolbar();
    const filterId = urlParams.get('filter');
    if (filterId) {
      let filtered = PROPERTIES;
      if (filterId === '5') filtered = PROPERTIES.filter(p => p.bedrooms >= 5);
      else filtered = PROPERTIES.filter(p => p.bedrooms === parseInt(filterId));
      
      // Update UI tabs to match
      const tabs = document.querySelectorAll('.filter-tab');
      tabs.forEach(t => {
        if (t.getAttribute('data-filter') === filterId) t.classList.add('active');
        else if (filterId === '5' && t.getAttribute('data-filter') === '6-8') t.classList.add('active'); // loose match
        else t.classList.remove('active');
      });

      renderVillasGrid(filtered);
    } else {
      renderVillasGrid(PROPERTIES);
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
      initScrollReveal(); // Reveal dyamically added cards
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

function initVillasToolbar() {
  const searchInput = document.getElementById('villa-search');
  const tabs = document.querySelectorAll('.filter-tab');
  const sortSelect = document.getElementById('sort-select');

  if (!searchInput && !tabs.length) return;

  const performFilter = () => {
    const query = searchInput?.value.toLowerCase() || '';
    const activeTab = document.querySelector('.filter-tab.active');
    const filterVal = activeTab ? activeTab.getAttribute('data-filter') : 'all';
    const sortVal = sortSelect?.value || 'default';

    let filtered = PROPERTIES.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(query) || p.location.toLowerCase().includes(query);
      
      let matchTab = true;
      if (filterVal !== 'all') {
        if (filterVal === '6-8') {
          matchTab = p.bedrooms >= 6 && p.bedrooms <= 8;
        } else {
          matchTab = p.bedrooms === parseInt(filterVal);
        }
      }
      return matchSearch && matchTab;
    });

    // Sort
    if (sortVal === 'name-asc') filtered.sort((a,b) => a.name.localeCompare(b.name));
    if (sortVal === 'beds-asc') filtered.sort((a,b) => a.bedrooms - b.bedrooms);
    if (sortVal === 'beds-desc') filtered.sort((a,b) => b.bedrooms - a.bedrooms);

    renderVillasGrid(filtered);
  };

  searchInput?.addEventListener('input', performFilter);
  sortSelect?.addEventListener('change', performFilter);

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      performFilter();
    });
  });
}

function renderVillasGrid(list) {
  const villasGrid = document.getElementById('villas-grid');
  const countDisp = document.getElementById('results-count');
  if (!villasGrid) return;

  if (countDisp) countDisp.textContent = `Showing all ${list.length} properties`;

  villasGrid.innerHTML = '';
  
  // Grouping logic
  const grouped = list.reduce((acc, p) => {
    let count = p.bedrooms || 1;
    let key = count.toString();
    if (count >= 6 && count <= 8) key = '6-8';
    
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  const order = ['1', '2', '3', '4', '5', '6-8'];
  const keys = Object.keys(grouped).sort((a, b) => order.indexOf(a) - order.indexOf(b));

  keys.forEach(key => {
    const section = document.createElement('section');
    section.className = 'bedroom-category-section';
    section.innerHTML = renderBedroomHeader(key) + `
      <div class="container">
        <div class="villa-grid-ref">
          ${grouped[key].map(renderVillaCardRef).join('')}
        </div>
      </div>
    `;
    villasGrid.appendChild(section);
  });

  if (list.length === 0) {
    villasGrid.innerHTML = '<div class="container text-center" style="padding:100px 0; opacity:0.5;"><h3>No properties match your criteria.</h3></div>';
  }

  initScrollReveal();
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

      // Inquiry Submission logic — direct to Supabase
      if (form.id === 'booking-form') {
        const payload = {
          propertyId: document.getElementById('property-select').value,
          checkIn: document.getElementById('check-in').value,
          checkOut: document.getElementById('check-out').value,
          firstName: document.getElementById('fname').value,
          lastName: document.getElementById('lname').value,
          email: document.getElementById('email').value,
          phone: document.getElementById('phone').value,
          guests: parseInt(document.getElementById('guests').value),
          message: document.getElementById('message').value
        };

        try {
          const { data, error } = await supabase.from('bookings').insert(payload);
          if (error) throw error;
          form.style.display = 'none';
          const success = document.querySelector('.form-success');
          if (success) success.classList.add('show');
        } catch (err) {
          console.error('Booking error:', err);
          alert('Error. Please contact us directly.');
        } finally {
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
