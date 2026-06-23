// Abhay Pharma - Core Application Logic & State Controller

// ====================================================
// 1. APPLICATION STATE
// ====================================================
let state = {
  products: [...PRODUCTS], // loaded from products.js
  cart: [],
  wishlist: [],
  orders: [
    {
      id: "AC-49821",
      date: "2026-06-12",
      items: [
        { product: PRODUCTS[0], quantity: 2 }, // Dolo 650
        { product: PRODUCTS[22], quantity: 1 }  // Salmon Omega-3
      ],
      subtotal: 969.00,
      discount: 100.00,
      delivery: 0.00,
      tax: 156.42,
      total: 1025.42,
      address: {
        fullname: "John Smith",
        phone: "+1 (555) 982-1234",
        street: "455 Park Avenue, Apt 4B",
        city: "New York",
        state: "NY",
        zip: "10022"
      },
      paymentMethod: "Credit Card",
      prescriptionUrl: null,
      status: "Delivered",
      trackingStep: 4 // 1: Pending, 2: Under Verification, 3: Shipped, 4: Delivered
    },
    {
      id: "AC-50124",
      date: "2026-06-18",
      items: [
        { product: PRODUCTS[14], quantity: 1 } // Accu-Chek
      ],
      subtotal: 999.00,
      discount: 330.00,
      delivery: 40.00,
      tax: 120.42,
      total: 829.42,
      address: {
        fullname: "John Smith",
        phone: "+1 (555) 982-1234",
        street: "455 Park Avenue, Apt 4B",
        city: "New York",
        state: "NY",
        zip: "10022"
      },
      paymentMethod: "UPI",
      prescriptionUrl: null,
      status: "Shipped",
      trackingStep: 3
    }
  ],
  userProfile: {
    firstname: "John",
    lastname: "Smith",
    email: "john.smith@gmail.com",
    phone: "+1 (555) 982-1234",
    addresses: [
      {
        id: "addr-1",
        fullname: "John Smith",
        phone: "+1 (555) 982-1234",
        street: "455 Park Avenue, Apt 4B",
        city: "New York",
        state: "NY",
        zip: "10022",
        isDefault: true
      },
      {
        id: "addr-2",
        fullname: "Smith Office",
        phone: "+1 (555) 234-5678",
        street: "120 Broadway, Floor 28",
        city: "New York",
        state: "NY",
        zip: "10271",
        isDefault: false
      }
    ]
  },
  prescriptions: [
    {
      id: "rx-9812",
      date: "2026-06-12",
      fileName: "dr_kaufman_rx.pdf",
      orderId: "AC-49821",
      status: "Approved"
    }
  ],
  notifications: [
    {
      id: "notif-1",
      date: "2026-06-12",
      title: "Prescription Approved",
      message: "Your prescription for Dolo 650 in Order AC-49821 has been verified and approved by Dr. Clara Vance (Licensed Pharmacist).",
      read: true
    },
    {
      id: "notif-2",
      date: "2026-06-18",
      title: "Order Shipped",
      message: "Order AC-50124 has been handed over to our express rider. Track delivery in your dashboard.",
      read: false
    }
  ],
  activeCoupon: null,
  comparisonList: [],
  recentlyViewed: [],
  activeView: "home-view",
  selectedProduct: null, // product details page state
  selectedCheckoutAddress: "addr-1",
  uploadedRxFiles: [],
  activeDbTab: "db-orders",
  activeAdminPane: "admin-analytics",
  locatorMap: null,
  locatorMarkers: [],
  theme: "light",
  adminSession: null // { email, role } — set on successful admin login
};

// Available Coupons
const COUPONS = {
  "HEALTH20": { discountPercent: 20, description: "Flat 20% Off on your order" },
  "FREESHIP": { freeShipping: true, description: "Free delivery on any order value" }
};

// ====================================================
// ADMIN AUTHORIZED USERS (Email + Password)
// ====================================================
const ADMIN_USERS = [
  { email: "admin@abhaypharma.com",       password: "Admin@1234",  role: "Super Admin",  name: "Abhay Sharma" },
  { email: "pharmacist@abhaypharma.com",  password: "Pharma@2024", role: "Pharmacist",   name: "Dr. Clara Vance" }
];

// Mock Nearby Stores
const STORES = [
  { id: 1, name: "Abhay Pharma - Bandikui Main Hub", lat: 27.0409, lng: 76.7118, address: "2HVF+WH9, Bandikui Rd, Motuka, Bandikui, Rajasthan 303313", phone: "+91 9414211060", hours: "Open 24 Hours" },
  { id: 2, name: "Abhay Pharma - Jaipur Clinic", lat: 26.9124, lng: 75.7873, address: "MI Road, Jaipur, Rajasthan 302001", phone: "+91 9414211060", hours: "08:00 AM - 10:00 PM" },
  { id: 3, name: "Abhay Pharma - Dausa Pharmacy", lat: 26.8929, lng: 76.3353, address: "Agra Road, Dausa, Rajasthan 303303", phone: "+91 9414211060", hours: "07:00 AM - Midnight" },
  { id: 4, name: "Abhay Pharma - Alwar Center", lat: 27.5530, lng: 76.6089, address: "Manu Marg, Alwar, Rajasthan 301001", phone: "+91 9414211060", hours: "09:00 AM - 09:00 PM" }
];

// Mock Informational Pages Content
const INFO_PAGES_CONTENT = {
  "about-us": `
    <h2>About Abhay Pharma</h2>
    <p>Abhay Pharma is a premium healthcare platform built to modernize medical purchasing. We believe that accessing genuine, life-saving therapeutics and health supplements should be simple, transparent, and incredibly fast.</p>
    <h3>Our Mission</h3>
    <p>Our goal is to combine clinical authenticity with state-of-the-art logistics to deliver verified medical supplies straight to your doorstep in record times. We bypass complex supply chains to ensure all pharmaceuticals remain temperature-controlled and authenticated directly from verified laboratories.</p>
    <h3>Why Choose Us?</h3>
    <ul>
      <li><strong>100% Genuine Inventory:</strong> Every tablet, device, and supplement is sourced directly from approved global manufacturing centers.</li>
      <li><strong>Express Delivery:</strong> Powered by localized fulfillment hubs and cooling lockers, we deliver temperature-sensitive products in under 2 hours.</li>
      <li><strong>Accredited Care:</strong> Under supervision of licensed healthcare practitioners, ensuring medical adherence and safety compliance.</li>
    </ul>
  `,
  "pharmacists": `
    <h2>Licensed Pharmacists</h2>
    <p>At Abhay Pharma, patient safety is our highest priority. Every order containing prescription therapeutics goes through rigorous verification by our accredited panel of clinical pharmacists.</p>
    <h3>Our Professional Panel</h3>
    <p>All Abhay Pharma pharmacists hold recognized clinical degrees and licensing certifications. They verify submitted prescription documentation, check for cross-medication contraindications, and provide dosage recommendations to ensure therapeutic compliance.</p>
    <h3>Expert Consultation</h3>
    <p>If you have any questions about correct dosage, side effects, or drug interactions, you can connect directly with our active clinical team via our integrated AI Assistant or live chat widget at any time.</p>
  `,
  "hubs": `
    <h2>Fulfillment Hubs & Cold-Chain Logistics</h2>
    <p>Abhay Pharma operates a network of localized, highly advanced fulfillment centers across major urban centers. Each hub is designed to store medications in optimal clinical conditions.</p>
    <h3>Temperature-Controlled Storage</h3>
    <p>Therapeutics (such as insulin, vaccines, and eye drops) require strict temperature control. Our fulfillment hubs utilize state-of-the-art refrigeration systems to monitor humidity and temperature levels 24/7.</p>
    <h3>Cold-Chain Transportation</h3>
    <p>Our express delivery riders are equipped with custom climate-controlled thermal bags. This ensures that the clinical efficacy of your medications is preserved from our hub straight to your doorstep.</p>
  `,
  "careers": `
    <h2>Careers at Abhay Pharma</h2>
    <p>Join the future of healthcare technology. We are looking for talented, passionate individuals to help us build the next generation of online pharmacy logistics and digital clinical care.</p>
    <h3>Current Openings</h3>
    <ul>
      <li><strong>Clinical Pharmacist:</strong> Verify prescriptions, manage customer adherence, and provide counseling. (Full-Time, Rajasthan)</li>
      <li><strong>Hub Operations Manager:</strong> Supervise cold-chain logistics, inventory levels, and dispatch efficiency. (Full-Time, Bandikui Hub)</li>
      <li><strong>Frontend UI Engineer:</strong> Build stunning, responsive, and interactive e-commerce components. (Full-Time/Remote)</li>
      <li><strong>Rider Delivery Executive:</strong> Deliver packages safely to patients within our express delivery windows. (Part-Time, Bandikui Areas)</li>
    </ul>
    <p>To apply, please send your resume and cover letter to <a href="mailto:abhaysv@gmail.com" style="color:var(--primary); font-weight:700;">abhaysv@gmail.com</a>.</p>
  `,
  "privacy": `
    <h2>Privacy & HIPAA Policy</h2>
    <p>We understand that medical records and prescriptions represent highly sensitive information. Abhay Pharma conforms to rigorous national security protocols and HIPAA standards to guarantee your data stays completely private.</p>
    <h3>Data Protection Protocols</h3>
    <ul>
      <li><strong>End-to-End Encryption:</strong> All prescriptions, orders, and diagnostic files are encrypted during upload and stored in secure, access-controlled data vaults.</li>
      <li><strong>Non-Disclosure:</strong> We never share or sell patient demographic, financial, or medical details to third-party advertisers or data brokers.</li>
      <li><strong>User Rights:</strong> You can request a copy of your records, edit your profile details, or purge your account history from our database at any time.</li>
    </ul>
  `,
  "refunds": `
    <h2>Refund & Returns Policy</h2>
    <p>We want you to be completely satisfied with your purchase. We offer hassle-free returns on qualifying products within 15 days of order delivery.</p>
    <h3>Non-Returnable Items</h3>
    <p>In accordance with global pharmacy safety regulations, **opened OTC medications and all prescription-only pharmaceuticals cannot be returned** once they leave our possession. This prevents potential contamination and ensures chemical efficacy for all patients.</p>
    <h3>Qualifying Returns</h3>
    <p>Unopened OTC remedies, daily vitamins, baby care items, and clinical medical devices in their original packaging can be returned easily. To initiate a return, contact our support team at <a href="mailto:abhaysv@gmail.com" style="color:var(--primary); font-weight:700;">abhaysv@gmail.com</a>.</p>
  `,
  "terms": `
    <h2>Terms of Service</h2>
    <p>Welcome to Abhay Pharma. By utilizing our website, e-commerce platform, and services, you agree to comply with our user agreement terms.</p>
    <h3>Prescription Responsibility</h3>
    <p>It is the user's responsibility to submit authentic, current, and legally valid prescription documents from registered clinical practitioners. Abhay Pharma reserves the right to reject order placement or report fraudulent activity if fake documents are uploaded.</p>
    <h3>Platform Usage</h3>
    <p>All clinical content, descriptions, composition listings, and product details provided on Abhay Pharma are for informational purposes only. They do not constitute professional medical advice, diagnosis, or treatment. Always consult a physician before starting any medication program.</p>
  `,
  "guidelines": `
    <h2>Prescription Upload Guidelines</h2>
    <p>To comply with healthcare regulations, we require valid medical documentation for prescription-restricted items in your cart. Check your document to make sure it includes the following required elements before uploading:</p>
    <h3>Required Document Details</h3>
    <ul>
      <li><strong>Doctor's Metadata:</strong> Practitioner's full name, registration number, signature, and clinic stamp.</li>
      <li><strong>Patient Details:</strong> Full name and age of the patient matching the order profile.</li>
      <li><strong>Prescription Date:</strong> Must be dated within the last 6 months to ensure current clinical validity.</li>
      <li><strong>Medication Specifications:</strong> Clear drug names, dosage strengths, and usage duration.</li>
    </ul>
    <p>We accept high-resolution files in JPG, PNG, or PDF formats up to 5MB. Files must be readable, clear, and uncropped.</p>
  `,
  "faqs": `
    <h2>Frequently Asked Questions</h2>
    <p>Have questions about Abhay Pharma? Find fast answers below to our most commonly asked queries. Click on any question to expand the answer.</p>
    <div class="faq-accordion">
      <div class="faq-item">
        <div class="faq-question">Do you deliver medications at night? <i data-lucide="chevron-down"></i></div>
        <div class="faq-answer">Yes! Abhay Pharma Bandikui Main Hub operates 24/7. Express deliveries are fulfilled between 08:00 AM and Midnight, and emergency orders are dispatched all night across select local areas in Rajasthan.</div>
      </div>
      <div class="faq-item">
        <div class="faq-question">How does prescription verification work? <i data-lucide="chevron-down"></i></div>
        <div class="faq-answer">When you upload an Rx image, it is routed to our licensed clinical queue. A pharmacist reviews the doctor's details and medicine specs. Once approved (usually within 10-15 minutes), your order is dispatched. If rejected, you'll receive a detailed email explanation and order refund.</div>
      </div>
      <div class="faq-item">
        <div class="faq-question">Can I cancel my order? <i data-lucide="chevron-down"></i></div>
        <div class="faq-answer">Yes, orders can be cancelled directly from your user dashboard at any time before they enter the "Shipped" status. Once handed over to our express rider, the package cannot be cancelled.</div>
      </div>
      <div class="faq-item">
        <div class="faq-question">Is delivery free? <i data-lucide="chevron-down"></i></div>
        <div class="faq-answer">We offer free home delivery on all orders above ₹1000.00. For orders under ₹1000.00, a flat ₹100.00 delivery fee is applied. You can also apply promo codes (like FREESHIP) for zero shipping costs.</div>
      </div>
      <div class="faq-item">
        <div class="faq-question">Where are your stores located? <i data-lucide="chevron-down"></i></div>
        <div class="faq-answer">We have multiple hubs in Rajasthan, including Bandikui, Jaipur, Dausa, and Alwar. You can open our Store Locator from the top header or footer to view an interactive map and find contact details.</div>
      </div>
    </div>
  `
};

// ====================================================
// 2. BOOTSTRAP INITIALIZATION
// ====================================================
document.addEventListener("DOMContentLoaded", () => {
  // Load State from LocalStorage
  loadLocalStorage();

  // Initialize Lucide Icons
  lucide.createIcons();

  // Event Listeners
  bindEvents();

  // Populate Dynamic Elements
  populateCategoryDropdown();

  // Hash-based routing: support /#admin to go directly to admin login
  const hash = window.location.hash.toLowerCase();
  if (hash === "#admin") {
    showAdminLoginPage();
  } else {
    navigate("home-view");
  }
});

