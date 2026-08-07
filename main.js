const TOTAL_FRAMES = 240;
const FOLDER_PATH = './ezgif-3d03b2c92e784f15-jpg';
const canvas = document.getElementById('scroll-canvas');
const ctx = canvas.getContext('2d');
const loader = document.getElementById('loader');
const loaderText = document.getElementById('loader-text');

const images = [];
let loadedCount = 0;
let targetFrame = 0;
let currentFrame = 0;

// Portfolio Items Data (15 files from Portofolio folder) - All with WordPress in tags
const portfolioItems = [
  {
    num: "01",
    title: "ANUGERAH TEKNIK SIDOARJO",
    category: "Web Development & Booking System",
    image: "./assets/web anugerah.png",
    description: "Website resmi company profile dan sistem booking service AC untuk Anugerah Teknik Sidoarjo. Dilengkapi fitur formulir reservasi perawatan online, katalog pengadaan unit AC terbaru, dan integrasi tombol pesan WhatsApp langsung.",
    tags: ["WordPress", "PHP", "JavaScript", "HTML5", "CSS3", "WhatsApp API"]
  },
  {
    num: "02",
    title: "ZAFARI TOUR & TRAVEL",
    category: "Tour & Travel Web Platform",
    image: "./assets/web zafari.png",
    description: "Platform agen perjalanan dan bisnis ekowisata alam Zafari Transport Solutions. Menampilkan katalog paket wisata gunung, pantai, dan pemesanan tiket perjalanan langsung secara responsif.",
    tags: ["WordPress", "PHP", "Tailwind CSS", "JavaScript"]
  },
  {
    num: "03",
    title: "PT. CAHAYA BANGUN PERKASA",
    category: "Contractor Company Profile",
    image: "./assets/Cahaya Bangun.jpg",
    description: "Website profil perusahaan bidang perdagangan umum dan kontraktor konstruksi PT. Cahaya Bangun Perkasa. Menampilkan galeri proyek, daftar layanan unggulan, dan informasi kontak kantor lengkap.",
    tags: ["WordPress", "Web Builder", "HTML5", "CSS3", "SEO Optimization"]
  },
  {
    num: "04",
    title: "BRAND MERCHANDISE KATALOG",
    category: "UI/UX & Product Design",
    image: "./assets/20240120_095835.jpg",
    description: "Perancangan tata letak dan desain visual untuk katalog produk merchandise eksklusif perusahaan. Berfokus pada presentasi produk yang bersih dan estetika visual modern.",
    tags: ["WordPress", "Figma", "Photoshop", "UI/UX Design"]
  },
  {
    num: "05",
    title: "CORPORATE BRANDING & ASSETS",
    category: "Graphic & Web Identity",
    image: "./assets/20240120_100021.jpg",
    description: "Desain identitas brand korporat beserta manajemen aset dokumen digital dan tata letak materi promosi untuk kebutuhan komunikasi bisnis.",
    tags: ["WordPress", "Illustrator", "Document Management", "Branding"]
  },
  {
    num: "06",
    title: "PRODUCT SHOWCASE & FLYER",
    category: "Content Management",
    image: "./assets/20240120_100300.jpg",
    description: "Pengelolaan konten visual produk dan promosi pemasaran digital untuk meningkatkan keterlibatan pelanggan pada platform online.",
    tags: ["WordPress", "Content Management", "Figma", "Canva"]
  },
  {
    num: "07",
    title: "INTERNAL ADMINISTRATION SYSTEM",
    category: "System & Database Admin",
    image: "./assets/20240120_134910.jpg",
    description: "Perancangan antarmuka dan pengelolaan sistem administrasi data internal serta kontrol hak akses pengguna perusahaan.",
    tags: ["WordPress", "User Access Management", "Database Admin", "Data Verification"]
  },
  {
    num: "08",
    title: "REPORT PREPARATION SYSTEM",
    category: "Data & Document Management",
    image: "./assets/20240202_083546.jpg",
    description: "Pengolahan data verifikasi dan penyusunan laporan administrasi berbasis Microsoft Office dan tools manajemen web.",
    tags: ["WordPress", "Microsoft Excel", "Microsoft Word", "Report Preparation"]
  },
  {
    num: "09",
    title: "DIGITAL DASHBOARD INTERFACE",
    category: "UI/UX Design",
    image: "./assets/20240207_093207.jpg",
    description: "Antarmuka dashboard analitik dengan navigasi yang intuitif, tata letak responsif, dan struktur hirarki data yang rapi untuk pemantauan performa bisnis.",
    tags: ["WordPress", "Figma", "CSS Grid", "UI/UX Design"]
  },
  {
    num: "10",
    title: "ECOMMERCE PRODUCT LAYOUT",
    category: "Web Builder & UI Design",
    image: "./assets/20240207_095254.jpg",
    description: "Perancangan landing page toko online modern dengan integrasi katalog produk responsif dan alur navigasi belanja yang cepat.",
    tags: ["WordPress", "Web Builder", "HTML5", "CSS3", "Figma"]
  },
  {
    num: "11",
    title: "USER ACCESS CONTROL PORTAL",
    category: "Website Administration",
    image: "./assets/20240207_095353.jpg",
    description: "Portal manajemen hak akses pengguna dan administrasi konten web internal perusahaan secara terpusat.",
    tags: ["WordPress", "User Access Management", "Website Admin", "Security"]
  },
  {
    num: "12",
    title: "CORPORATE PROFILE LANDING PAGE",
    category: "Web Maintenance & Builder",
    image: "./assets/20240207_095537.jpg",
    description: "Pengembangan dan pemeliharaan website profil bisnis dengan kinerja cepat, SEO optimal, dan tampilan profesional.",
    tags: ["WordPress", "Website Maintenance", "Website Builder", "SEO"]
  },
  {
    num: "13",
    title: "ANALYTICS & REPORTING PORTAL",
    category: "Data Verification & Admin",
    image: "./assets/20240207_095644.jpg",
    description: "Platform verifikasi data dan penyusunan laporan statistik operasional bisnis secara berkala.",
    tags: ["WordPress", "Database Management", "Report Preparation", "Excel"]
  },
  {
    num: "14",
    title: "BUSINESS AUTOMATION PORTAL",
    category: "Website Maintenance",
    image: "./assets/20240207_095751.jpg",
    description: "Sistem pemeliharaan rutin website dan optimasi manajemen konten digital perusahaan.",
    tags: ["WordPress", "Website Maintenance", "Content Management"]
  },
  {
    num: "15",
    title: "DATA VERIFICATION & ARSIP",
    category: "Administration & Data Entry",
    image: "./assets/WhatsApp Image 2024-02-02 at 08.49.27.jpeg",
    description: "Pengelolaan verifikasi data dan pemutakhiran arsip dokumen digital secara teratur dan presisi tinggi.",
    tags: ["WordPress", "Data Entry", "Data Verification", "Document Management"]
  }
];

