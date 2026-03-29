/* =============================================
   TRINI CARNIVAL RENTALS — Property Data
   ============================================= */

const PROPERTIES = [
  {
    id: 'carnival-heights-villa',
    name: 'Carnival Heights Villa',
    tagline: 'Elevated luxury with panoramic views',
    location: 'St. Ann\'s, Port of Spain',
    bedrooms: 4,
    bathrooms: 3,
    capacity: 8,
    pricePerNight: 350,
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80',
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=600&q=80'
    ],
    description: 'Perched in the hills of prestigious St. Ann\'s, Carnival Heights Villa offers breathtaking panoramic views of Port of Spain and the Gulf of Paria. This spacious four-bedroom retreat features an open-plan living area that flows onto a wraparound terrace — perfect for watching the city come alive during Carnival season.',
    descriptionLong: 'Enjoy modern comforts including a fully equipped gourmet kitchen, high-speed WiFi, and a private plunge pool surrounded by lush tropical gardens. Located minutes from the Queen\'s Park Savannah and all major Carnival fête venues, this villa is ideal for groups seeking both celebration and relaxation.',
    amenities: ['Private Pool', 'WiFi', 'Air Conditioning', 'Full Kitchen', 'Parking', 'Washing Machine', 'Smart TV', 'Security System', 'Terrace', 'BBQ Grill', 'Generator Backup', 'Daily Housekeeping']
  },
  {
    id: 'savannah-suite',
    name: 'The Savannah Suite',
    tagline: 'Steps from the heart of Carnival',
    location: 'Queen\'s Park, Port of Spain',
    bedrooms: 2,
    bathrooms: 2,
    capacity: 4,
    pricePerNight: 220,
    badge: 'Central',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=600&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80'
    ],
    description: 'Located directly on the Queen\'s Park Savannah, this elegant two-bedroom suite puts you at the epicenter of Trinidad Carnival. Watch the Parade of Bands from your private balcony and walk to Dimanche Gras, Panorama, and all the action.',
    descriptionLong: 'The suite features high-end finishes throughout, with marble countertops, designer furnishings, and floor-to-ceiling windows that flood the space with natural light. Both bedrooms are en-suite with premium linens and blackout curtains — essential for recovering between fêtes.',
    amenities: ['WiFi', 'Air Conditioning', 'Full Kitchen', 'Parking', 'Smart TV', 'Balcony', 'Washer/Dryer', 'Iron & Board', 'Concierge Service', 'Security']
  },
  {
    id: 'maraval-retreat',
    name: 'Maraval Garden Retreat',
    tagline: 'Tropical tranquility with easy access',
    location: 'Maraval, Port of Spain',
    bedrooms: 3,
    bathrooms: 2,
    capacity: 6,
    pricePerNight: 280,
    badge: 'Quiet Escape',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80',
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=600&q=80'
    ],
    description: 'Nestled in a quiet pocket of Maraval, this three-bedroom retreat is the perfect blend of tranquility and accessibility. Just a 10-minute drive from the Savannah, you can escape the Carnival buzz whenever you need to recharge.',
    descriptionLong: 'The property sits within a beautifully landscaped garden with mature tropical trees, offering a cool, shaded oasis. The open-plan kitchen is chef-friendly, and there\'s a spacious entertainment area that\'s ideal for hosting your own lime.',
    amenities: ['Private Garden', 'WiFi', 'Air Conditioning', 'Full Kitchen', 'Parking', 'Washing Machine', 'Smart TV', 'BBQ Grill', 'Security', 'Outdoor Dining']
  },
  {
    id: 'port-of-spain-penthouse',
    name: 'Waterfront Penthouse',
    tagline: 'Skyline views & modern luxury',
    location: 'Wrightson Road, Port of Spain',
    bedrooms: 3,
    bathrooms: 3,
    capacity: 6,
    pricePerNight: 420,
    badge: 'Premium',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80'
    ],
    description: 'This stunning top-floor penthouse overlooks the Port of Spain waterfront and the Gulf of Paria. Floor-to-ceiling glass walls offer uninterrupted views from every room, and the rooftop terrace is the ultimate vantage point for Carnival fireworks.',
    descriptionLong: 'Featuring three luxurious en-suite bedrooms, a state-of-the-art kitchen with premium appliances, and a separate entertainment lounge with surround sound, this penthouse defines modern Caribbean luxury. Building amenities include 24-hour security, a fitness center, and underground parking.',
    amenities: ['Rooftop Terrace', 'WiFi', 'Air Conditioning', 'Full Kitchen', 'Parking', 'Gym Access', 'Smart TV', 'Surround Sound', 'Concierge', 'Security', 'Elevator', 'Generator']
  },
  {
    id: 'cascade-cottage',
    name: 'Cascade Cottage',
    tagline: 'Charming hideaway in the valley',
    location: 'Cascade, Port of Spain',
    bedrooms: 2,
    bathrooms: 1,
    capacity: 4,
    pricePerNight: 175,
    badge: 'Value Pick',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80',
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80'
    ],
    description: 'A charming two-bedroom cottage tucked away in the leafy Cascade valley. This cozy retreat offers excellent value without compromising on comfort or location — the Savannah is just a quick maxi taxi ride away.',
    descriptionLong: 'The cottage features warm wooden interiors, a private veranda with hammock, and a fully equipped kitchenette. The neighbourhood is friendly and safe, with local restaurants and doubles vendors within walking distance. Perfect for couples or a small group of friends.',
    amenities: ['WiFi', 'Air Conditioning', 'Kitchenette', 'Parking', 'Smart TV', 'Veranda', 'Hammock', 'Security', 'Ceiling Fans', 'Outdoor Seating']
  },
  {
    id: 'westmoorings-estate',
    name: 'Westmoorings Estate',
    tagline: 'Prestigious family compound',
    location: 'Westmoorings, Diego Martin',
    bedrooms: 5,
    bathrooms: 4,
    capacity: 12,
    pricePerNight: 550,
    badge: 'Exclusive',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80',
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=600&q=80'
    ],
    description: 'This expansive five-bedroom estate in exclusive Westmoorings is the ultimate group accommodation for Carnival. With a large private pool, entertainment pavilion, and manicured grounds, it\'s designed for those who like to host and celebrate in grand style.',
    descriptionLong: 'The property features a master suite with walk-in closet and jacuzzi, four additional bedrooms, a professional-grade kitchen, and a separate staff quarters. Located in one of Trinidad\'s most prestigious neighbourhoods with easy highway access to Port of Spain.',
    amenities: ['Private Pool', 'WiFi', 'Air Conditioning', 'Full Kitchen', 'Parking for 4', 'Washing Machine', 'Smart TV', 'Security System', 'Entertainment Pavilion', 'BBQ Area', 'Generator', 'Staff Quarters', 'Jacuzzi', 'Garden']
  }
];