// ====================================================
// 3. PERSISTENCE LAYER (LOCALSTORAGE)
// ====================================================
function saveLocalStorage() {
  localStorage.setItem("abhay_cart", JSON.stringify(state.cart));
  localStorage.setItem("abhay_wishlist", JSON.stringify(state.wishlist));
  localStorage.setItem("abhay_orders", JSON.stringify(state.orders));
  localStorage.setItem("abhay_prescriptions", JSON.stringify(state.prescriptions));
  localStorage.setItem("abhay_profile", JSON.stringify(state.userProfile));
  localStorage.setItem("abhay_notifications", JSON.stringify(state.notifications));
  localStorage.setItem("abhay_theme", state.theme);
  localStorage.setItem("abhay_products", JSON.stringify(state.products));
}

function loadLocalStorage() {
  if (localStorage.getItem("abhay_cart")) state.cart = JSON.parse(localStorage.getItem("abhay_cart"));
  if (localStorage.getItem("abhay_wishlist")) state.wishlist = JSON.parse(localStorage.getItem("abhay_wishlist"));
  if (localStorage.getItem("abhay_orders")) state.orders = JSON.parse(localStorage.getItem("abhay_orders"));
  if (localStorage.getItem("abhay_prescriptions")) state.prescriptions = JSON.parse(localStorage.getItem("abhay_prescriptions"));
  if (localStorage.getItem("abhay_profile")) state.userProfile = JSON.parse(localStorage.getItem("abhay_profile"));
  if (localStorage.getItem("abhay_notifications")) state.notifications = JSON.parse(localStorage.getItem("abhay_notifications"));
  if (localStorage.getItem("abhay_theme")) state.theme = localStorage.getItem("abhay_theme");
  if (localStorage.getItem("abhay_products")) state.products = JSON.parse(localStorage.getItem("abhay_products"));

  // Apply Theme
  document.documentElement.setAttribute("data-theme", state.theme);
  toggleThemeIconUI();
  updateHeaderCounters();
}

// ====================================================
// 4. ROUTER AND NAVIGATION
// ====================================================
function navigate(viewId, param = null) {
  // Gate admin panel behind authentication
  if (viewId === "admin-view") {
    if (!state.adminSession) {
      // Not logged in — show admin login page instead
      showAdminLoginPage();
      return;
    }
  }

  // Update view state
  state.activeView = viewId;

  // Show/hide header and footer based on view
  const header = document.querySelector("header");
  const footer = document.querySelector("footer");
  if (viewId === "admin-login-view") {
    if (header) header.style.display = "none";
    if (footer) footer.style.display = "none";
  } else {
    if (header) header.style.display = "";
    if (footer) footer.style.display = "";
  }

  // Toggle visible sections
  document.querySelectorAll(".page-view").forEach(view => {
    if (view.id === viewId) {
      view.classList.remove("hidden");
    } else {
      view.classList.add("hidden");
    }
  });

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Execute view-specific load logic
  if (viewId === "home-view") {
    renderHome();
  } else if (viewId === "shop-view") {
    renderShop(param); // param might be a category filter string
  } else if (viewId === "details-view") {
    if (param) {
      const product = state.products.find(p => p.id === param);
      if (product) {
        state.selectedProduct = product;
        addToRecentlyViewed(product.id);
        renderProductDetails(product);
      }
    }
  } else if (viewId === "cart-view") {
    renderCart();
  } else if (viewId === "checkout-view") {
    renderCheckout();
  } else if (viewId === "dashboard-view") {
    renderDashboard(state.activeDbTab);
  } else if (viewId === "admin-view") {
    updateAdminHeaderBadge();
    renderAdmin(state.activeAdminPane);
  } else if (viewId === "info-view") {
    renderInfoView(param);
  }

  // Refresh icons
  lucide.createIcons();
}

// ====================================================
// 5. EVENT BINDING MANAGER
// ====================================================
function bindEvents() {
  // Navigation Links
  document.getElementById("header-logo-btn").addEventListener("click", (e) => { e.preventDefault(); navigate("home-view"); });
  document.getElementById("home-view-all-products-btn").addEventListener("click", () => navigate("shop-view"));
  document.getElementById("hero-shop-now-btn").addEventListener("click", () => navigate("shop-view"));
  document.getElementById("banner-claim-btn").addEventListener("click", () => {
    navigate("shop-view");
    // Show discount apply suggestion
  });
  
  // Header Actions
  document.getElementById("header-wishlist-btn").addEventListener("click", () => {
    state.activeDbTab = "db-wishlist";
    navigate("dashboard-view");
  });
  document.getElementById("header-cart-btn").addEventListener("click", () => navigate("cart-view"));
  
  // Profile dropdown — only My Dashboard (Admin Panel removed from public UI)
  document.getElementById("act-customer-dashboard").addEventListener("click", (e) => {
    e.preventDefault();
    state.activeDbTab = "db-orders";
    navigate("dashboard-view");
    document.getElementById("account-dropdown").style.opacity = "0";
    document.getElementById("account-dropdown").style.visibility = "hidden";
  });

  // Keep dropdown functional on hover
  const accountBtn = document.getElementById("header-account-btn");
  const accountDropdown = document.getElementById("account-dropdown");
  accountBtn.addEventListener("mouseenter", () => {
    accountDropdown.style.opacity = "1";
    accountDropdown.style.visibility = "visible";
    accountDropdown.style.transform = "translateY(0)";
  });
  accountBtn.addEventListener("mouseleave", () => {
    accountDropdown.style.opacity = "0";
    accountDropdown.style.visibility = "hidden";
    accountDropdown.style.transform = "translateY(10px)";
  });

  // Theme Toggle
  document.getElementById("theme-toggle-btn").addEventListener("click", toggleTheme);

  // Search Engine Events
  const searchInput = document.getElementById("global-search-input");
  searchInput.addEventListener("input", handleSearchSuggestions);
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const q = searchInput.value.trim();
      if (q) {
        document.getElementById("global-search-suggestions").style.display = "none";
        navigate("shop-view", { search: q });
      }
    }
  });

  // Close search suggestions on body click
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".header-search")) {
      document.getElementById("global-search-suggestions").style.display = "none";
    }
  });

  // Voice Search Trigger
  document.getElementById("voice-search-trigger").addEventListener("click", startVoiceSearch);
  document.getElementById("voice-close-btn").addEventListener("click", stopVoiceSearch);

  // Modals Close Action
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay || e.target.classList.contains("modal-close-btn")) {
        overlay.classList.remove("active");
        if (overlay.id === "pharmacy-locator-modal") {
          // clean leaflet state if needed
        }
      }
    });
  });

  // Upload RX Modals Triggers
  document.getElementById("upload-pres-header-btn").addEventListener("click", () => openPrescriptionModal());
  document.getElementById("hero-upload-rx-btn").addEventListener("click", () => openPrescriptionModal());
  document.getElementById("db-upload-pres-btn").addEventListener("click", () => openPrescriptionModal());

  // Shop filter hooks
  document.getElementById("filter-price-slider").addEventListener("input", (e) => {
    document.getElementById("price-slider-value").innerText = `Max: ₹${e.target.value}`;
    triggerShopFiltering();
  });
  document.getElementById("filter-rx-required").addEventListener("change", triggerShopFiltering);
  document.getElementById("filter-rx-not-required").addEventListener("change", triggerShopFiltering);
  document.getElementById("filter-in-stock").addEventListener("change", triggerShopFiltering);
  document.getElementById("clear-filters-btn").addEventListener("click", clearAllFilters);
  document.getElementById("shop-sort-select").addEventListener("change", triggerShopFiltering);

  // Mobile drawer trigger
  document.getElementById("mobile-filter-trigger").addEventListener("click", () => {
    const sidebar = document.getElementById("shop-filters-sidebar");
    sidebar.classList.toggle("active");
  });

  // Cart go shopping btn
  document.getElementById("cart-go-shopping-btn").addEventListener("click", () => navigate("shop-view"));
  document.getElementById("apply-coupon-btn").addEventListener("click", applyCouponCode);

  // Checkout actions
  document.getElementById("cart-proceed-checkout-btn").addEventListener("click", () => navigate("checkout-view"));
  document.getElementById("checkout-place-order-btn").addEventListener("click", placeOrderCheckout);
  document.getElementById("save-new-ship-address-btn").addEventListener("click", addCheckoutCustomAddress);

  // Dashboard Sub-navigation tabs
  document.querySelectorAll(".db-menu-list li").forEach(menuItem => {
    menuItem.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelectorAll(".db-menu-list li").forEach(li => li.classList.remove("active"));
      menuItem.classList.add("active");
      
      const tabId = menuItem.getAttribute("data-db-tab");
      state.activeDbTab = tabId;
      renderDashboard(tabId);
    });
  });
  document.getElementById("save-settings-btn").addEventListener("click", saveSettingsProfile);

  // Admin Sub-navigation tabs
  document.querySelectorAll(".admin-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".admin-tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const paneId = btn.getAttribute("data-admin-pane");
      state.activeAdminPane = paneId;
      renderAdmin(paneId);
    });
  });
  document.getElementById("admin-logout-btn").addEventListener("click", logoutAdmin);
  document.getElementById("admin-add-product-btn").addEventListener("click", () => openAdminProductFormModal());
  document.getElementById("admin-save-product-btn").addEventListener("click", adminSaveProductItem);

  // Admin login form events
  document.getElementById("admin-login-submit-btn").addEventListener("click", attemptAdminLogin);
  document.getElementById("admin-login-form").addEventListener("submit", (e) => { e.preventDefault(); attemptAdminLogin(); });
  document.getElementById("admin-login-back-btn").addEventListener("click", (e) => { e.preventDefault(); navigate("home-view"); });
  document.getElementById("admin-pw-toggle").addEventListener("click", () => {
    const pwInput = document.getElementById("admin-login-password");
    const eyeIcon = document.getElementById("admin-pw-eye-icon");
    if (pwInput.type === "password") {
      pwInput.type = "text";
      eyeIcon.setAttribute("data-lucide", "eye-off");
    } else {
      pwInput.type = "password";
      eyeIcon.setAttribute("data-lucide", "eye");
    }
    lucide.createIcons();
  });

  // Comparison Bar Events
  document.getElementById("comp-compare-btn-trigger").addEventListener("click", openComparisonModal);
  document.getElementById("comp-clear-all").addEventListener("click", clearComparisonList);

  // Store Locator events
  document.getElementById("header-locator-btn").addEventListener("click", openLocatorModal);
  document.getElementById("footer-locator-btn-link").addEventListener("click", (e) => {
    e.preventDefault();
    openLocatorModal();
  });

  // Footer Category links
  document.querySelectorAll(".footer-cat-link").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const cat = link.getAttribute("data-cat");
      navigate("shop-view", { category: cat });
    });
  });

  // Footer page links
  document.querySelectorAll("footer .footer-links a").forEach(link => {
    const text = link.textContent.trim();
    if (text === "About Us") {
      link.addEventListener("click", (e) => { e.preventDefault(); navigate("info-view", "about-us"); });
    } else if (text === "Licensed Pharmacists") {
      link.addEventListener("click", (e) => { e.preventDefault(); navigate("info-view", "pharmacists"); });
    } else if (text === "Fulfillment Hubs") {
      link.addEventListener("click", (e) => { e.preventDefault(); navigate("info-view", "hubs"); });
    } else if (text === "Careers") {
      link.addEventListener("click", (e) => { e.preventDefault(); navigate("info-view", "careers"); });
    } else if (text === "Privacy Policy") {
      link.addEventListener("click", (e) => { e.preventDefault(); navigate("info-view", "privacy"); });
    } else if (text === "Refund & Returns") {
      link.addEventListener("click", (e) => { e.preventDefault(); navigate("info-view", "refunds"); });
    } else if (text === "Terms of Service") {
      link.addEventListener("click", (e) => { e.preventDefault(); navigate("info-view", "terms"); });
    } else if (text === "Prescription Guidelines") {
      link.addEventListener("click", (e) => { e.preventDefault(); navigate("info-view", "guidelines"); });
    } else if (text === "F.A.Q.s") {
      link.addEventListener("click", (e) => { e.preventDefault(); navigate("info-view", "faqs"); });
    }
  });

  // Info Sidebar tab navigation switcher
  document.querySelectorAll("#info-menu-list-tabs li").forEach(tab => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      const tabId = tab.getAttribute("data-info-tab");
      renderInfoView(tabId);
    });
  });

  // Prescription Drag & Drop file loaders
  setupPrescriptionDropzones();

  // Live Chat events
  document.getElementById("chat-widget-toggle").addEventListener("click", toggleLiveChatPanel);
  document.getElementById("chat-send-trigger").addEventListener("click", triggerChatUserMessage);
  document.getElementById("chat-message-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") triggerChatUserMessage();
  });
}

// ====================================================
// 6. GENERAL UTILITIES (Theme, Headers, Populates)
// ====================================================
function toggleTheme() {
  state.theme = (state.theme === "light") ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", state.theme);
  saveLocalStorage();
  toggleThemeIconUI();
}

function toggleThemeIconUI() {
  const sun = document.getElementById("theme-sun-icon");
  const moon = document.getElementById("theme-moon-icon");
  if (state.theme === "dark") {
    sun.style.display = "none";
    moon.style.display = "block";
  } else {
    sun.style.display = "block";
    moon.style.display = "none";
  }
}

function updateHeaderCounters() {
  // Cart total items
  const cartCnt = state.cart.reduce((total, item) => total + item.quantity, 0);
  const cartBubble = document.getElementById("cart-count");
  cartBubble.innerText = cartCnt;
  if (cartCnt > 0) {
    cartBubble.classList.add("bounce-bubble");
    // Remove class after animation finishes
    setTimeout(() => cartBubble.classList.remove("bounce-bubble"), 400);
  }

  // Wishlist
  const wishBubble = document.getElementById("wishlist-count");
  wishBubble.innerText = state.wishlist.length;
}

function showToast(message, type = "success") {
  let container = document.getElementById("toast-notification-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-notification-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  
  let icon = "info";
  if (type === "success") icon = "check-circle-2";
  if (type === "danger") icon = "alert-triangle";
  if (type === "warning") icon = "alert-circle";

  toast.innerHTML = `
    <i data-lucide="${icon}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  lucide.createIcons();

  // Remove toast from DOM after animations finish (4.2s total)
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(12px)";
    setTimeout(() => toast.remove(), 400);
  }, 3800);
}


function populateCategoryDropdown() {
  const categories = [...new Set(state.products.map(p => p.category))];
  
  // Header Dropdown
  const headerList = document.getElementById("header-categories-list");
  headerList.innerHTML = "";
  categories.forEach(cat => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="#">${cat}</a>`;
    li.addEventListener("click", (e) => {
      e.preventDefault();
      navigate("shop-view", { category: cat });
    });
    headerList.appendChild(li);
  });

  // Shop Sidebar list
  const filterList = document.getElementById("filter-categories-list");
  filterList.innerHTML = "";
  categories.forEach(cat => {
    const li = document.createElement("li");
    li.innerHTML = `
      <label>
        <input type="checkbox" class="category-filter-checkbox" value="${cat}">
        ${cat}
      </label>
    `;
    li.querySelector("input").addEventListener("change", triggerShopFiltering);
    filterList.appendChild(li);
  });
}

