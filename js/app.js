// ==========================================================================
// THE SERENITY RIDGE - MULTILINGUAL ROOM SHOWCASE & CALL BOOKING
// Streamlined for high-clarity customer experience:
// 1. Photo & Title & Price
// 2. 4 Core Facilities (Beds, Attached Bath, Kitchen, AC)
// 3. One-tap Call Admin to Book
// ==========================================================================

let currentLang = "en";

document.addEventListener("DOMContentLoaded", () => {
  const config = window.HOTEL_CONFIG;
  if (!config) {
    console.error("HOTEL_CONFIG not found.");
    return;
  }

  // 1. Brand & Admin Links
  initBrandAndAdmin(config);

  // 2. Setup Language Picker
  setupLanguagePicker();

  // 3. Setup Filters
  setupFilters(config.rooms);

  // 4. Setup Modal
  setupModal(config);

  // 5. Check URL ?lang= parameter (great for QR codes), or restore saved language
  const urlParams = new URLSearchParams(window.location.search);
  const paramLang = urlParams.get("lang");
  const savedLang = paramLang || (() => {
    try {
      return localStorage.getItem("serenity_lang");
    } catch (e) {
      return null;
    }
  })() || config.defaultLang || "en";

  applyLanguage(savedLang);

  // 6. Deep link direct open modal support (e.g. ?open=single-room-1&photo=2)
  const openParam = urlParams.get("open");
  const photoParam = urlParams.get("photo");
  if (openParam) {
    setTimeout(() => {
      if (typeof window.openRoomModal === "function") {
        window.openRoomModal(openParam);
        if (photoParam !== null && typeof window.updateModalPhoto === "function") {
          window.updateModalPhoto(parseInt(photoParam, 10));
        }
      }
    }, 150);
  }
});