// SVG Icons
const ICONS = {
  bed: '<svg viewBox="0 0 24 24"><path d="M3 7v11m0-4h18m0 4V8a1 1 0 0 0-1-1H10a1 1 0 0 0-1 1v4"/><rect x="3" y="7" width="4" height="4" rx="1"/></svg>',
  bath: '<svg viewBox="0 0 24 24"><path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1zM6 12V5a2 2 0 0 1 2-2h3v2H8v7"/></svg>',
  guests: '<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  location: '<svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>',
  chevron: '<svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>',
  mail: '<svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4l-10 8L2 4"/></svg>',
  phone: '<svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>',
  wifi: '<svg viewBox="0 0 24 24"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/></svg>',
  ac: '<svg viewBox="0 0 24 24"><path d="M12 2v10m0 0l3.5-3.5M12 12l-3.5-3.5M12 12l3.5 3.5M12 12l-3.5 3.5"/><path d="M20 12h-2m-12 0H4"/><path d="M18.364 5.636l-1.414 1.414M7.05 16.95l-1.414 1.414"/><path d="M18.364 18.364l-1.414-1.414M7.05 7.05L5.636 5.636"/></svg>',
  pool: '<svg viewBox="0 0 24 24"><path d="M2 20c1.5 0 2.5-1 4-1s2.5 1 4 1 2.5-1 4-1 2.5 1 4 1 2.5-1 4-1"/><path d="M2 17c1.5 0 2.5-1 4-1s2.5 1 4 1 2.5-1 4-1 2.5 1 4 1 2.5-1 4-1"/><path d="M6 12V4h2v8"/><path d="M10 12V4h6v8"/></svg>',
  kitchen: '<svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20"/><circle cx="7" cy="7" r="1"/><circle cx="12" cy="7" r="1"/></svg>',
  parking: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>',
  tv: '<svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
  security: '<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  default: '<svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>'
};

function getAmenityIcon(amenity) {
  const key = amenity.toLowerCase();
  if (key.includes('pool') || key.includes('jacuzzi')) return ICONS.pool;
  if (key.includes('wifi')) return ICONS.wifi;
  if (key.includes('air') || key.includes('fan')) return ICONS.ac;
  if (key.includes('kitchen')) return ICONS.kitchen;
  if (key.includes('parking')) return ICONS.parking;
  if (key.includes('tv') || key.includes('sound')) return ICONS.tv;
  if (key.includes('security') || key.includes('generator')) return ICONS.security;
  if (key.includes('phone') || key.includes('whatsapp')) return ICONS.phone;
  return ICONS.default;
}

// Render a single property card
function renderPropertyCard(property) {
  return `
    <a href="property.html?id=${property.id}" class="property-card fade-in" id="card-${property.id}">
      <div class="property-card-img">
        <img src="${property.image}" alt="${property.name}" loading="lazy">
        <span class="property-card-badge">${property.badge}</span>
      </div>
      <div class="property-card-body">
        <h3>${property.name}</h3>
        <div class="location">
          ${ICONS.location}
          ${property.location}
        </div>
        <div class="property-meta">
          <div class="property-meta-item">${ICONS.bed}<span>${property.bedrooms} Bed${property.bedrooms > 1 ? 's' : ''}</span></div>
          <div class="property-meta-item">${ICONS.bath}<span>${property.bathrooms} Bath${property.bathrooms > 1 ? 's' : ''}</span></div>
          <div class="property-meta-item">${ICONS.guests}<span>${property.capacity} Guests</span></div>
        </div>
        <div class="property-card-footer">
          <div class="property-price">$${property.pricePerNight} <span>USD / night</span></div>
          <span class="property-card-link">View Details →</span>
        </div>
      </div>
    </a>
  `;
}

// Render all cards into a grid container
function renderPropertiesGrid(containerId, properties) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = properties.map(renderPropertyCard).join('');
}

// Get property by ID (from URL param)
function getPropertyById(id) {
  return PROPERTIES.find(p => p.id === id);
}