// ====================================================
// 6b. VIEWS: INFORMATIONAL PORTAL RENDERER
// ====================================================
function renderInfoView(tabId = "about-us") {
  if (!tabId) tabId = "about-us";
  
  // Highlight active tab in sidebar
  document.querySelectorAll("#info-menu-list-tabs li").forEach(li => {
    if (li.getAttribute("data-info-tab") === tabId) {
      li.classList.add("active");
    } else {
      li.classList.remove("active");
    }
  });
  
  // Fetch content
  const container = document.getElementById("info-content-container");
  const contentHTML = INFO_PAGES_CONTENT[tabId] || `<h2>Page Not Found</h2><p>This page could not be located.</p>`;
  
  container.innerHTML = contentHTML;
  
  // If it's the FAQ page, bind the accordion click event handlers
  if (tabId === "faqs") {
    document.querySelectorAll(".faq-question").forEach(q => {
      q.addEventListener("click", () => {
        const item = q.parentElement;
        const isActive = item.classList.contains("active");
        
        // Collapse all others
        document.querySelectorAll(".faq-item").forEach(el => el.classList.remove("active"));
        
        if (!isActive) {
          item.classList.add("active");
        }
      });
    });
  }
  
  // Refresh Lucide icons in dynamically injected content
  lucide.createIcons();
}

// ====================================================
// 7. VIEWS: HOME PAGE RENDERER
// ====================================================
function renderHome() {
  // Populate Category Grid
  const homeCategories = [
    { name: "Prescription Medicines", icon: "file-text" },
    { name: "OTC Medicines", icon: "activity" },
    { name: "Diabetes Care", icon: "heart" },
    { name: "Health Supplements", icon: "award" },
    { name: "Baby Care", icon: "smile" },
    { name: "Personal Care", icon: "sparkles" },
    { name: "Medical Devices", icon: "cpu" },
    { name: "Ayurvedic Products", icon: "leaf" }
  ];

  const grid = document.getElementById("home-categories-grid");
  grid.innerHTML = "";
  homeCategories.forEach(cat => {
    const card = document.createElement("div");
    card.className = "category-card";
    card.innerHTML = `
      <div class="category-icon">
        <i data-lucide="${cat.icon}"></i>
      </div>
      <h3>${cat.name}</h3>
    `;
    card.addEventListener("click", () => {
      navigate("shop-view", { category: cat.name });
    });
    grid.appendChild(card);
  });

  // Populate Featured Products (Select top 4 with highest discount / rating)
  const featured = state.products
    .filter(p => p.stock > 0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  const productsContainer = document.getElementById("home-featured-products");
  productsContainer.innerHTML = "";
  featured.forEach(prod => {
    const card = createProductCardHTML(prod);
    productsContainer.appendChild(card);
  });

  // Refresh icons inside rendered grid
  lucide.createIcons();
}

function createProductCardHTML(product) {
  const col = document.createElement("div");
  col.className = "product-card";
  col.setAttribute("data-id", product.id);

  const prevPriceVal = product.discount > 0 ? (product.price / (1 - product.discount/100)).toFixed(2) : "";
  const isPrescription = product.prescriptionRequired ? `<span class="badge badge-danger">Rx Required</span>` : "";
  const discountBadge = product.discount > 0 ? `<span class="badge badge-warning">-${product.discount}%</span>` : "";
  const isWishlisted = state.wishlist.includes(product.id) ? "active" : "";

  col.innerHTML = `
    <div class="product-badge-group">
      ${isPrescription}
      ${discountBadge}
    </div>
    <div class="wishlist-btn-card ${isWishlisted}" title="Add to Wishlist">
      <i data-lucide="heart"></i>
    </div>
    <div class="product-image-container">
      <img src="${product.image}" alt="${product.name}" loading="lazy">
    </div>
    <div class="product-brand">${product.brand}</div>
    <h3 class="product-name">${product.name}</h3>
    <div class="product-rating">
      <div class="stars">${renderRatingStars(product.rating)}</div>
      <span class="rating-num">${product.rating}</span>
      <span class="reviews-cnt">(${product.reviewsCount})</span>
    </div>
    <div class="product-price-row">
      <span class="curr-price">₹${product.price.toFixed(2)}</span>
      ${prevPriceVal ? `<span class="prev-price">₹${prevPriceVal}</span>` : ""}
    </div>
    <div class="product-actions-btn">
      <button class="btn btn-primary add-to-cart-card-btn" style="padding: 10px;"><i data-lucide="shopping-cart"></i> Add</button>
      <div class="quick-view-btn" title="Quick View"><i data-lucide="eye" style="width: 18px;"></i></div>
    </div>
  `;

  // Bind interactions inside card
  col.querySelector(".product-image-container").addEventListener("click", () => navigate("details-view", product.id));
  col.querySelector(".product-name").addEventListener("click", () => navigate("details-view", product.id));
  col.querySelector(".wishlist-btn-card").addEventListener("click", (e) => {
    e.stopPropagation();
    toggleWishlist(product.id, e.currentTarget);
  });
  col.querySelector(".add-to-cart-card-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  });
  col.querySelector(".quick-view-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    openQuickViewModal(product);
  });

  return col;
}

function renderRatingStars(rating) {
  let stars = "";
  const floor = Math.floor(rating);
  for (let i = 0; i < 5; i++) {
    if (i < floor) {
      stars += "★";
    } else {
      stars += "☆";
    }
  }
  return stars;
}

// ====================================================
// 8. VIEWS: SHOP PAGE RENDERER
// ====================================================
function renderShop(filterParams = null) {
  // Clear other active flags unless filterParams details them
  if (filterParams) {
    if (filterParams.category) {
      clearAllFilters(false);
      // Select category checkbox
      document.querySelectorAll(".category-filter-checkbox").forEach(chk => {
        if (chk.value === filterParams.category) chk.checked = true;
      });
    }
    if (filterParams.search) {
      document.getElementById("global-search-input").value = filterParams.search;
    }
  }

  // Trigger grid population
  triggerShopFiltering();
}

function triggerShopFiltering() {
  const searchQ = document.getElementById("global-search-input").value.toLowerCase().trim();
  
  // Selected categories
  const selectedCats = [];
  document.querySelectorAll(".category-filter-checkbox:checked").forEach(chk => {
    selectedCats.push(chk.value);
  });

  const priceMax = parseFloat(document.getElementById("filter-price-slider").value);
  
  const rxRequiredChecked = document.getElementById("filter-rx-required").checked;
  const rxNotRequiredChecked = document.getElementById("filter-rx-not-required").checked;
  
  const inStockChecked = document.getElementById("filter-in-stock").checked;
  
  const selectedRatings = [];
  document.querySelectorAll("input[name='rating-filter']:checked").forEach(chk => {
    selectedRatings.push(parseFloat(chk.value));
  });

  // Filter logic
  let filtered = state.products.filter(prod => {
    // Search
    if (searchQ) {
      const matchName = prod.name.toLowerCase().includes(searchQ);
      const matchBrand = prod.brand.toLowerCase().includes(searchQ);
      const matchComp = prod.composition && prod.composition.toLowerCase().includes(searchQ);
      if (!matchName && !matchBrand && !matchComp) return false;
    }

    // Categories
    if (selectedCats.length > 0 && !selectedCats.includes(prod.category)) return false;

    // Price
    if (prod.price > priceMax) return false;

    // Prescription required
    if (rxRequiredChecked && !rxNotRequiredChecked && !prod.prescriptionRequired) return false;
    if (rxNotRequiredChecked && !rxRequiredChecked && prod.prescriptionRequired) return false;

    // In Stock
    if (inStockChecked && prod.stock <= 0) return false;

    // Rating
    if (selectedRatings.length > 0) {
      const minRating = Math.min(...selectedRatings);
      if (prod.rating < minRating) return false;
    }

    return true;
  });

  // Sort logic
  const sortBy = document.getElementById("shop-sort-select").value;
  if (sortBy === "popularity") {
    filtered.sort((a, b) => b.reviewsCount - a.reviewsCount);
  } else if (sortBy === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === "discount") {
    filtered.sort((a, b) => b.discount - a.discount);
  }

  // Render list
  const container = document.getElementById("shop-products-grid-container");
  container.innerHTML = "";
  
  const resultsCountNum = document.getElementById("shop-results-count-num");
  resultsCountNum.innerText = filtered.length;

  const emptyState = document.getElementById("shop-no-results");
  if (filtered.length === 0) {
    emptyState.style.display = "block";
    container.style.display = "none";
  } else {
    emptyState.style.display = "none";
    container.style.display = "grid";
    
    filtered.forEach(prod => {
      const card = createProductCardHTML(prod);
      
      // Inject product comparison action inside card actions row
      const actionsRow = card.querySelector(".product-actions-btn");
      
      // Compare Icon
      const compareBtn = document.createElement("div");
      compareBtn.className = "quick-view-btn";
      compareBtn.title = "Compare Product";
      compareBtn.innerHTML = `<i data-lucide="git-compare" style="width: 18px;"></i>`;
      compareBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleProductComparison(prod);
      });
      actionsRow.insertBefore(compareBtn, actionsRow.lastElementChild);
      
      container.appendChild(card);
    });
  }

  // Close sidebar drawer on mobile
  document.getElementById("shop-filters-sidebar").classList.remove("active");

  lucide.createIcons();
}

function clearAllFilters(reFilter = true) {
  document.getElementById("global-search-input").value = "";
  document.querySelectorAll(".category-filter-checkbox").forEach(chk => chk.checked = false);
  document.getElementById("filter-price-slider").value = 2500;
  document.getElementById("price-slider-value").innerText = "Max: ₹2500";
  document.getElementById("filter-rx-required").checked = false;
  document.getElementById("filter-rx-not-required").checked = false;
  document.getElementById("filter-in-stock").checked = false;
  document.querySelectorAll("input[name='rating-filter']").forEach(chk => chk.checked = false);

  if (reFilter) triggerShopFiltering();
}

// ====================================================
// 9. VIEWS: PRODUCT DETAILS PAGE RENDERER
// ====================================================
function renderProductDetails(product) {
  const contentTarget = document.getElementById("product-details-content-target");
  
  const discountLabel = product.discount > 0 ? `<span class="badge badge-warning" style="margin-left:8px;">${product.discount}% OFF</span>` : "";
  const rxRequired = product.prescriptionRequired ? `<span class="badge badge-danger"><i data-lucide="file-warning" style="width:14px; margin-right:4px;"></i> Prescription Required</span>` : `<span class="badge badge-success">Over-the-Counter (OTC)</span>`;
  const isWishlisted = state.wishlist.includes(product.id) ? "active" : "";

  // Render Purchase block
  contentTarget.innerHTML = `
    <div class="details-gallery">
      <div class="main-image-frame" id="details-main-img-container">
        <img src="${product.image}" id="details-main-image-view" alt="${product.name}">
      </div>
      <div class="gallery-thumbnails">
        <div class="thumbnail active" data-img="${product.image}">
          <img src="${product.image}" alt="thumbnail">
        </div>
        <div class="thumbnail" data-img="https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=80">
          <img src="https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=80" alt="pack back">
        </div>
        <div class="thumbnail" data-img="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&auto=format&fit=crop&q=80">
          <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&auto=format&fit=crop&q=80" alt="spec usage">
        </div>
      </div>
    </div>
    
    <div class="details-info">
      <div style="display:flex; justify-content:space-between; align-items:flex-start;">
        <div>
          <span class="details-brand">${product.brand}</span>
          <h1 class="details-title">${product.name}</h1>
        </div>
        <button class="btn-icon wishlist-btn-card ${isWishlisted}" id="details-wishlist-action" style="position:static; border-radius:50%; width:44px; height:44px;">
          <i data-lucide="heart"></i>
        </button>
      </div>
      
      <div class="details-meta-row">
        <div class="product-rating" style="margin-bottom:0;">
          <div class="stars">${renderRatingStars(product.rating)}</div>
          <span class="rating-num" style="font-size:0.95rem;">${product.rating}</span>
          <span class="reviews-cnt" style="font-size:0.95rem;">(${product.reviewsCount} reviews)</span>
        </div>
        ${rxRequired}
      </div>
      
      <div class="details-spec-box">
        <table>
          <tr>
            <td>Category</td>
            <td>${product.category}</td>
          </tr>
          <tr>
            <td>Manufacturer</td>
            <td>${product.manufacturer || "Certified Abhay Partner"}</td>
          </tr>
          <tr>
            <td>Composition</td>
            <td>${product.composition || "Standard Formulation"}</td>
          </tr>
          <tr>
            <td>Packaging</td>
            <td>10 Units per Strip / Bottle pack</td>
          </tr>
        </table>
      </div>
      
      <div class="details-purchase-panel">
        <div class="details-price-row">
          <span class="dp-curr">₹${product.price.toFixed(2)}</span>
          ${product.discount > 0 ? `<span class="dp-prev">₹${(product.price / (1 - product.discount/100)).toFixed(2)}</span> ${discountLabel}` : ""}
        </div>
        
        <p style="font-size:0.8rem; font-weight:700; color:var(--text-secondary); margin-bottom:8px;">Select Quantity</p>
        <div class="quantity-selector">
          <button class="qty-btn" id="details-qty-minus">-</button>
          <input type="text" class="qty-input" id="details-qty-input" value="1" readonly>
          <button class="qty-btn" id="details-qty-plus">+</button>
        </div>
        
        <div class="details-actions-btn">
          <button class="btn btn-primary" id="details-add-to-cart-btn"><i data-lucide="shopping-cart"></i> Add To Cart</button>
          <button class="btn btn-secondary" id="details-buy-now-btn">Buy Now <i data-lucide="arrow-right"></i></button>
        </div>
      </div>
    </div>
  `;

  // Bind Details Page Action Handlers
  document.getElementById("details-wishlist-action").addEventListener("click", (e) => {
    toggleWishlist(product.id, e.currentTarget);
  });

  const qtyInput = document.getElementById("details-qty-input");
  document.getElementById("details-qty-minus").addEventListener("click", () => {
    let q = parseInt(qtyInput.value);
    if (q > 1) qtyInput.value = --q;
  });
  document.getElementById("details-qty-plus").addEventListener("click", () => {
    let q = parseInt(qtyInput.value);
    if (q < product.stock) qtyInput.value = ++q;
  });

  document.getElementById("details-add-to-cart-btn").addEventListener("click", () => {
    const q = parseInt(qtyInput.value);
    addToCart(product, q);
  });
  document.getElementById("details-buy-now-btn").addEventListener("click", () => {
    const q = parseInt(qtyInput.value);
    addToCart(product, q, false);
    navigate("checkout-view");
  });

  // Gallery Thumbnail clicks
  document.querySelectorAll(".thumbnail").forEach(thumb => {
    thumb.addEventListener("click", () => {
      document.querySelectorAll(".thumbnail").forEach(t => t.classList.remove("active"));
      thumb.classList.add("active");
      document.getElementById("details-main-image-view").src = thumb.getAttribute("data-img");
    });
  });

  // Map product descriptions to tabs
  document.getElementById("details-tab-desc-text").innerText = product.description;
  document.getElementById("details-tab-comp-text").innerText = product.composition || "Standard clinical compilation verified safe for medical use.";
  document.getElementById("details-tab-uses-text").innerText = product.uses || "Clinical uses and indications for this product are detailed in this section.";
  document.getElementById("details-tab-benefits-text").innerText = product.benefits || "Supports recovery from symptoms, builds long-term wellness resistance.";
  document.getElementById("details-tab-usage-text").innerText = product.usage || "Take exactly as detailed on the outer box. Store in cool, dark environments.";
  document.getElementById("details-tab-sideeffects-text").innerText = product.sideEffects || "No severe reactions detected in test patients. Discontinue usage if allergic.";
  document.getElementById("details-tab-precautions-text").innerText = product.precautions || "Storage and safety precautions are detailed in this section.";

  // Bind tabs navigation
  document.querySelectorAll(".detail-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".detail-tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const tabId = btn.getAttribute("data-tab");
      document.querySelectorAll(".detail-tab-pane").forEach(pane => {
        if (pane.id === tabId) {
          pane.classList.remove("hidden");
        } else {
          pane.classList.add("hidden");
        }
      });
    });
  });

  // Frequently Bought Together Widget
  renderFrequentlyBoughtTogether(product);

  // Dynamic reviews list
  renderProductReviews(product);

  // Recently Viewed Widget
  renderRecentlyViewedGrid();

  lucide.createIcons();
}