function getFramePath(index) {
  const paddedIndex = String(index).padStart(3, '0');
  return `${FOLDER_PATH}/ezgif-frame-${paddedIndex}.jpg`;
}

function preloadImages() {
  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const img = new Image();
    img.src = getFramePath(i);

    img.onload = () => {
      loadedCount++;
      const progress = Math.floor((loadedCount / TOTAL_FRAMES) * 100);
      if (loaderText) {
        loaderText.textContent = `${progress}%`;
      }

      if (loadedCount === 1) {
        render();
      }

      if (loadedCount === TOTAL_FRAMES) {
        onAllLoaded();
      }
    };

    img.onerror = () => {
      console.warn(`Failed to load frame ${i}`);
      loadedCount++;
      if (loadedCount === TOTAL_FRAMES) {
        onAllLoaded();
      }
    };

    images.push(img);
  }
}

function onAllLoaded() {
  setTimeout(() => {
    if (loader) {
      loader.classList.add('loaded');
    }
  }, 200);
}

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  render();
}

function drawImageCover(img) {
  if (!img || !img.complete || !img.naturalWidth) return;

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const imgWidth = img.naturalWidth;
  const imgHeight = img.naturalHeight;

  const imgRatio = imgWidth / imgHeight;
  const canvasRatio = canvasWidth / canvasHeight;

  let drawWidth, drawHeight, offsetX, offsetY;

  if (canvasRatio > imgRatio) {
    drawWidth = canvasWidth;
    drawHeight = canvasWidth / imgRatio;
    offsetX = 0;
    offsetY = (canvasHeight - drawHeight) / 2;
  } else {
    drawWidth = canvasHeight * imgRatio;
    drawHeight = canvasHeight;
    offsetX = (canvasWidth - drawWidth) / 2;
    offsetY = 0;
  }

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

function updateTargetFrame() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const scrollFraction = Math.max(0, Math.min(1, scrollTop / maxScroll));
  targetFrame = scrollFraction * (TOTAL_FRAMES - 1);
}