// --- Icons Helper (SVG) ---
const ICONS = {
  phone: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`,
  bed: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4v16"></path><path d="M2 8h18a2 2 0 0 1 2 2v10"></path><path d="M2 17h20"></path><path d="M6 8v9"></path></svg>`,
  bath: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6h6"></path><path d="M12 3v3"></path><path d="M4 11h16a2 2 0 0 1 2 2v3a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4v-3a2 2 0 0 1 2-2z"></path><line x1="7" y1="20" x2="7" y2="22"></line><line x1="17" y1="20" x2="17" y2="22"></line></svg>`,
  kitchen: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path></svg>`,
  ac: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="10" rx="2"></rect><line x1="6" y1="18" x2="6" y2="19"></line><line x1="10" y1="18" x2="10" y2="21"></line><line x1="14" y1="18" x2="14" y2="21"></line><line x1="18" y1="18" x2="18" y2="19"></line></svg>`,
  hall: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5"></path><path d="M2 11h20v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6z"></path><path d="M4 19v2"></path><path d="M20 19v2"></path></svg>`,
  parking: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"></rect><path d="M9 17V7h4a3 3 0 0 1 0 6H9"></path></svg>`,
  eye: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`
};

// --- Get translation text ---
function t(key) {
  const translations = window.TRANSLATIONS;
  if (!translations || !translations[currentLang]) return key;
  return translations[currentLang][key] || translations["en"][key] || key;
}

// --- Get localized room representation ---
function getLocalizedRoom(room) {
  if (currentLang !== "en" && room.translations && room.translations[currentLang]) {
    const tr = room.translations[currentLang];
    return {
      ...room,
      name: tr.name || room.name,
      categoryLabel: tr.categoryLabel || room.categoryLabel,
      badges: tr.badges || room.badges,
      specs: tr.specs || room.specs,
      hall: tr.hall !== undefined ? tr.hall : room.hall,
      hallShort: tr.hallShort || room.hallShort,
      beds: tr.beds !== undefined ? tr.beds : room.beds,
      bedsShort: tr.bedsShort || room.bedsShort || room.beds,
      bathroom: tr.bathroom !== undefined ? tr.bathroom : room.bathroom,
      bathroomShort: tr.bathroomShort || room.bathroomShort,
      kitchen: tr.kitchen !== undefined ? tr.kitchen : room.kitchen,
      kitchenShort: tr.kitchenShort || room.kitchenShort,
      ac: tr.ac !== undefined ? tr.ac : room.ac,
      acShort: tr.acShort || room.acShort,
      view: tr.view !== undefined ? tr.view : room.view
    };
  }
  return room;
}

// --- 1. Populate Brand & Admin Details ---
function initBrandAndAdmin(config) {
  document.querySelectorAll(".hotel-brand-name").forEach(el => el.textContent = config.name);

  // Admin Direct Dial Links (Call Owner Arasu Palani: +91 75984 30544)
  document.querySelectorAll(".admin-call-link").forEach(link => {
    link.href = `tel:${config.admin.phoneDial}`;
  });

  // Direct Map Driving Navigation
  const directNav = document.getElementById("directNavBtn");
  if (directNav && config.location && config.location.navDriveUrl) {
    directNav.href = config.location.navDriveUrl;
  }

  // Google Maps Location / Pin Links
  if (config.location && config.location.mapsUrl) {
    document.querySelectorAll(".map-link").forEach(link => {
      link.href = config.location.mapsUrl;
    });
  }

  const phoneInline = document.getElementById("heroPhoneInlineText");
  if (phoneInline) phoneInline.textContent = config.admin.phoneDisplay;
}

// --- 2. Render Rooms Catalog (Clean, Uncluttered Cards) ---
function renderRooms(rooms) {
  const container = document.getElementById("roomsGrid");
  if (!container) return;

  const config = window.HOTEL_CONFIG;

  container.innerHTML = rooms.map(rawRoom => {
    const room = getLocalizedRoom(rawRoom);

    return `
      <article class="room-card" data-category="${room.category}" data-id="${room.id}">
        <div class="room-card-image-wrap" onclick="openRoomModal('${room.id}')" style="cursor: pointer;">
          <img src="${room.image}" alt="${room.name}" class="room-card-img" loading="lazy" />

          <span class="room-photo-count-pill">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
            <span>${(room.gallery && room.gallery.length) || 1} ${t("photosCount")}</span>
          </span>

          <button class="quick-view-btn" onclick="event.stopPropagation(); openRoomModal('${room.id}')">
            ${ICONS.eye} <span>${t("viewDetails")}</span>
          </button>
        </div>

        <div class="room-card-content">
          <div class="room-card-header" onclick="openRoomModal('${room.id}')" style="cursor: pointer;">
            <span class="room-type-tag">${room.categoryLabel}</span>
            <h3 class="room-card-title">${room.name}</h3>
          </div>

          <!-- Essential Core Facilities Only -->
          <div class="card-features-bar">
            ${(() => {
              const chips = [];
              if (room.hall) {
                chips.push(`<div class="feature-chip" title="${t('hallTitle')}">${ICONS.hall}<span>${room.hallShort || room.hall}</span></div>`);
              }
              if (room.bedsShort || room.beds) {
                chips.push(`<div class="feature-chip" title="${t('bedConfig')}">${ICONS.bed}<span>${room.bedsShort || room.beds}</span></div>`);
              }
              if (room.bathroom) {
                chips.push(`<div class="feature-chip" title="${t('attachedBath')}">${ICONS.bath}<span>${room.bathroomShort || t('attachedBath')}</span></div>`);
              }
              if (room.kitchen) {
                chips.push(`<div class="feature-chip" title="${t('kitchenSetup')}">${ICONS.kitchen}<span>${room.kitchenShort || t('kitchenSetup')}</span></div>`);
              }
              if (room.ac) {
                chips.push(`<div class="feature-chip" title="${t('airConditioning')}">${ICONS.ac}<span>${room.acShort || t('splitAc')}</span></div>`);
              }
              if (room.view) {
                chips.push(`<div class="feature-chip" title="${t('parkingView')}">${ICONS.parking}<span>${room.view}</span></div>`);
              }
              return chips.join("");
            })()}
          </div>

          <div class="room-card-footer">
            <div class="room-pricing-wrap">
              <div class="room-pricing-top">
                <span class="room-price-amount">${room.priceLabel}</span>
                <span class="room-price-period">${t("perNight")}</span>
              </div>
              ${(room.priceAC && room.priceNonAC) ? `
                <div class="room-tariff-pill">
                  <span class="ac-tag">❄️ AC: <strong>${room.priceAC}</strong></span>
                  <span class="dot-sep">•</span>
                  <span class="nonac-tag">🌿 Non-AC: <strong>${room.priceNonAC}</strong></span>
                </div>
              ` : ''}
            </div>

            <div class="room-card-actions">
              <a href="tel:${config.admin.phoneDial}" class="btn-book-room" onclick="handleDirectCall(event, '${room.name}', '${config.admin.phoneDial}')">
                ${ICONS.phone} <span>${t("callToBook")}</span>
              </a>
              <button class="btn-details-room" onclick="openRoomModal('${room.id}')">
                <span>${t("viewDetails")}</span>
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

// --- 3. Filter Rooms ---
function setupFilters(rooms) {
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");
      const cards = document.querySelectorAll(".room-card");

      cards.forEach(card => {
        if (filter === "all" || card.getAttribute("data-category") === filter) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

// --- 4. Room Modal (Crystal-Clear: Essential Facilities & Direct Call) ---
// --- Modal Photo Gallery State ---
let currentModalGallery = [];
let currentModalIndex = 0;

window.updateModalPhoto = function(index) {
  if (!currentModalGallery || !currentModalGallery.length) return;
  if (index < 0 || index >= currentModalGallery.length) return;
  currentModalIndex = index;
  const photo = currentModalGallery[index];

  const modalImg = document.getElementById("modalRoomImg");
  const modalImgBlurBg = document.getElementById("modalImgBlurBg");
  const photoCounter = document.getElementById("modalPhotoCounter");
  const thumbs = document.querySelectorAll(".modal-thumb");

  if (modalImg) {
    modalImg.src = photo.src;
    modalImg.alt = photo.title || "Room Photo";
  }

  if (modalImgBlurBg) {
    modalImgBlurBg.style.backgroundImage = `url("${photo.src}")`;
  }

  if (photoCounter) {
    photoCounter.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg> <span>${index + 1} / ${currentModalGallery.length}${photo.title ? ' • ' + photo.title : ''}</span>`;
  }

  thumbs.forEach((th, idx) => {
    if (idx === index) {
      th.classList.add("active");
      try {
        th.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      } catch(e) {}
    } else {
      th.classList.remove("active");
    }
  });
};

window.stepModalPhoto = function(delta) {
  if (!currentModalGallery || currentModalGallery.length <= 1) return;
  const newIndex = (currentModalIndex + delta + currentModalGallery.length) % currentModalGallery.length;
  window.updateModalPhoto(newIndex);
};

// --- 4. Room Modal (Crystal-Clear: Essential Facilities & Direct Call) ---
window.openRoomModal = function(roomId) {
  const config = window.HOTEL_CONFIG;
  const rawRoom = config.rooms.find(r => r.id === roomId);
  if (!rawRoom) return;

  const room = getLocalizedRoom(rawRoom);

  const modal = document.getElementById("roomModal");
  const modalImg = document.getElementById("modalRoomImg");
  const modalTitle = document.getElementById("modalRoomTitle");
  const modalSubtitle = document.getElementById("modalRoomSubtitle");
  const modalCategory = document.getElementById("modalRoomCategory");
  const modalPrice = document.getElementById("modalRoomPrice");
  const modalKeyFeatures = document.getElementById("modalKeyFeatures");
  const modalCallBtn = document.getElementById("modalCallBtn");
  const modalCallBtnText = document.getElementById("modalCallBtnText");
  const modalThumbnails = document.getElementById("modalThumbnails");
  const prevBtn = document.getElementById("modalNavPrev");
  const nextBtn = document.getElementById("modalNavNext");

  if (modalTitle) {
    modalTitle.textContent = room.name;
  }
  if (modalCategory) {
    modalCategory.textContent = room.categoryLabel || room.category;
  }

  if (room.priceAC && room.priceNonAC) {
    modalPrice.innerHTML = `
      <div class="modal-pricing-dual">
        <span class="modal-tier-ac">❄️ AC: <strong>${room.priceAC}</strong></span>
        <span class="modal-tier-divider">•</span>
        <span class="modal-tier-nonac">🌿 Non-AC: <strong>${room.priceNonAC}</strong></span>
      </div>
    `;
  } else {
    modalPrice.textContent = room.priceLabel;
  }

  // Clean glanceable specs (Guests • Area • View)
  if (modalSubtitle) {
    modalSubtitle.textContent = room.specs;
  }

  // Setup Gallery
  currentModalGallery = (room.gallery && room.gallery.length) ? room.gallery : [{ src: room.image, title: room.name }];
  currentModalIndex = 0;

  if (modalThumbnails) {
    if (currentModalGallery.length > 1) {
      modalThumbnails.style.display = "flex";
      modalThumbnails.innerHTML = currentModalGallery.map((photo, idx) => `
        <button class="modal-thumb ${idx === 0 ? 'active' : ''}" onclick="updateModalPhoto(${idx})" aria-label="${photo.title || ('Photo ' + (idx + 1))}">
          <img src="${photo.src}" alt="${photo.title || ''}" loading="lazy" />
        </button>
      `).join("");
    } else {
      modalThumbnails.style.display = "none";
      modalThumbnails.innerHTML = "";
    }
  }

  if (prevBtn && nextBtn) {
    prevBtn.style.display = currentModalGallery.length > 1 ? "flex" : "none";
    nextBtn.style.display = currentModalGallery.length > 1 ? "flex" : "none";
  }

  window.updateModalPhoto(0);

  // Render dynamic facility cards matching the room
  const modalCards = [];
  if (room.hall) {
    modalCards.push(`
      <div class="facility-card">
        <div class="facility-icon">${ICONS.hall}</div>
        <div class="facility-info">
          <span class="facility-label">${t("hallTitle")}</span>
          <strong class="facility-val">${room.hall}</strong>
        </div>
      </div>
    `);
  }
  if (room.beds) {
    modalCards.push(`
      <div class="facility-card">
        <div class="facility-icon">${ICONS.bed}</div>
        <div class="facility-info">
          <span class="facility-label">${t("bedConfig")}</span>
          <strong class="facility-val">${room.beds}</strong>
        </div>
      </div>
    `);
  }
  if (room.bathroom) {
    modalCards.push(`
      <div class="facility-card">
        <div class="facility-icon">${ICONS.bath}</div>
        <div class="facility-info">
          <span class="facility-label">${t("attachedBath")}</span>
          <strong class="facility-val">${room.bathroom}</strong>
        </div>
      </div>
    `);
  }
  if (room.kitchen) {
    modalCards.push(`
      <div class="facility-card">
        <div class="facility-icon">${ICONS.kitchen}</div>
        <div class="facility-info">
          <span class="facility-label">${t("kitchenSetup")}</span>
          <strong class="facility-val">${room.kitchen}</strong>
        </div>
      </div>
    `);
  }
  if (room.ac) {
    modalCards.push(`
      <div class="facility-card">
        <div class="facility-icon">${ICONS.ac}</div>
        <div class="facility-info">
          <span class="facility-label">${t("airConditioning")}</span>
          <strong class="facility-val">${room.ac}</strong>
        </div>
      </div>
    `);
  }
  if (room.view) {
    modalCards.push(`
      <div class="facility-card">
        <div class="facility-icon">${ICONS.parking}</div>
        <div class="facility-info">
          <span class="facility-label">${t("parkingView")}</span>
          <strong class="facility-val">${room.view}</strong>
        </div>
      </div>
    `);
  }
  modalKeyFeatures.innerHTML = modalCards.join("");

  // Update Call CTA with phone number directly visible
  modalCallBtn.href = `tel:${config.admin.phoneDial}`;
  modalCallBtn.onclick = (e) => handleDirectCall(e, room.name, config.admin.phoneDial);
  if (modalCallBtnText) {
    modalCallBtnText.textContent = `${t("callToBook")}: ${config.admin.phoneDisplay}`;
  }

  // Show modal
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
};

window.closeRoomModal = function() {
  const modal = document.getElementById("roomModal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
  currentModalGallery = [];
};

function setupModal(config) {
  const modal = document.getElementById("roomModal");
  if (!modal) return;

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      window.closeRoomModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("active")) return;
    if (e.key === "Escape") {
      window.closeRoomModal();
    } else if (e.key === "ArrowLeft") {
      window.stepModalPhoto(-1);
    } else if (e.key === "ArrowRight") {
      window.stepModalPhoto(1);
    }
  });
}

// --- 5. Language Picker ---
function setupLanguagePicker() {
  const picker = document.getElementById("langPicker");
  const toggle = document.getElementById("langToggle");
  const dropdown = document.getElementById("langDropdown");

  if (!picker || !toggle || !dropdown) return;

  // Toggle dropdown
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    picker.classList.toggle("open");
  });

  // Select language
  dropdown.querySelectorAll(".lang-option").forEach(opt => {
    opt.addEventListener("click", (e) => {
      e.stopPropagation();
      const lang = opt.getAttribute("data-lang");
      applyLanguage(lang);
      picker.classList.remove("open");
    });
  });

  // Close dropdown on outside click
  document.addEventListener("click", () => {
    picker.classList.remove("open");
  });
}

// --- 6. Apply Language ---
function applyLanguage(lang) {
  const translations = window.TRANSLATIONS;
  if (!translations || !translations[lang]) return;

  currentLang = lang;
  const strings = translations[lang];

  // Set document language attributes for CSS typography engine
  document.documentElement.lang = lang;
  document.documentElement.setAttribute("data-lang", lang);

  // Persist user's choice
  try {
    localStorage.setItem("serenity_lang", lang);
  } catch (e) {}

  // Update current label in toggle button
  const currentLabel = document.getElementById("langCurrentLabel");
  if (currentLabel) {
    currentLabel.textContent = strings.langCode;
  }

  // Mark active option in dropdown
  document.querySelectorAll(".lang-option").forEach(opt => {
    opt.classList.toggle("active", opt.getAttribute("data-lang") === lang);
  });

  // Update all data-i18n static text elements
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (strings[key]) {
      el.textContent = strings[key];
    }
  });

  // Re-render rooms with localized names & tags
  const config = window.HOTEL_CONFIG;
  if (config) {
    renderRooms(config.rooms);
  }
}

// --- Direct Dial Helper ---
window.handleDirectCall = function(event, roomName, phoneDial) {
  // Direct call through tel: protocol — no extra logic needed
}