function renderFrequentlyBoughtTogether(product) {
  const fbtContainer = document.getElementById("details-fbt-bundle-container");
  
  // Find two matching items from other categories
  const item1 = state.products.find(p => p.category === "Health Supplements" && p.id !== product.id && p.stock > 0) || state.products[22];
  const item2 = state.products.find(p => p.category === "Medical Devices" && p.id !== product.id && p.stock > 0) || state.products[40];

  const totalBundlePrice = (product.price + item1.price + item2.price) * 0.9; // 10% bundle discount

  fbtContainer.innerHTML = `
    <h3 style="margin-bottom: 20px; font-size:1.25rem;">Frequently Bought Together (Save 10% on Bundle)</h3>
    <div class="fbt-bundle-row">
      <div style="display:flex; align-items:center; gap:16px;">
        <div class="fbt-item">
          <img src="${product.image}" alt="${product.name}">
          <h4>${product.name}</h4>
          <span style="font-weight:700;">₹${product.price.toFixed(2)}</span>
        </div>
        <span class="fbt-plus-symbol">+</span>
        <div class="fbt-item" style="cursor:pointer;" onclick="navigate('details-view', '${item1.id}')">
          <img src="${item1.image}" alt="${item1.name}">
          <h4>${item1.name}</h4>
          <span style="font-weight:700;">₹${item1.price.toFixed(2)}</span>
        </div>
        <span class="fbt-plus-symbol">+</span>
        <div class="fbt-item" style="cursor:pointer;" onclick="navigate('details-view', '${item2.id}')">
          <img src="${item2.image}" alt="${item2.name}">
          <h4>${item2.name}</h4>
          <span style="font-weight:700;">₹${item2.price.toFixed(2)}</span>
        </div>
      </div>
      
      <div class="fbt-bundle-calculation">
        <h3>Bundle Price: <span style="color:var(--primary); font-size:1.6rem;">₹${totalBundlePrice.toFixed(2)}</span></h3>
        <p style="font-size:0.75rem; color:var(--text-muted); margin-bottom:12px;">Includes 10% package discount on individual prices</p>
        <button class="btn btn-secondary" id="fbt-add-bundle-btn">Add Bundle to Cart</button>
      </div>
    </div>
  `;

  document.getElementById("fbt-add-bundle-btn").addEventListener("click", () => {
    addToCart(product, 1, false);
    addToCart(item1, 1, false);
    addToCart(item2, 1, true); // final notification trigger
  });
}

function renderProductReviews(product) {
  const reviewsContainer = document.getElementById("product-detail-reviews-list");
  reviewsContainer.innerHTML = "";

  const mockReviews = [
    { name: "Sarah Jenkins", rating: 5, comment: `Outstanding effectiveness. I followed the pharmacist's advice on taking it after dinner. No side effects.`, date: "2026-05-18" },
    { name: "Robert Taylor", rating: 4, comment: `High-quality packaging, arrived perfectly cold. A solid therapeutic standard.`, date: "2026-06-02" }
  ];

  mockReviews.forEach(rev => {
    const card = document.createElement("div");
    card.className = "review-card";
    card.innerHTML = `
      <div class="review-stars">${renderRatingStars(rev.rating)}</div>
      <p class="review-text">"${rev.comment}"</p>
      <div class="reviewer-profile">
        <div class="reviewer-avatar">${rev.name.split(" ").map(n => n[0]).join("")}</div>
        <div class="reviewer-info">
          <h4>${rev.name}</h4>
          <p>Reviewed on ${rev.date}</p>
        </div>
      </div>
    `;
    reviewsContainer.appendChild(card);
  });

  // Bind Submit Review Button
  document.getElementById("submit-user-review-btn").onclick = () => {
    const nameInput = document.getElementById("review-user-name");
    const starsSelect = document.getElementById("review-rating-stars");
    const textInput = document.getElementById("review-user-text");

    const name = nameInput.value.trim();
    const text = textInput.value.trim();
    const stars = parseInt(starsSelect.value);

    if (!name || !text) {
      showToast("Please fill in your name and review details to submit.", "warning");
      return;
    }

    // Append to list visually
    const card = document.createElement("div");
    card.className = "review-card";
    card.style.borderColor = "var(--primary)";
    card.innerHTML = `
      <div class="review-stars">${renderRatingStars(stars)}</div>
      <p class="review-text">"${text}"</p>
      <div class="reviewer-profile">
        <div class="reviewer-avatar">${name.split(" ").map(n => n[0]).join("")}</div>
        <div class="reviewer-info">
          <h4>${name} (You)</h4>
          <p>Reviewed just now</p>
        </div>
      </div>
    `;
    reviewsContainer.insertBefore(card, reviewsContainer.firstChild);

    // Reset fields
    nameInput.value = "";
    textInput.value = "";
    showToast("Thank you for your valuable feedback!", "success");
  };
}

function addToRecentlyViewed(productId) {
  state.recentlyViewed = state.recentlyViewed.filter(id => id !== productId);
  state.recentlyViewed.unshift(productId);
  if (state.recentlyViewed.length > 4) state.recentlyViewed.pop();
}

function renderRecentlyViewedGrid() {
  const container = document.getElementById("details-recently-viewed-container");
  const grid = document.getElementById("recently-viewed-products-grid");
  
  const ids = state.recentlyViewed.filter(id => id !== state.selectedProduct.id);
  if (ids.length === 0) {
    container.style.display = "none";
    return;
  }

  container.style.display = "block";
  grid.innerHTML = "";
  
  ids.forEach(id => {
    const prod = state.products.find(p => p.id === id);
    if (prod) {
      const card = createProductCardHTML(prod);
      grid.appendChild(card);
    }
  });

  lucide.createIcons();
}

// ====================================================
// 10. CART OPERATION AND CHECKOUT SYSTEM
// ====================================================
function addToCart(product, quantity, showNotification = true) {
  const existing = state.cart.find(item => item.product.id === product.id);
  
  if (existing) {
    existing.quantity += quantity;
    if (existing.quantity > product.stock) existing.quantity = product.stock;
  } else {
    state.cart.push({ product, quantity });
  }

  saveLocalStorage();
  updateHeaderCounters();

  if (showNotification) {
    showToast(`Successfully added ${quantity}x ${product.name} to your Cart!`, "success");
  }
}

function removeFromCart(productId) {
  state.cart = state.cart.filter(item => item.product.id !== productId);
  saveLocalStorage();
  updateHeaderCounters();
  renderCart();
}

function updateCartQuantity(productId, quantity) {
  const item = state.cart.find(item => item.product.id === productId);
  if (item) {
    item.quantity = quantity;
    if (item.quantity <= 0) {
      removeFromCart(productId);
      return;
    }
  }
  saveLocalStorage();
  updateHeaderCounters();
  renderCart();
}

function renderCart() {
  const listContainer = document.getElementById("cart-items-list-container");
  const emptyState = document.getElementById("cart-empty-state");
  const itemsCountBadge = document.getElementById("cart-items-count-badge");

  itemsCountBadge.innerText = state.cart.length;

  if (state.cart.length === 0) {
    emptyState.style.display = "block";
    listContainer.style.display = "none";
    
    // Clear totals
    updateCartTotals(0, 0, 0, 0, 0);
    return;
  }

  emptyState.style.display = "none";
  listContainer.style.display = "block";
  listContainer.innerHTML = "";

  let subtotal = 0;

  state.cart.forEach(item => {
    const row = document.createElement("div");
    row.className = "cart-item-row";
    
    const prod = item.product;
    const itemTotal = prod.price * item.quantity;
    subtotal += itemTotal;

    const rxRequired = prod.prescriptionRequired ? `<span class="badge badge-danger" style="margin-top:6px; font-size:0.7rem;"><i data-lucide="file-warning" style="width:12px; margin-right:4px;"></i> Rx Required</span>` : "";

    row.innerHTML = `
      <div class="cart-item-img">
        <img src="${prod.image}" alt="${prod.name}">
      </div>
      <div class="cart-item-info">
        <h3>${prod.name}</h3>
        <p>Brand: ${prod.brand} | Manufacturer: ${prod.manufacturer}</p>
        ${rxRequired}
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn cart-qty-minus">-</button>
        <input type="text" class="qty-input cart-qty-val" value="${item.quantity}" readonly style="width:40px;">
        <button class="qty-btn cart-qty-plus">+</button>
      </div>
      <div class="cart-item-price-col">
        <div class="cip-curr">₹${itemTotal.toFixed(2)}</div>
        <div class="cip-del"><i data-lucide="trash-2" style="width:14px;"></i> Remove</div>
      </div>
    `;

    // Qty triggers
    row.querySelector(".cart-qty-minus").addEventListener("click", () => {
      updateCartQuantity(prod.id, item.quantity - 1);
    });
    row.querySelector(".cart-qty-plus").addEventListener("click", () => {
      updateCartQuantity(prod.id, item.quantity + 1);
    });
    row.querySelector(".cip-del").addEventListener("click", () => {
      removeFromCart(prod.id);
    });

    listContainer.appendChild(row);
  });

  // Calculate bill parameters
  let couponDiscount = 0;
  if (state.activeCoupon) {
    if (state.activeCoupon.discountPercent) {
      couponDiscount = subtotal * (state.activeCoupon.discountPercent / 100);
    }
  }

  // Delivery Fee ($40.00 standard if subtotal < $100.00, else free)
  let deliveryFee = subtotal >= 1000.00 ? 0.00 : 40.00;
  if (state.activeCoupon && state.activeCoupon.freeShipping) {
    deliveryFee = 0.00;
  }

  // Free shipping progress bar
  const progressText = document.getElementById("shipping-progress-text");
  const progressFill = document.getElementById("shipping-progress-bar-fill");
  const progressPercent = document.getElementById("shipping-progress-percent");

  if (subtotal >= 1000.00) {
    progressText.innerText = "Congratulations! Free Delivery Eligible";
    progressPercent.innerText = "100%";
    progressFill.style.width = "100%";
  } else {
    const diff = 1000.00 - subtotal;
    const pct = Math.floor((subtotal / 1000) * 100);
    progressText.innerText = `Spend ₹${diff.toFixed(2)} more for Free Delivery`;
    progressPercent.innerText = `${pct}%`;
    progressFill.style.width = `${pct}%`;
  }

  const tax = (subtotal - couponDiscount) * 0.18; // 18% GST/Tax
  const grandTotal = subtotal - couponDiscount + deliveryFee + tax;

  updateCartTotals(subtotal, couponDiscount, deliveryFee, tax, grandTotal);
  lucide.createIcons();
}

function updateCartTotals(subtotal, discount, delivery, tax, total) {
  document.getElementById("summary-subtotal").innerText = `₹${subtotal.toFixed(2)}`;
  document.getElementById("summary-discount").innerText = `-₹${discount.toFixed(2)}`;
  document.getElementById("summary-delivery").innerText = `₹${delivery.toFixed(2)}`;
  document.getElementById("summary-tax").innerText = `₹${tax.toFixed(2)}`;
  document.getElementById("summary-total").innerText = `₹${total.toFixed(2)}`;
}

function applyCouponCode() {
  const code = document.getElementById("coupon-code-input").value.trim().toUpperCase();
  const statusMsg = document.getElementById("coupon-status-msg");

  if (!code) {
    statusMsg.innerText = "Please enter a valid coupon code.";
    statusMsg.className = "badge badge-danger";
    return;
  }

  if (COUPONS[code]) {
    state.activeCoupon = COUPONS[code];
    statusMsg.innerText = `Coupon Applied: ${COUPONS[code].description}`;
    statusMsg.className = "badge badge-success";
    renderCart();
  } else {
    statusMsg.innerText = "Invalid Coupon Code. Try HEALTH20";
    statusMsg.className = "badge badge-danger";
  }
}