function render() {
  const frameIndex = Math.round(currentFrame);
  const safeIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, frameIndex));
  if (images[safeIndex]) {
    drawImageCover(images[safeIndex]);
  }
}

function animationLoop() {
  const delta = targetFrame - currentFrame;
  if (Math.abs(delta) > 0.001) {
    currentFrame += delta * 0.08;
    render();
  } else if (currentFrame !== targetFrame) {
    currentFrame = targetFrame;
    render();
  }

  requestAnimationFrame(animationLoop);
}

function handleActiveNav() {
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
  const scrollY = window.scrollY;

  sections.forEach(current => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 140;
    const sectionId = current.getAttribute('id');

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });

      bottomNavItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${sectionId}`) {
          item.classList.add('active');
        }
      });
    }
  });
}

// Render Portfolio Grid Items & Handle Popups
function renderPortfolioGrid() {
  const gridContainer = document.getElementById('portfolio-grid');
  if (!gridContainer) return;

  gridContainer.innerHTML = '';

  portfolioItems.forEach((item, index) => {
    const itemEl = document.createElement('div');
    itemEl.className = 'project-mini-item reveal-card';
    itemEl.style.transitionDelay = `${(index % 6) * 100}ms`;
    itemEl.setAttribute('data-index', index);

    itemEl.innerHTML = `
      <div class="mini-img-preview">
        <img src="${item.image}" alt="${item.title}" loading="lazy">
      </div>
      <span class="proj-num">${item.num}</span>
      <h4 class="proj-name">${item.title}</h4>
      <span class="proj-type">${item.category}</span>
    `;

    itemEl.addEventListener('click', () => openProjectModal(item));
    gridContainer.appendChild(itemEl);
  });
}

// Modal Lightbox Logic
const modal = document.getElementById('project-modal');
const modalImg = document.getElementById('modal-img');
const modalNum = document.getElementById('modal-num');
const modalCategory = document.getElementById('modal-category');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-description');
const modalTags = document.getElementById('modal-tags');
const modalCloseBtn = document.getElementById('modal-close-btn');

function openProjectModal(item) {
  if (!modal) return;

  modalImg.src = item.image;
  modalImg.alt = item.title;
  modalNum.textContent = item.num;
  modalCategory.textContent = item.category;
  modalTitle.textContent = item.title;
  modalDesc.textContent = item.description;

  modalTags.innerHTML = item.tags.map(tag => `<span class="modal-tag-item">${tag}</span>`).join('');

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', closeProjectModal);
}

if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeProjectModal();
    }
  });
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
    closeProjectModal();
  }
});

// White Cat Cursor Follower Logic
function initCatCursor() {
  const catContainer = document.getElementById('cat-cursor');
  if (!catContainer) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let catX = mouseX;
  let catY = mouseY;
  
  let idleTimer = null;
  let movingTimer = null;
  let isMoving = false;
  let isSleepy = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX + 16;
    mouseY = e.clientY + 16;

    // Wake up if sleepy
    if (isSleepy) {
      isSleepy = false;
      catContainer.classList.remove('sleepy');
    }

    // Set moving state
    if (!isMoving) {
      isMoving = true;
      catContainer.classList.add('moving');
    }

    // Reset moving state timer
    clearTimeout(movingTimer);
    movingTimer = setTimeout(() => {
      isMoving = false;
      catContainer.classList.remove('moving');
    }, 150);

    // Reset idle sleepy timer
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      isSleepy = true;
      catContainer.classList.add('sleepy');
      catContainer.classList.remove('moving');
    }, 1200);
  });

  // Hide cat when cursor leaves window
  document.addEventListener('mouseleave', () => {
    catContainer.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    catContainer.style.opacity = '1';
  });

  // Battle Chase Mode when hovering over Robot Showcase Box
  const robotShowcase = document.querySelector('.laptop-showcase-box');

  if (robotShowcase) {
    robotShowcase.addEventListener('mouseenter', () => {
      catContainer.classList.add('scared');
      
      const robotSvgImg = robotShowcase.querySelector('img');
      if (robotSvgImg) {
        robotSvgImg.classList.add('angry');
      }

      // Also target SVG elements inside object/inline if present
      const svgEl = document.getElementById('robot-svg-el');
      if (svgEl) {
        svgEl.classList.add('angry');
      }
    });

    robotShowcase.addEventListener('mouseleave', () => {
      catContainer.classList.remove('scared');

      const robotSvgImg = robotShowcase.querySelector('img');
      if (robotSvgImg) {
        robotSvgImg.classList.remove('angry');
      }

      const svgEl = document.getElementById('robot-svg-el');
      if (svgEl) {
        svgEl.classList.remove('angry');
      }
    });
  }

  // Continuous smooth LERP movement
  function animateCat() {
    catX += (mouseX - catX) * 0.16;
    catY += (mouseY - catY) * 0.16;

    catContainer.style.left = `${catX}px`;
    catContainer.style.top = `${catY}px`;

    requestAnimationFrame(animateCat);
  }

  animateCat();
}

// Event Listeners
window.addEventListener('resize', resizeCanvas);
window.addEventListener('scroll', () => {
  updateTargetFrame();
  handleActiveNav();
  handleScrollEffects();
}, { passive: true });

// Hero Title Word & Letter Reveal
function initHeroTitleReveal() {
  const giantName = document.querySelector('.giant-name');
  if (!giantName) return;

  const rawText = giantName.textContent.trim();
  const words = rawText.split(/\s+/);
  giantName.innerHTML = '';

  let globalCharIndex = 0;

  words.forEach((wordText) => {
    const wordSpan = document.createElement('span');
    wordSpan.className = 'hero-word';

    wordText.split('').forEach((char) => {
      const letterSpan = document.createElement('span');
      letterSpan.className = 'hero-letter';
      letterSpan.textContent = char;
      letterSpan.style.transitionDelay = `${globalCharIndex * 45 + 150}ms`;
      wordSpan.appendChild(letterSpan);
      globalCharIndex++;
    });

    giantName.appendChild(wordSpan);
  });

  setTimeout(() => {
    giantName.classList.add('revealed');
  }, 300);
}

// Text & Heading Scroll Reveal with IntersectionObserver
function initScrollReveal() {
  const elementsToReveal = document.querySelectorAll(
    'h1:not(.giant-name), h2, h3, h4, h5, h6, p, .vertical-tag, .greeting-tag, .stat-col, .freelance-status-pill'
  );

  elementsToReveal.forEach((el) => {
    if (!el.classList.contains('reveal-text')) {
      el.classList.add('reveal-text');
    }
  });

  let lastScrollY = window.scrollY;

  const observer = new IntersectionObserver(
    (entries) => {
      const isScrollDown = window.scrollY >= lastScrollY;
      lastScrollY = window.scrollY;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          entry.target.classList.remove('scroll-up-exit');
        } else if (!isScrollDown && entry.boundingClientRect.top > window.innerHeight * 0.8) {
          entry.target.classList.remove('revealed');
          entry.target.classList.add('scroll-up-exit');
        }
      });
    },
    { threshold: 0.15 }
  );

  elementsToReveal.forEach((el) => observer.observe(el));
}

// Staggered Reveal for Cards & Portfolio Items
function initStaggeredCards() {
  const cardContainers = document.querySelectorAll(
    '.row-2-section, .skills-columns-grid, .services-list-grid, .testimonials-grid, .horizontal-projects-slider, .timeline-list'
  );

  cardContainers.forEach((container) => {
    const children = Array.from(container.children).filter(
      (child) => child.nodeType === 1
    );

    children.forEach((child, index) => {
      child.classList.add('reveal-card');
      child.style.transitionDelay = `${(index % 6) * 100}ms`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.12 }
    );

    children.forEach((child) => observer.observe(child));
  });
}

// Top Scroll Progress Bar & Navbar Scroll Direction Logic
let lastScrollTop = 0;
const progressBar = document.getElementById('scroll-progress-bar');
const navbar = document.querySelector('.navbar');

function handleScrollEffects() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const scrollFraction = Math.max(0, Math.min(1, scrollTop / maxScroll));

  // 1. Progress Bar Update (scaleX)
  if (progressBar) {
    progressBar.style.transform = `scaleX(${scrollFraction})`;
  }

  // 2. Navbar Scroll Direction & Shrink
  if (navbar) {
    if (scrollTop > 50) {
      navbar.classList.add('shrunk');
    } else {
      navbar.classList.remove('shrunk');
    }

    const isScrollingDown = scrollTop > lastScrollTop;

    if (scrollTop > 220) {
      if (isScrollingDown) {
        navbar.classList.add('nav-hidden');
        navbar.classList.remove('nav-visible');
      } else {
        navbar.classList.add('nav-visible');
        navbar.classList.remove('nav-hidden');
      }
    } else {
      navbar.classList.remove('nav-hidden', 'nav-visible');
    }
  }

  lastScrollTop = Math.max(0, scrollTop);
}

// Add Tooltips to Skill items
function initSkillTooltips() {
  const skillItems = document.querySelectorAll('.skill-category li');
  const tooltips = [
    "Domain & Server Admin", "Custom Elementor & Builders", "CMS Setup & Optimization",
    "Security & Update Patrol", "Role Permissions Control",
    "Fast Accurate Data Entry", "Information Validation", "Organized Digital Docs",
    "Database Maintenance", "Analytics Report Prep",
    "Doc Formatting & Specs", "Data Formulas & Charts", "Slide Deck Presentation",
    "Modern Code Editing", "UI/UX Interface Design", "Productivity Suite"
  ];

  skillItems.forEach((item, index) => {
    if (!item.getAttribute('data-tooltip')) {
      item.setAttribute('data-tooltip', tooltips[index % tooltips.length]);
    }
  });
}

// Mobile Navigation Drawer Toggle
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');
  if (!menuBtn || !navLinks) return;

  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    navLinks.classList.toggle('mobile-active');
  });

  const links = navLinks.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('active');
      navLinks.classList.remove('mobile-active');
    });
  });
}

// Initialize All Animation Systems
resizeCanvas();
preloadImages();
updateTargetFrame();
animationLoop();
renderPortfolioGrid();
initCatCursor();
initHeroTitleReveal();
initScrollReveal();
initStaggeredCards();
initSkillTooltips();
initMobileMenu();
handleScrollEffects();