// ====================================================
// 11. VIEWS: CHECKOUT PAGE
// ====================================================
function renderCheckout() {
  // Populate shipping addresses list
  const addressesContainer = document.getElementById("checkout-saved-addresses");
  addressesContainer.innerHTML = "";
  
  state.userProfile.addresses.forEach(addr => {
    const card = document.createElement("div");
    const isActive = (state.selectedCheckoutAddress === addr.id) ? "active" : "";
    card.className = `saved-address-card ${isActive}`;
    card.innerHTML = `
      <i data-lucide="check-circle-2" class="sac-check"></i>
      <h4 style="font-size:0.9rem; font-weight:700;">${addr.fullname}</h4>
      <p style="font-size:0.8rem; color:var(--text-secondary); margin-top:6px;">${addr.street}</p>
      <p style="font-size:0.8rem; color:var(--text-secondary);">${addr.city}, ${addr.state} - ${addr.zip}</p>
      <p style="font-size:0.75rem; font-weight:600; color:var(--text-muted); margin-top:8px;"><i data-lucide="phone" style="width:12px; display:inline-block; vertical-align:middle;"></i> ${addr.phone}</p>
    `;

    card.addEventListener("click", () => {
      state.selectedCheckoutAddress = addr.id;
      renderCheckout();
    });

    addressesContainer.appendChild(card);
  });

  // Check if prescription required
  const rxCard = document.getElementById("checkout-rx-card");
  const hasRxMed = state.cart.some(item => item.product.prescriptionRequired);
  
  if (hasRxMed) {
    rxCard.style.display = "block";
  } else {
    rxCard.style.display = "none";
  }

  // Populate mini order item list
  const itemsList = document.getElementById("checkout-order-items-list");
  itemsList.innerHTML = "";
  
  let subtotal = 0;

  state.cart.forEach(item => {
    const prod = item.product;
    const itemTotal = prod.price * item.quantity;
    subtotal += itemTotal;

    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.justifyContent = "space-between";
    row.style.alignItems = "center";
    row.style.padding = "10px 0";
    row.style.borderBottom = "1px solid var(--border)";
    row.innerHTML = `
      <div>
        <h4 style="font-size:0.85rem; font-weight:600;">${prod.name}</h4>
        <span style="font-size:0.75rem; color:var(--text-muted);">Qty: ${item.quantity} x ₹${prod.price.toFixed(2)}</span>
      </div>
      <span style="font-weight:700; font-size:0.85rem;">₹${itemTotal.toFixed(2)}</span>
    `;
    itemsList.appendChild(row);
  });

  // Calculate bill parameters
  let couponDiscount = 0;
  if (state.activeCoupon) {
    if (state.activeCoupon.discountPercent) {
      couponDiscount = subtotal * (state.activeCoupon.discountPercent / 100);
    }
  }

  let deliveryFee = subtotal >= 1000.00 ? 0.00 : 40.00;
  if (state.activeCoupon && state.activeCoupon.freeShipping) {
    deliveryFee = 0.00;
  }

  // Check COD fee
  const selectedPaymentRow = document.querySelector(".payment-option-row.active");
  const isCOD = selectedPaymentRow && selectedPaymentRow.getAttribute("data-method") === "cod";
  if (isCOD) {
    deliveryFee += 50.00; // COD convenience fee
  }

  const tax = (subtotal - couponDiscount) * 0.18;
  const grandTotal = subtotal - couponDiscount + deliveryFee + tax;

  // Render totals
  document.getElementById("checkout-subtotal").innerText = `₹${subtotal.toFixed(2)}`;
  document.getElementById("checkout-discount").innerText = `-₹${couponDiscount.toFixed(2)}`;
  document.getElementById("checkout-delivery").innerText = `₹${deliveryFee.toFixed(2)}`;
  document.getElementById("checkout-tax").innerText = `₹${tax.toFixed(2)}`;
  document.getElementById("checkout-total").innerText = `₹${grandTotal.toFixed(2)}`;

  // Bind payment select option click
  document.querySelectorAll(".payment-option-row").forEach(row => {
    row.addEventListener("click", () => {
      document.querySelectorAll(".payment-option-row").forEach(r => r.classList.remove("active"));
      row.classList.add("active");
      
      const radio = row.querySelector("input[type='radio']");
      if (radio) radio.checked = true;

      // Re-trigger render to adjust totals (for COD fee)
      renderCheckout();
    });
  });

  // Setup file loaders listing
  renderUploadedPrescriptionsList("checkout-rx-uploaded-files");

  lucide.createIcons();
}

function addCheckoutCustomAddress() {
  const name = document.getElementById("ship-fullname").value.trim();
  const phone = document.getElementById("ship-phone").value.trim();
  const street = document.getElementById("ship-street").value.trim();
  const city = document.getElementById("ship-city").value.trim();
  const stateVal = document.getElementById("ship-state").value.trim();
  const zip = document.getElementById("ship-zip").value.trim();

  if (!name || !phone || !street || !city || !stateVal || !zip) {
    showToast("Please fill all address parameters to proceed.", "warning");
    return;
  }

  const newId = `addr-${Date.now()}`;
  const newAddr = { id: newId, fullname: name, phone, street, city, state: stateVal, zip, isDefault: false };
  
  state.userProfile.addresses.push(newAddr);
  state.selectedCheckoutAddress = newId;

  // Clear inputs
  document.getElementById("ship-fullname").value = "";
  document.getElementById("ship-phone").value = "";
  document.getElementById("ship-street").value = "";
  document.getElementById("ship-city").value = "";
  document.getElementById("ship-state").value = "";
  document.getElementById("ship-zip").value = "";

  saveLocalStorage();
  renderCheckout();
  showToast("Successfully saved and selected custom delivery address.", "success");
}

function placeOrderCheckout() {
  // Confirm cart contains items
  if (state.cart.length === 0) {
    showToast("Your shopping cart is empty!", "warning");
    return;
  }

  // Verify address is selected
  const activeAddr = state.userProfile.addresses.find(a => a.id === state.selectedCheckoutAddress);
  if (!activeAddr) {
    showToast("Please select or save a delivery address.", "warning");
    return;
  }

  // Verify prescription if required
  const hasRxMed = state.cart.some(item => item.product.prescriptionRequired);
  if (hasRxMed && state.uploadedRxFiles.length === 0) {
    showToast("Prescription Enforced! Please upload a medical prescription first to authorize checkout.", "danger");
    return;
  }

  // Calculate bill parameters
  let subtotal = state.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  let couponDiscount = 0;
  if (state.activeCoupon) {
    if (state.activeCoupon.discountPercent) {
      couponDiscount = subtotal * (state.activeCoupon.discountPercent / 100);
    }
  }

  let deliveryFee = subtotal >= 1000.00 ? 0.00 : 40.00;
  if (state.activeCoupon && state.activeCoupon.freeShipping) {
    deliveryFee = 0.00;
  }

  // Check COD fee
  const selectedPaymentRow = document.querySelector(".payment-option-row.active");
  const payMethodName = selectedPaymentRow ? selectedPaymentRow.getAttribute("data-method").toUpperCase() : "CARD";
  if (payMethodName === "COD") {
    deliveryFee += 50.00;
  }

  const tax = (subtotal - couponDiscount) * 0.18;
  const grandTotal = subtotal - couponDiscount + deliveryFee + tax;

  const orderId = `AC-${Math.floor(10000 + Math.random() * 90000)}`;

  // Create new order record
  const newOrder = {
    id: orderId,
    date: new Date().toISOString().split("T")[0],
    items: [...state.cart],
    subtotal,
    discount: couponDiscount,
    delivery: deliveryFee,
    tax,
    total: grandTotal,
    address: activeAddr,
    paymentMethod: payMethodName,
    prescriptionUrl: hasRxMed ? state.uploadedRxFiles[0].name : null,
    status: hasRxMed ? "Verification Pending" : "Processing",
    trackingStep: hasRxMed ? 2 : 1
  };

  // Push prescription to database if uploaded
  if (hasRxMed) {
    const rxRecord = {
      id: `rx-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split("T")[0],
      fileName: state.uploadedRxFiles[0].name,
      orderId: orderId,
      status: "Pending Verification"
    };
    state.prescriptions.unshift(rxRecord);
  }

  // Save order
  state.orders.unshift(newOrder);

  // Send Notification
  const newNotif = {
    id: `notif-${Date.now()}`,
    date: new Date().toISOString().split("T")[0],
    title: "Order Placed Successfully",
    message: `Your Order ${orderId} value ₹${grandTotal.toFixed(2)} has been recorded. ${hasRxMed ? "Pharmacist validation is pending." : "Processing shipment."}`,
    read: false
  };
  state.notifications.unshift(newNotif);

  // Deduct stock from inventory
  state.cart.forEach(item => {
    const prod = state.products.find(p => p.id === item.product.id);
    if (prod) {
      prod.stock = Math.max(0, prod.stock - item.quantity);
    }
  });

  // Clear cart & variables
  state.cart = [];
  state.uploadedRxFiles = [];
  state.activeCoupon = null;

  saveLocalStorage();
  updateHeaderCounters();

  showToast(`Order Placed Successfully! Your Order ID is ${orderId}. View status in your account dashboard.`, "success");
  
  // Navigate to Dashboard Orders Tab
  state.activeDbTab = "db-orders";
  navigate("dashboard-view");
}

// ====================================================
// 12. VIEWS: USER DASHBOARD
// ====================================================
function renderDashboard(tabId) {
  // Update customer profile headings
  document.getElementById("db-user-display-name").innerText = `${state.userProfile.firstname} ${state.userProfile.lastname}`;
  document.getElementById("db-user-email").innerText = state.userProfile.email;
  document.getElementById("db-user-avatar-initials").innerText = `${state.userProfile.firstname[0]}${state.userProfile.lastname[0]}`.toUpperCase();

  // Settings tab defaults loading
  document.getElementById("settings-fname").value = state.userProfile.firstname;
  document.getElementById("settings-lname").value = state.userProfile.lastname;
  document.getElementById("settings-email").value = state.userProfile.email;

  // Toggle active tab sections
  document.querySelectorAll(".db-section").forEach(sec => {
    if (sec.id === tabId) {
      sec.classList.remove("hidden");
    } else {
      sec.classList.add("hidden");
    }
  });

  if (tabId === "db-orders") {
    renderDashboardOrdersList();
  } else if (tabId === "db-prescriptions") {
    renderDashboardPrescriptionsVault();
  } else if (tabId === "db-wishlist") {
    renderDashboardWishlist();
  } else if (tabId === "db-addresses") {
    renderDashboardAddressesList();
  } else if (tabId === "db-notifications") {
    renderDashboardNotificationsList();
  }

  lucide.createIcons();
}

function renderDashboardOrdersList() {
  const container = document.getElementById("db-orders-list-container");
  container.innerHTML = "";

  if (state.orders.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:40px 0; color:var(--text-muted);">
        <i data-lucide="package" style="width:48px; height:48px; margin-bottom:12px;"></i>
        <h4>You haven't placed any orders yet</h4>
      </div>
    `;
    return;
  }

  state.orders.forEach(order => {
    const card = document.createElement("div");
    card.style.background = "var(--bg-secondary)";
    card.style.border = "1px solid var(--border)";
    card.style.borderRadius = "var(--radius-lg)";
    card.style.padding = "20px";
    card.style.marginBottom = "20px";

    // Setup Status Color Badge
    let statusClass = "badge-primary";
    if (order.status.includes("Pending")) statusClass = "badge-warning";
    if (order.status.includes("Delivered")) statusClass = "badge-success";
    if (order.status.includes("Rejected")) statusClass = "badge-danger";

    let stepPercent = "0%";
    if (order.trackingStep === 1) stepPercent = "10%";
    if (order.trackingStep === 2) stepPercent = "40%";
    if (order.trackingStep === 3) stepPercent = "70%";
    if (order.trackingStep === 4) stepPercent = "100%";

    const hasRxBadge = order.prescriptionUrl ? `<span class="badge badge-danger" style="font-size:0.7rem;"><i data-lucide="file-warning" style="width:12px; margin-right:4px;"></i> Rx Verified</span>` : "";

    const itemsDetailHTML = order.items.map(item => `
      <div style="font-size:0.85rem; color:var(--text-secondary); display:flex; justify-content:space-between; margin-bottom:6px;">
        <span>${item.product.name} x ${item.quantity}</span>
        <span>₹${(item.product.price * item.quantity).toFixed(2)}</span>
      </div>
    `).join("");

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border); padding-bottom:12px; margin-bottom:16px;">
        <div>
          <h4 style="font-weight:700;">Order ID: ${order.id}</h4>
          <p style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">Placed on: ${order.date}</p>
        </div>
        <div style="text-align:right;">
          <span class="badge ${statusClass}">${order.status}</span>
          <div style="margin-top:6px;">${hasRxBadge}</div>
        </div>
      </div>
      
      <div>
        ${itemsDetailHTML}
      </div>
      
      <div style="border-top:1px solid var(--border); margin-top:12px; padding-top:12px; display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:0.85rem; font-weight:700;">Grand Total Payable:</span>
        <span style="font-size:1.15rem; font-weight:800; color:var(--primary);">₹${order.total.toFixed(2)}</span>
      </div>

      <!-- Timeline Tracking -->
      <div class="order-tracking-wrapper">
        <h4 style="font-size:0.8rem; font-weight:700; margin-bottom:12px;">Delivery Tracking Status</h4>
        <div class="ot-timeline">
          <div class="ot-timeline-fill" style="width: ${stepPercent};"></div>
          
          <div class="ot-step ${order.trackingStep >= 1 ? 'completed' : ''}">
            <div class="ot-dot">1</div>
            <span class="ot-label">Processing</span>
          </div>
          <div class="ot-step ${order.trackingStep >= 2 ? (order.trackingStep === 2 ? 'active' : 'completed') : ''}">
            <div class="ot-dot">${order.prescriptionUrl ? 'Rx' : '2'}</div>
            <span class="ot-label">${order.prescriptionUrl ? 'Verification' : 'Packing'}</span>
          </div>
          <div class="ot-step ${order.trackingStep >= 3 ? (order.trackingStep === 3 ? 'active' : 'completed') : ''}">
            <div class="ot-dot">3</div>
            <span class="ot-label">In Transit</span>
          </div>
          <div class="ot-step ${order.trackingStep >= 4 ? 'completed' : ''}">
            <div class="ot-dot">4</div>
            <span class="ot-label">Delivered</span>
          </div>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

function renderDashboardPrescriptionsVault() {
  const tbody = document.getElementById("db-prescriptions-table-body");
  tbody.innerHTML = "";

  if (state.prescriptions.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; color:var(--text-muted); padding:30px 0;">No prescriptions uploaded yet.</td>
      </tr>
    `;
    return;
  }

  state.prescriptions.forEach(rx => {
    const row = document.createElement("tr");
    
    let statusClass = "badge-success";
    if (rx.status.includes("Pending")) statusClass = "badge-warning";
    if (rx.status.includes("Rejected")) statusClass = "badge-danger";

    row.innerHTML = `
      <td>${rx.date}</td>
      <td style="font-weight:700;">${rx.fileName}</td>
      <td>${rx.orderId || "Quick Assessment"}</td>
      <td><span class="badge ${statusClass}">${rx.status}</span></td>
      <td>
        <button class="btn btn-outline" style="padding:6px 12px; font-size:0.75rem;" onclick="viewPrescriptionFile('${rx.fileName}')"><i data-lucide="eye" style="width:12px;"></i> View</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function viewPrescriptionFile(fileName) {
  // Open mock prescription popup
  const modal = document.getElementById("admin-rx-viewer-modal");
  document.getElementById("admin-rx-image-target").innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px 0; color:var(--primary);">
      <i data-lucide="file-text" style="width:64px; height:64px; margin-bottom:12px;"></i>
      <h3 style="color:var(--text-primary);">${fileName}</h3>
      <p style="font-size:0.8rem; color:var(--text-secondary); margin-top:8px;">Certified Medical Document</p>
    </div>
  `;

  // Hide action buttons since user is viewing in their dashboard
  modal.querySelector("div[style*='display:flex']").style.display = "none";
  modal.classList.add("active");
  lucide.createIcons();
}

function renderDashboardWishlist() {
  const grid = document.getElementById("db-wishlist-products-grid");
  grid.innerHTML = "";

  if (state.wishlist.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: span 3; text-align:center; padding:40px 0; color:var(--text-muted);">
        <i data-lucide="heart" style="width:48px; height:48px; margin-bottom:12px;"></i>
        <h4>Your Wishlist is currently empty</h4>
        <button class="btn btn-primary" onclick="navigate('shop-view')" style="margin-top:16px;">Shop Now</button>
      </div>
    `;
    return;
  }

  state.wishlist.forEach(id => {
    const prod = state.products.find(p => p.id === id);
    if (prod) {
      const card = createProductCardHTML(prod);
      grid.appendChild(card);
    }
  });

  lucide.createIcons();
}

function renderDashboardAddressesList() {
  const grid = document.getElementById("db-saved-addresses-grid");
  grid.innerHTML = "";

  state.userProfile.addresses.forEach(addr => {
    const card = document.createElement("div");
    card.className = "saved-address-card";
    card.innerHTML = `
      <h4 style="font-weight:700;">${addr.fullname}</h4>
      <p style="font-size:0.8rem; color:var(--text-secondary); margin-top:8px;">${addr.street}</p>
      <p style="font-size:0.8rem; color:var(--text-secondary);">${addr.city}, ${addr.state} - ${addr.zip}</p>
      <p style="font-size:0.75rem; color:var(--text-muted); margin-top:8px;"><i data-lucide="phone" style="width:12px; display:inline-block; vertical-align:middle;"></i> ${addr.phone}</p>
      <button class="btn btn-outline" style="position:absolute; bottom:12px; right:12px; padding:4px 8px; font-size:0.7rem; color:var(--danger); border-color:var(--border);" onclick="deleteSavedAddress('${addr.id}')">Delete</button>
    `;
    grid.appendChild(card);
  });
}

function deleteSavedAddress(addrId) {
  state.userProfile.addresses = state.userProfile.addresses.filter(a => a.id !== addrId);
  saveLocalStorage();
  renderDashboard("db-addresses");
  showToast("Address removed from profile successfully.", "success");
}

function renderDashboardNotificationsList() {
  const container = document.getElementById("db-notifications-list-container");
  container.innerHTML = "";

  if (state.notifications.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:30px 0; color:var(--text-muted);">No notifications received.</div>
    `;
    return;
  }

  state.notifications.forEach(notif => {
    const card = document.createElement("div");
    card.style.background = notif.read ? "var(--bg-secondary)" : "var(--primary-light)";
    card.style.border = "1px solid var(--border)";
    card.style.borderRadius = "var(--radius-md)";
    card.style.padding = "16px";
    card.style.position = "relative";

    const unreadDot = !notif.read ? `<span style="position:absolute; top:12px; right:12px; width:10px; height:10px; border-radius:50%; background:var(--primary);"></span>` : "";

    card.innerHTML = `
      ${unreadDot}
      <h4 style="font-size:0.95rem; font-weight:700;">${notif.title}</h4>
      <p style="font-size:0.85rem; color:var(--text-secondary); margin-top:6px; line-height:1.4;">${notif.message}</p>
      <span style="font-size:0.7rem; color:var(--text-muted); display:block; margin-top:8px;">Received: ${notif.date}</span>
    `;

    // Mark as read on click
    card.addEventListener("click", () => {
      notif.read = true;
      saveLocalStorage();
      renderDashboard("db-notifications");
    });

    container.appendChild(card);
  });
}

function saveSettingsProfile() {
  const fname = document.getElementById("settings-fname").value.trim();
  const lname = document.getElementById("settings-lname").value.trim();
  const email = document.getElementById("settings-email").value.trim();
  const themeVal = document.getElementById("settings-theme-select").value;

  if (!fname || !lname || !email) {
    showToast("Please fill name and email parameters.", "warning");
    return;
  }

  state.userProfile.firstname = fname;
  state.userProfile.lastname = lname;
  state.userProfile.email = email;

  state.theme = themeVal;
  document.documentElement.setAttribute("data-theme", themeVal);
  toggleThemeIconUI();

  saveLocalStorage();
  showToast("Dashboard Settings Profile Updated Successfully!", "success");
}

function toggleWishlist(productId, btnElement) {
  const index = state.wishlist.indexOf(productId);
  if (index > -1) {
    state.wishlist.splice(index, 1);
    if (btnElement) btnElement.classList.remove("active");
  } else {
    state.wishlist.push(productId);
    if (btnElement) btnElement.classList.add("active");
  }

  saveLocalStorage();
  updateHeaderCounters();
}

// ====================================================
// 13. ADMIN AUTHENTICATION MODULE
// ====================================================

/**
 * Shows the standalone admin login page (hides header/footer).
 */
function showAdminLoginPage() {
  // Hide header and footer for the login page
  const header = document.querySelector("header");
  const footer = document.querySelector("footer");
  if (header) header.style.display = "none";
  if (footer) footer.style.display = "none";

  // Hide all views, show login
  document.querySelectorAll(".page-view").forEach(v => v.classList.add("hidden"));
  const loginView = document.getElementById("admin-login-view");
  if (loginView) loginView.classList.remove("hidden");

  // Clear any previous error
  const errBox = document.getElementById("admin-login-error");
  if (errBox) errBox.style.display = "none";
  const emailInput = document.getElementById("admin-login-email");
  const pwInput = document.getElementById("admin-login-password");
  if (emailInput) emailInput.value = "";
  if (pwInput) pwInput.value = "";

  state.activeView = "admin-login-view";
  window.scrollTo({ top: 0, behavior: "smooth" });
  lucide.createIcons();
}

/**
 * Validates email + password against ADMIN_USERS list.
 * On success: sets adminSession, navigates to admin-view.
 * On failure: shows shake error banner.
 */
function attemptAdminLogin() {
  const email    = (document.getElementById("admin-login-email")?.value || "").trim().toLowerCase();
  const password = (document.getElementById("admin-login-password")?.value || "").trim();
  const submitBtn = document.getElementById("admin-login-submit-btn");
  const errBox    = document.getElementById("admin-login-error");
  const errText   = document.getElementById("admin-login-error-text");

  if (!email || !password) {
    errText.innerText = "Please enter both email and password.";
    errBox.style.display = "flex";
    // Re-trigger shake animation
    errBox.style.animation = "none";
    errBox.offsetHeight; // reflow
    errBox.style.animation = "shake 0.4s ease";
    return;
  }

  // Show loading state
  if (submitBtn) submitBtn.classList.add("loading");

  // Simulate a brief auth delay for realism
  setTimeout(() => {
    const matchedAdmin = ADMIN_USERS.find(
      u => u.email.toLowerCase() === email && u.password === password
    );

    if (submitBtn) submitBtn.classList.remove("loading");

    if (matchedAdmin) {
      // ✅ Auth success
      state.adminSession = {
        email: matchedAdmin.email,
        role:  matchedAdmin.role,
        name:  matchedAdmin.name
      };

      // Restore header/footer visibility
      const header = document.querySelector("header");
      const footer = document.querySelector("footer");
      if (header) header.style.display = "";
      if (footer) footer.style.display = "";

      // Reset form
      document.getElementById("admin-login-email").value    = "";
      document.getElementById("admin-login-password").value = "";
      if (errBox) errBox.style.display = "none";

      state.activeAdminPane = "admin-analytics";
      navigate("admin-view");
      showToast(`Welcome back, ${matchedAdmin.name}! Admin console loaded.`, "success");
    } else {
      // ❌ Auth failure
      state.adminSession = null;
      errText.innerText = "Incorrect email or password. Please check and try again.";
      errBox.style.display = "flex";
      // Re-trigger shake animation
      errBox.style.animation = "none";
      errBox.offsetHeight;
      errBox.style.animation = "shake 0.4s ease";
      // Shake the password field too
      const pwInput = document.getElementById("admin-login-password");
      if (pwInput) {
        pwInput.value = "";
        pwInput.focus();
      }
    }
  }, 600);
}

/**
 * Logs out the current admin session, returns to public home.
 */
function logoutAdmin() {
  if (!confirm("Are you sure you want to log out of the Admin Console?")) return;
  state.adminSession = null;
  navigate("home-view");
  showToast("You have been logged out of the Admin Console.", "success");
}

/**
 * Updates the admin console header to show the logged-in admin's name and role.
 */
function updateAdminHeaderBadge() {
  if (!state.adminSession) return;
  const headerRow = document.querySelector(".admin-header-row > div");
  if (!headerRow) return;

  // Remove existing badge if present
  const existing = headerRow.querySelector(".admin-session-badge");
  if (existing) existing.remove();

  const badge = document.createElement("div");
  badge.className = "admin-session-badge";
  badge.style.marginTop = "6px";
  badge.innerHTML = `<i data-lucide="shield-check" style="width:12px;height:12px;"></i> ${state.adminSession.name} &bull; ${state.adminSession.role}`;
  headerRow.appendChild(badge);
  lucide.createIcons();
}

// ====================================================
// 14. VIEWS: ADMIN PANEL
// ====================================================
function renderAdmin(paneId) {
  // Toggle Admin pane view visibility
  document.querySelectorAll(".admin-panel-section").forEach(sec => {
    if (sec.id === paneId) {
      sec.classList.remove("hidden");
    } else {
      sec.classList.add("hidden");
    }
  });

  if (paneId === "admin-analytics") {
    renderAdminAnalyticsMetrics();
  } else if (paneId === "admin-products") {
    renderAdminProductsTable();
  } else if (paneId === "admin-orders") {
    renderAdminOrdersTable();
  } else if (paneId === "admin-customers") {
    renderAdminCustomersTable();
  }

  lucide.createIcons();
}

function renderAdminAnalyticsMetrics() {
  // Calculate total revenue from orders
  const revSum = state.orders
    .filter(o => o.status !== "Cancelled" && o.status !== "Rejected")
    .reduce((sum, o) => sum + o.total, 0);

  document.getElementById("admin-revenue-val").innerText = `₹${revSum.toFixed(2)}`;
  document.getElementById("admin-orders-val").innerText = state.orders.length;

  // Calculate low stock items
  const lowStockCnt = state.products.filter(p => p.stock < 50).length;
  const criticalStockVal = document.getElementById("admin-stockalert-val");
  criticalStockVal.innerText = lowStockCnt;
  if (lowStockCnt > 0) {
    criticalStockVal.style.color = "var(--danger)";
  } else {
    criticalStockVal.style.color = "var(--text-primary)";
  }
}

function renderAdminProductsTable() {
  const tbody = document.getElementById("admin-products-table-body");
  tbody.innerHTML = "";

  state.products.forEach(p => {
    const row = document.createElement("tr");
    
    let stockColor = "inherit";
    if (p.stock < 50) stockColor = "var(--danger)";
    if (p.stock === 0) stockColor = "var(--text-muted)";

    row.innerHTML = `
      <td style="display:flex; align-items:center; gap:10px;">
        <img src="${p.image}" alt="" style="width:36px; height:36px; border-radius:var(--radius-sm);">
        <div>
          <h4 style="font-size:0.85rem; font-weight:700;">${p.name}</h4>
          <span style="font-size:0.7rem; color:var(--text-muted);">${p.brand}</span>
        </div>
      </td>
      <td>${p.category}</td>
      <td style="font-weight:700;">₹${p.price.toFixed(2)}</td>
      <td>${p.discount}%</td>
      <td style="font-weight:700; color:${stockColor};">${p.stock} units</td>
      <td>${p.prescriptionRequired ? '<span class="badge badge-danger">Rx Needed</span>' : '<span class="badge badge-success">OTC</span>'}</td>
      <td>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-outline" style="padding:4px 8px; font-size:0.75rem;" onclick="openAdminProductFormModal('${p.id}')">Edit</button>
          <button class="btn btn-outline" style="padding:4px 8px; font-size:0.75rem; color:var(--danger); border-color:var(--border);" onclick="adminDeleteProduct('${p.id}')">Delete</button>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function adminDeleteProduct(id) {
  if (confirm("Are you sure you want to permanently delete this product from the catalog?")) {
    state.products = state.products.filter(p => p.id !== id);
    saveLocalStorage();
    renderAdmin("admin-products");
  }
}

function renderAdminOrdersTable() {
  const tbody = document.getElementById("admin-orders-table-body");
  tbody.innerHTML = "";

  state.orders.forEach(order => {
    const row = document.createElement("tr");

    let rxColHTML = `<span class="badge badge-success">OTC Order</span>`;
    if (order.prescriptionUrl) {
      const pres = state.prescriptions.find(r => r.orderId === order.id);
      if (pres && pres.status === "Approved") {
        rxColHTML = `<span class="badge badge-success">Rx Approved</span>`;
      } else if (pres && pres.status.includes("Rejected")) {
        rxColHTML = `<span class="badge badge-danger">Rx Rejected</span>`;
      } else {
        rxColHTML = `<button class="btn btn-primary btn-outline" style="padding:6px 12px; font-size:0.75rem;" onclick="openAdminPrescriptionValidationModal('${order.id}')"><i data-lucide="shield-alert"></i> Verify RX</button>`;
      }
    }

    let statusSelectHTML = `
      <select class="sort-select" style="padding:4px 8px; font-size:0.8rem;" onchange="adminUpdateOrderStatus('${order.id}', this.value)">
        <option value="Verification Pending" ${order.status === "Verification Pending" ? "selected" : ""}>Pending Verify</option>
        <option value="Processing" ${order.status === "Processing" ? "selected" : ""}>Processing</option>
        <option value="Shipped" ${order.status === "Shipped" ? "selected" : ""}>Shipped</option>
        <option value="Delivered" ${order.status === "Delivered" ? "selected" : ""}>Delivered</option>
        <option value="Cancelled" ${order.status === "Cancelled" ? "selected" : ""}>Cancelled</option>
      </select>
    `;

    row.innerHTML = `
      <td style="font-weight:700;">${order.id}</td>
      <td>
        <h4 style="font-size:0.85rem; font-weight:700;">${order.address.fullname}</h4>
        <span style="font-size:0.7rem; color:var(--text-muted);">${order.address.phone}</span>
      </td>
      <td style="font-weight:800; color:var(--primary);">₹${order.total.toFixed(2)}</td>
      <td>${order.paymentMethod}</td>
      <td>${order.date}</td>
      <td>${rxColHTML}</td>
      <td>${statusSelectHTML}</td>
      <td>
        <button class="btn btn-outline" style="padding:4px 8px; font-size:0.75rem;" onclick="adminViewInvoiceDetails('${order.id}')">View Items</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function adminViewInvoiceDetails(orderId) {
  const order = state.orders.find(o => o.id === orderId);
  if (!order) return;

  let invoiceItems = order.items.map(item => `
    <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--border); padding:8px 0;">
      <span>${item.product.name} (x${item.quantity})</span>
      <span style="font-weight:700;">₹${(item.product.price * item.quantity).toFixed(2)}</span>
    </div>
  `).join("");

  alert(`Order ID: ${orderId}\nItems Details:\n${order.items.map(i => `- ${i.product.name} [x${i.quantity}] - ₹${i.product.price.toFixed(2)}`).join("\n")}\n\nTotal Paid: ₹${order.total.toFixed(2)}`);
}

function adminUpdateOrderStatus(orderId, nextStatus) {
  const order = state.orders.find(o => o.id === orderId);
  if (order) {
    order.status = nextStatus;
    
    let step = 1;
    if (nextStatus === "Verification Pending") step = 2;
    if (nextStatus === "Processing") step = 2;
    if (nextStatus === "Shipped") step = 3;
    if (nextStatus === "Delivered") step = 4;
    order.trackingStep = step;

    // Send notifications to user dashboard
    const userNotif = {
      id: `notif-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      title: `Order Status: ${nextStatus}`,
      message: `Your Order ${orderId} status has been updated to ${nextStatus}.`,
      read: false
    };
    state.notifications.unshift(userNotif);

    saveLocalStorage();
    renderAdmin("admin-orders");
    alert(`Order ${orderId} updated to status "${nextStatus}" successfully.`);
  }
}

function openAdminPrescriptionValidationModal(orderId) {
  const order = state.orders.find(o => o.id === orderId);
  if (!order) return;

  const modal = document.getElementById("admin-rx-viewer-modal");
  const imgTarget = document.getElementById("admin-rx-image-target");
  
  imgTarget.innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:40px 0; color:var(--danger); background:var(--danger-light);">
      <i data-lucide="file-text" style="width:64px; height:64px; margin-bottom:12px;"></i>
      <h3 style="color:var(--text-primary);">${order.prescriptionUrl}</h3>
      <p style="font-size:0.8rem; color:var(--text-secondary); margin-top:8px;">Order Ref: ${orderId}</p>
      <span class="badge badge-danger" style="margin-top:12px;">Unverified RX Document</span>
    </div>
  `;

  // Bind Actions
  const approveBtn = document.getElementById("admin-rx-approve-btn");
  const rejectBtn = document.getElementById("admin-rx-reject-btn");

  // Show standard action row
  modal.querySelector("div[style*='display:flex']").style.display = "flex";

  approveBtn.onclick = () => {
    // Approve Prescription
    const pres = state.prescriptions.find(r => r.orderId === orderId);
    if (pres) pres.status = "Approved";
    
    order.status = "Processing";
    order.trackingStep = 2;

    const notif = {
      id: `notif-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      title: "Prescription Approved",
      message: `Your prescription document for Order ${orderId} has been verified and approved by the Abhay Pharma pharmacy desk.`,
      read: false
    };
    state.notifications.unshift(notif);

    saveLocalStorage();
    modal.classList.remove("active");
    renderAdmin("admin-orders");
    showToast("Prescription Approved! Order moved to Packing/Processing queue.", "success");
  };

  rejectBtn.onclick = () => {
    // Reject Prescription
    const pres = state.prescriptions.find(r => r.orderId === orderId);
    if (pres) pres.status = "Rejected";
    
    order.status = "Cancelled (Rx Rejected)";
    order.trackingStep = 1;

    const notif = {
      id: `notif-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      title: "Order Cancelled - Prescription Rejected",
      message: `We were unable to verify your prescription for Order ${orderId}. The order has been cancelled.`,
      read: false
    };
    state.notifications.unshift(notif);

    saveLocalStorage();
    modal.classList.remove("active");
    renderAdmin("admin-orders");
    showToast("Prescription Rejected. Order has been cancelled.", "warning");
  };

  modal.classList.add("active");
  lucide.createIcons();
}

function renderAdminCustomersTable() {
  const tbody = document.getElementById("admin-customers-table-body");
  tbody.innerHTML = "";

  // Mock users
  const users = [
    { name: "John Smith", email: "john.smith@gmail.com", phone: "+1 (555) 982-1234", addresses: state.userProfile.addresses.length, orders: state.orders.length },
    { name: "Sarah Jenkins", email: "sarah.j@gmail.com", phone: "+1 (555) 345-0982", addresses: 1, orders: 1 },
    { name: "Robert Taylor", email: "rtaylor@outlook.com", phone: "+1 (555) 123-9087", addresses: 2, orders: 1 }
  ];

  users.forEach(u => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td style="font-weight:700;">${u.name}</td>
      <td>${u.email}</td>
      <td>${u.phone}</td>
      <td>${u.addresses} address profiles</td>
      <td style="font-weight:700; color:var(--primary);">${u.orders} orders placed</td>
    `;
    tbody.appendChild(row);
  });
}

function openAdminProductFormModal(productId = null) {
  const modal = document.getElementById("admin-product-form-modal");
  const title = document.getElementById("admin-prod-modal-title");
  
  if (productId) {
    title.innerText = "Edit Product Details";
    const prod = state.products.find(p => p.id === productId);
    if (prod) {
      document.getElementById("ap-id").value = prod.id;
      document.getElementById("ap-name").value = prod.name;
      document.getElementById("ap-brand").value = prod.brand;
      document.getElementById("ap-price").value = prod.price;
      document.getElementById("ap-discount").value = prod.discount ?? 0;
      document.getElementById("ap-stock").value = prod.stock ?? 100;
      document.getElementById("ap-image").value = prod.image;
      document.getElementById("ap-desc").value = prod.description;

      // Fix: Set category select to match product's category value
      const catSelect = document.getElementById("ap-category");
      if (catSelect) {
        // Try exact match first, then case-insensitive
        let matched = false;
        for (let i = 0; i < catSelect.options.length; i++) {
          if (catSelect.options[i].value === prod.category) {
            catSelect.selectedIndex = i;
            matched = true;
            break;
          }
        }
        // If no exact match, try case-insensitive
        if (!matched) {
          for (let i = 0; i < catSelect.options.length; i++) {
            if (catSelect.options[i].value.toLowerCase() === (prod.category || "").toLowerCase()) {
              catSelect.selectedIndex = i;
              break;
            }
          }
        }
      }

      // Fix: Set Rx Required select to match product's prescriptionRequired value
      const rxSelect = document.getElementById("ap-rx");
      if (rxSelect) {
        rxSelect.value = prod.prescriptionRequired ? "true" : "false";
      }
    }
  } else {
    title.innerText = "Add New Product to Catalog";
    document.getElementById("ap-id").value = "";
    document.getElementById("ap-name").value = "";
    document.getElementById("ap-brand").value = "";
    document.getElementById("ap-price").value = "";
    document.getElementById("ap-discount").value = 0;
    document.getElementById("ap-stock").value = 100;
    document.getElementById("ap-image").value = "";
    document.getElementById("ap-desc").value = "";
    // Reset selects to defaults for new product
    const catSelect = document.getElementById("ap-category");
    if (catSelect) catSelect.selectedIndex = 0;
    const rxSelect = document.getElementById("ap-rx");
    if (rxSelect) rxSelect.value = "false";
  }

  modal.classList.add("active");
  lucide.createIcons();
}

function adminSaveProductItem() {
  const id = document.getElementById("ap-id").value;
  const name = document.getElementById("ap-name").value.trim();
  const brand = document.getElementById("ap-brand").value.trim();
  const price = parseFloat(document.getElementById("ap-price").value);
  const discount = parseInt(document.getElementById("ap-discount").value);
  const stock = parseInt(document.getElementById("ap-stock").value);
  const category = document.getElementById("ap-category").value;
  const rx = document.getElementById("ap-rx").value === "true";
  const image = document.getElementById("ap-image").value.trim();
  const desc = document.getElementById("ap-desc").value.trim();

  if (!name || !brand || isNaN(price) || !image || !desc) {
    showToast("Please fill in all the required product specifications.", "warning");
    return;
  }

  if (id) {
    // Edit existing product
    const prod = state.products.find(p => p.id === id);
    if (prod) {
      prod.name = name;
      prod.brand = brand;
      prod.price = price;
      prod.discount = discount;
      prod.stock = stock;
      prod.category = category;
      prod.prescriptionRequired = rx;
      prod.image = image;
      prod.description = desc;
    }
  } else {
    // Add new product
    const newProd = {
      id: `p-${Date.now()}`,
      name,
      brand,
      price,
      discount,
      rating: 5.0,
      reviewsCount: 1,
      description: desc,
      category,
      image,
      prescriptionRequired: rx,
      stock
    };
    state.products.unshift(newProd);
  }

  saveLocalStorage();
  populateCategoryDropdown();
  document.getElementById("admin-product-form-modal").classList.remove("active");
  renderAdmin("admin-products");
  showToast("Product saved and published to live catalog successfully.", "success");
}

// ====================================================
// 14. ADVANCED FEATURE: VOICE SEARCH ENGINE
// ====================================================
let recognition = null;
function startVoiceSearch() {
  const overlay = document.getElementById("voice-search-overlay-element");
  const transcriptText = document.getElementById("voice-listening-transcript");

  // Check browser API support
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    showToast("Voice search requires Chrome or Edge browser. Please type to search.", "warning");
    return;
  }

  // If already listening, stop first
  if (recognition) {
    stopVoiceSearch();
    return;
  }

  // Show overlay immediately so user gets instant feedback
  overlay.classList.add("active");
  transcriptText.innerText = "Starting microphone... please allow mic access.";

  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = "en-IN";
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    transcriptText.innerText = "🎙️ Listening... Speak the name of a medicine or brand.";
  };

  recognition.onerror = (e) => {
    console.error("Speech Recognition Error:", e.error);
    if (e.error === "not-allowed" || e.error === "service-not-allowed") {
      transcriptText.innerText = "❌ Microphone access denied. Please allow mic in browser settings.";
      showToast("Mic permission denied. Allow microphone access in your browser.", "danger");
    } else if (e.error === "no-speech") {
      transcriptText.innerText = "No speech detected. Tap the mic again to retry.";
    } else if (e.error === "network") {
      transcriptText.innerText = "Network error. Voice search needs an internet connection.";
    } else if (e.error === "audio-capture") {
      transcriptText.innerText = "No microphone found. Please connect a mic and retry.";
    } else {
      transcriptText.innerText = "Error: " + e.error + ". Please try again.";
    }
    setTimeout(stopVoiceSearch, 2500);
  };

  recognition.onresult = (e) => {
    let transcript = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      transcript += e.results[i][0].transcript;
    }
    if (e.results[e.results.length - 1].isFinal) {
      const finalText = transcript.trim();
      transcriptText.innerText = `✅ Searching for: "${finalText}"`;
      setTimeout(() => {
        document.getElementById("global-search-input").value = finalText;
        stopVoiceSearch();
        navigate("shop-view", { search: finalText });
      }, 1000);
    } else {
      transcriptText.innerText = `🎙️ Hearing: "${transcript}"`;
    }
  };

  recognition.onend = () => {
    // If overlay is still active and in a "listening" state with no result, auto-close
    const currentText = transcriptText.innerText;
    if (overlay.classList.contains("active") && 
        (currentText.includes("Listening") || currentText.includes("Starting"))) {
      transcriptText.innerText = "No speech detected. Tap the mic again to retry.";
      setTimeout(stopVoiceSearch, 2000);
    }
  };

  try {
    recognition.start();
  } catch (err) {
    console.error("Could not start voice recognition:", err);
    transcriptText.innerText = "Could not start voice search. Please try again.";
    recognition = null;
    setTimeout(stopVoiceSearch, 2000);
  }
}

function stopVoiceSearch() {
  if (recognition) {
    recognition.stop();
    recognition = null;
  }
  document.getElementById("voice-search-overlay-element").classList.remove("active");
}

// ====================================================
// 15. ADVANCED FEATURE: AUTOCOMPLETE SEARCH SUGGESTIONS
// ====================================================
function handleSearchSuggestions() {
  const q = document.getElementById("global-search-input").value.toLowerCase().trim();
  const suggestionsBox = document.getElementById("global-search-suggestions");

  if (!q) {
    suggestionsBox.style.display = "none";
    return;
  }

  const matches = state.products.filter(p => {
    const nameMatch = p.name.toLowerCase().includes(q);
    const brandMatch = p.brand.toLowerCase().includes(q);
    const compMatch = p.composition && p.composition.toLowerCase().includes(q);
    return nameMatch || brandMatch || compMatch;
  }).slice(0, 5);

  if (matches.length === 0) {
    suggestionsBox.style.display = "none";
    return;
  }

  suggestionsBox.innerHTML = "";
  suggestionsBox.style.display = "block";

  matches.forEach(prod => {
    const item = document.createElement("div");
    item.className = "suggestion-item";
    item.innerHTML = `
      <img src="${prod.image}" alt="">
      <div class="suggestion-info">
        <div class="suggestion-name">${prod.name}</div>
        <div class="suggestion-brand">${prod.brand} | In ${prod.category}</div>
      </div>
      <div class="suggestion-price">₹${prod.price.toFixed(2)}</div>
    `;

    item.addEventListener("click", () => {
      suggestionsBox.style.display = "none";
      document.getElementById("global-search-input").value = prod.name;
      navigate("details-view", prod.id);
    });

    suggestionsBox.appendChild(item);
  });
}

// ====================================================
// 16. ADVANCED FEATURE: PRODUCT COMPARISON MATRIX
// ====================================================
function toggleProductComparison(product) {
  const exists = state.comparisonList.find(p => p.id === product.id);
  
  if (exists) {
    state.comparisonList = state.comparisonList.filter(p => p.id !== product.id);
  } else {
    if (state.comparisonList.length >= 3) {
      showToast("You can compare up to 3 products at a time.", "warning");
      return;
    }
    state.comparisonList.push(product);
  }

  updateComparisonFloatingBar();
}

function updateComparisonFloatingBar() {
  const bar = document.getElementById("comparison-floating-bar");
  const countNum = document.getElementById("comp-count-num");
  const selectedRow = document.getElementById("comp-selected-row");

  countNum.innerText = state.comparisonList.length;

  if (state.comparisonList.length === 0) {
    bar.classList.remove("active");
    return;
  }

  bar.classList.add("active");
  selectedRow.innerHTML = "";

  state.comparisonList.forEach(prod => {
    const bubble = document.createElement("div");
    bubble.className = "comp-selected-item";
    bubble.innerHTML = `
      <img src="${prod.image}" alt="">
      <span>${prod.name.split(" ").slice(0,2).join(" ")}</span>
      <span class="comp-remove">&times;</span>
    `;

    bubble.querySelector(".comp-remove").addEventListener("click", () => {
      toggleProductComparison(prod);
    });

    selectedRow.appendChild(bubble);
  });
}

function clearComparisonList() {
  state.comparisonList = [];
  updateComparisonFloatingBar();
}

function openComparisonModal() {
  if (state.comparisonList.length < 2) {
    showToast("Please select at least 2 products to compare.", "warning");
    return;
  }

  const modal = document.getElementById("product-comparison-modal");
  const table = document.getElementById("comparison-matrix-table");
  table.innerHTML = "";

  // Build matrix rows
  const headerRow = document.createElement("tr");
  headerRow.innerHTML = `<th>Specification</th>` + state.comparisonList.map(p => `
    <th style="text-align:center;">
      <img src="${p.image}" alt="" style="width:80px; height:80px; border-radius:var(--radius-md); margin:0 auto 10px; display:block;">
      <strong>${p.name}</strong>
      <div style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">${p.brand}</div>
    </th>
  `).join("");
  table.appendChild(headerRow);

  const rows = [
    { label: "Category", key: "category" },
    { label: "Price (₹)", key: "price", render: (p) => `₹${p.price.toFixed(2)}` },
    { label: "Rating", key: "rating", render: (p) => `★ ${p.rating} (${p.reviewsCount} reviews)` },
    { label: "Clinical Ingredients", key: "composition", render: (p) => p.composition || "Standard" },
    { label: "Prescription Need", key: "prescriptionRequired", render: (p) => p.prescriptionRequired ? "YES (Required)" : "NO (OTC)" },
    { label: "Benefits", key: "benefits", render: (p) => p.benefits || "Standard therapeutic health booster" },
    { label: "Buy Action", key: "buy", render: (p) => `
      <button class="btn btn-primary" style="padding:6px 12px; font-size:0.75rem;" onclick="buyComparedProductDirectly('${p.id}')">Add To Cart</button>
    ` }
  ];

  rows.forEach(spec => {
    const tr = document.createElement("tr");
    let specCells = `<td><strong>${spec.label}</strong></td>`;
    
    state.comparisonList.forEach(p => {
      const val = spec.render ? spec.render(p) : p[spec.key];
      specCells += `<td style="text-align:center;">${val}</td>`;
    });

    tr.innerHTML = specCells;
    table.appendChild(tr);
  });

  modal.classList.add("active");
  lucide.createIcons();
}

function buyComparedProductDirectly(id) {
  const prod = state.products.find(p => p.id === id);
  if (prod) {
    addToCart(prod, 1);
    document.getElementById("product-comparison-modal").classList.remove("active");
  }
}

// ====================================================
// 17. ADVANCED FEATURE: PRESCRIPTION ENFORCER & UPLOAD
// ====================================================
function openPrescriptionModal() {
  document.getElementById("modal-rx-uploaded-files").innerHTML = "";
  document.getElementById("prescription-upload-modal").classList.add("active");
  renderUploadedPrescriptionsList("modal-rx-uploaded-files");
}

function setupPrescriptionDropzones() {
  const setup = (dropzoneId, inputId, listId) => {
    const dz = document.getElementById(dropzoneId);
    const inp = document.getElementById(inputId);

    if (!dz || !inp) return;

    dz.addEventListener("click", () => inp.click());
    
    inp.addEventListener("click", (e) => {
      e.stopPropagation();
    });
    
    dz.addEventListener("dragover", (e) => {
      e.preventDefault();
      dz.style.borderColor = "var(--primary)";
    });
    dz.addEventListener("dragleave", () => {
      dz.style.borderColor = "var(--border)";
    });
    dz.addEventListener("drop", (e) => {
      e.preventDefault();
      dz.style.borderColor = "var(--border)";
      if (e.dataTransfer.files.length > 0) {
        handlePrescriptionUpload(e.dataTransfer.files[0], listId);
      }
    });

    inp.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        handlePrescriptionUpload(e.target.files[0], listId);
      }
    });
  };

  setup("checkout-rx-dropzone", "rx-file-input", "checkout-rx-uploaded-files");
  setup("modal-rx-dropzone", "modal-rx-file-input", "modal-rx-uploaded-files");

  // General header prescription modal submit button
  document.getElementById("modal-rx-submit-btn").onclick = () => {
    if (state.uploadedRxFiles.length === 0) {
      showToast("Please upload a prescription document first.", "warning");
      return;
    }

    const rxRecord = {
      id: `rx-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split("T")[0],
      fileName: state.uploadedRxFiles[0].name,
      orderId: null,
      status: "Assessment Pending"
    };

    state.prescriptions.unshift(rxRecord);

    const notif = {
      id: `notif-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      title: "Prescription Submitted for Assessment",
      message: `Your prescription ${state.uploadedRxFiles[0].name} has been received. Our clinical pharmacist will contact you shortly to suggest therapeutics.`,
      read: false
    };
    state.notifications.unshift(notif);

    state.uploadedRxFiles = [];
    saveLocalStorage();
    document.getElementById("prescription-upload-modal").classList.remove("active");
    showToast("Prescription Submitted Successfully! Licensed pharmacists will review and notify you shortly.", "success");
  };
}

function handlePrescriptionUpload(file, listContainerId) {
  // Save file locally in memory state
  state.uploadedRxFiles = [{ name: file.name, size: file.size }];
  
  // Render details
  renderUploadedPrescriptionsList(listContainerId);
  showToast(`Uploaded: ${file.name} successfully.`, "success");
}

function renderUploadedPrescriptionsList(listId) {
  const container = document.getElementById(listId);
  if (!container) return;

  container.innerHTML = "";
  state.uploadedRxFiles.forEach(file => {
    const item = document.createElement("div");
    item.className = "pres-file-item";
    item.innerHTML = `
      <span style="font-weight:600;"><i data-lucide="file" style="width:14px; display:inline-block; vertical-align:middle; margin-right:4px;"></i> ${file.name} (${(file.size / 1024).toFixed(1)} KB)</span>
      <span style="cursor:pointer; color:var(--danger); font-weight:800;" onclick="removeUploadedRxFile('${listId}')">&times;</span>
    `;
    container.appendChild(item);
  });

  lucide.createIcons();
}

function removeUploadedRxFile(listId) {
  state.uploadedRxFiles = [];
  renderUploadedPrescriptionsList(listId);
}

// ====================================================
// 18. ADVANCED FEATURE: STORE LOCATOR MAP (LEAFLET)
// ====================================================
function openLocatorModal() {
  const modal = document.getElementById("pharmacy-locator-modal");
  modal.classList.add("active");

  // Populate sidebar stores list
  const sidebar = document.getElementById("locator-stores-sidebar");
  sidebar.innerHTML = "";
  STORES.forEach(store => {
    const card = document.createElement("div");
    card.style.background = "var(--bg-secondary)";
    card.style.border = "1.5px solid var(--border)";
    card.style.borderRadius = "var(--radius-md)";
    card.style.padding = "12px";
    card.style.cursor = "pointer";
    card.innerHTML = `
      <h4 style="font-size:0.85rem; font-weight:700; color:var(--primary);">${store.name}</h4>
      <p style="font-size:0.75rem; color:var(--text-secondary); margin-top:4px;">${store.address}</p>
      <p style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">Phone: ${store.phone}</p>
      <span class="badge badge-success" style="margin-top:6px; font-size:0.65rem;">${store.hours}</span>
    `;

    card.addEventListener("click", () => {
      zoomToStoreLocation(store);
    });

    sidebar.appendChild(card);
  });

  // Initialize Map canvas async (lets browser set sizes first)
  setTimeout(() => {
    initializeLeafletLocatorMap();
  }, 300);
}

function initializeLeafletLocatorMap() {
  if (state.locatorMap) {
    state.locatorMap.invalidateSize();
    return;
  }

  // Centered on Bandikui, Rajasthan mock cluster
  state.locatorMap = L.map("locator-leaflet-map").setView([27.0409, 76.7118], 9);

  // Set standard OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(state.locatorMap);

  // Add markers
  STORES.forEach(store => {
    const marker = L.marker([store.lat, store.lng]).addTo(state.locatorMap);
    
    // Popup
    marker.bindPopup(`
      <strong style="color:var(--primary);">${store.name}</strong><br>
      <span style="font-size:0.75rem; color:var(--text-secondary);">${store.address}</span><br>
      <span style="font-size:0.75rem;">Hours: ${store.hours}</span>
    `);

    state.locatorMarkers[store.id] = marker;
  });

  state.locatorMap.invalidateSize();
}

function zoomToStoreLocation(store) {
  if (state.locatorMap) {
    state.locatorMap.setView([store.lat, store.lng], 14);
    const marker = state.locatorMarkers[store.id];
    if (marker) {
      marker.openPopup();
    }
  }
}

// ====================================================
// 19. ADVANCED FEATURE: AI PHARMACIST LIVE CHAT WIDGET
// ====================================================
function toggleLiveChatPanel() {
  const panel = document.getElementById("chat-widget-panel");
  const openIcon = document.getElementById("chat-open-icon");
  const closeIcon = document.getElementById("chat-close-icon");

  const isActive = panel.classList.toggle("active");
  if (isActive) {
    openIcon.style.display = "none";
    closeIcon.style.display = "block";
    // scroll to bottom
    const body = document.getElementById("chat-conversation-body");
    body.scrollTop = body.scrollHeight;
  } else {
    openIcon.style.display = "block";
    closeIcon.style.display = "none";
  }
}

function triggerChatUserMessage() {
  const inp = document.getElementById("chat-message-input");
  const text = inp.value.trim();
  if (!text) return;

  inp.value = "";

  // Append user bubble
  appendChatBubble(text, "msg-user");

  // Simulate pharmacist analysis response after brief lag
  setTimeout(() => {
    generatePharmacistResponse(text);
  }, 1000);
}

function appendChatBubble(message, bubbleClass) {
  const body = document.getElementById("chat-conversation-body");
  const bubble = document.createElement("div");
  bubble.className = `chat-msg ${bubbleClass}`;
  bubble.innerText = message;
  body.appendChild(bubble);
  body.scrollTop = body.scrollHeight;
}

function generatePharmacistResponse(userText) {
  const t = userText.toLowerCase();
  let reply = "I'm sorry, I didn't quite capture that. You can ask about medicines (e.g. 'Dolo', 'Paracetamol'), check 'delivery' times, or inquire if prescriptions are required.";

  if (t.includes("hello") || t.includes("hi ") || t.includes("hey")) {
    reply = "Hello! I am Dr. Abhay, your virtual clinical assistant. How can I help you choose the right therapeutics today?";
  } else if (t.includes("dolo") || t.includes("paracetamol") || t.includes("crocin")) {
    reply = "Dolo 650 & Crocin contain Paracetamol, which acts as an antipyretic (fever-reducer) and painkiller. The recommended adult dosage is 1 tablet every 4-6 hours. Avoid alcohol to protect your liver.";
  } else if (t.includes("delivery") || t.includes("shipping") || t.includes("transit")) {
    reply = "We offer 2-hour express delivery for local areas in Rajasthan on orders completed before 08:00 PM. Delivery is free for orders above ₹1000.00.";
  } else if (t.includes("prescription") || t.includes("rx")) {
    reply = "Medicines marked with the red 'Rx Required' badge require uploading a medical prescription signed by a doctor. You can upload it during checkout.";
  } else if (t.includes("glucometer") || t.includes("bp monitor") || t.includes("devices")) {
    reply = "We stock certified digital monitors from Omron and Accu-Chek. They carry 1-year brand warranty card and do not require prescription authorization.";
  } else if (t.includes("side effect")) {
    reply = "Most OTC medicines have low side effects if taken in recommended doses. General antibiotics might cause mild nausea. Consult a physician for chronic symptoms.";
  }

  appendChatBubble(reply, "msg-bot");
  lucide.createIcons();
}

// ====================================================
// 20. MODALS: PRODUCT QUICK VIEW POPUP
// ====================================================
function openQuickViewModal(product) {
  const modal = document.getElementById("product-quick-view-modal");
  const target = document.getElementById("quick-view-modal-body-target");

  const discountLabel = product.discount > 0 ? `<span class="badge badge-warning">-${product.discount}%</span>` : "";
  const rxRequired = product.prescriptionRequired ? `<span class="badge badge-danger">Rx Required</span>` : `<span class="badge badge-success">OTC</span>`;

  target.innerHTML = `
    <div class="quickview-layout">
      <div style="border:1px solid var(--border); border-radius:var(--radius-lg); overflow:hidden; height:260px; background:#f8fafc;">
        <img src="${product.image}" alt="" style="width:100%; height:100%; object-fit:cover;">
      </div>
      <div style="display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <span style="font-size:0.75rem; font-weight:700; color:var(--primary); text-transform:uppercase;">${product.brand}</span>
          <h2 style="font-size:1.4rem; margin-top:4px; margin-bottom:8px;">${product.name}</h2>
          <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
            <div class="stars" style="color:var(--accent);">${renderRatingStars(product.rating)}</div>
            ${rxRequired}
          </div>
          <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.5;">${product.description.split(".").slice(0, 2).join(".")}.</p>
        </div>
        
        <div style="margin-top:20px; border-top:1px solid var(--border); padding-top:16px;">
          <div style="display:flex; align-items:baseline; gap:10px; margin-bottom:12px;">
            <span style="font-size:1.5rem; font-weight:800; color:var(--primary);">₹${product.price.toFixed(2)}</span>
            ${discountLabel}
          </div>
          <div style="display:flex; gap:12px;">
            <button class="btn btn-primary" id="qv-add-cart-btn" style="flex:1;"><i data-lucide="shopping-cart"></i> Add to Cart</button>
            <button class="btn btn-outline" id="qv-full-details-btn" style="flex:1;">Full Specifications</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Bind
  document.getElementById("qv-add-cart-btn").onclick = () => {
    addToCart(product, 1);
    modal.classList.remove("active");
  };
  document.getElementById("qv-full-details-btn").onclick = () => {
    modal.classList.remove("active");
    navigate("details-view", product.id);
  };

  modal.classList.add("active");
  lucide.createIcons();
}

// ====================================================
// 21. REAL-TIME STORAGE EVENT SYNC LISTENER
// ====================================================
window.addEventListener('storage', (e) => {
  const syncKeys = ["abhay_products", "abhay_orders", "abhay_prescriptions", "abhay_profile", "abhay_notifications", "abhay_theme", "abhay_wishlist", "abhay_cart"];
  if (syncKeys.includes(e.key)) {
    loadLocalStorage();
    updateHeaderCounters();
    
    // Re-render the active view
    if (state.activeView === "home-view") {
      renderHome();
    } else if (state.activeView === "shop-view") {
      renderShop();
    } else if (state.activeView === "details-view") {
      if (state.selectedProduct) {
        const updatedProd = state.products.find(p => p.id === state.selectedProduct.id);
        if (updatedProd) {
          state.selectedProduct = updatedProd;
          renderProductDetails(updatedProd);
        }
      }
    } else if (state.activeView === "cart-view") {
      renderCart();
    } else if (state.activeView === "checkout-view") {
      renderCheckout();
    } else if (state.activeView === "dashboard-view") {
      renderDashboard(state.activeDbTab);
    } else if (state.activeView === "admin-view") {
      updateAdminHeaderBadge();
      renderAdmin(state.activeAdminPane);
    }
  }
});
