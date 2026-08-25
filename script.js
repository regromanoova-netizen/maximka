function goNext() {
  window.location.href = 'page2.html';
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.section');
  if (sections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.18 });
    sections.forEach((section) => observer.observe(section));
  }

  const links = document.querySelectorAll('.magazine-nav a, .contents-item');
  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        event.preventDefault();
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  const progressFill = document.querySelector('.progress-fill');
  const progressLabel = document.querySelector('.progress-label');
  const secretTrigger = document.getElementById('secretTrigger');
  const secretSection = document.getElementById('secret');
  const secretClose = document.querySelector('.secret-close');
  const lightboxOverlay = document.querySelector('.lightbox-overlay');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  const lightboxMedia = document.querySelector('.lightbox-media');
  const placeholders = document.querySelectorAll('.placeholder:not(.greetings-video), img');
  const pageSections = Array.from(document.querySelectorAll('.section:not(.section-secret):not(.section-contents):not(#end)'));

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
    if (progressFill) progressFill.style.width = `${progress}%`;
    if (progressLabel) {
      const currentSectionIndex = pageSections.findIndex((section) => {
        const rect = section.getBoundingClientRect();
        const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
        const visibleRatio = rect.height > 0 ? visibleHeight / rect.height : 0;
        return visibleRatio > 0.35 || (rect.top >= 0 && rect.top < window.innerHeight * 0.2);
      });
      const sectionIndex = currentSectionIndex >= 0 ? currentSectionIndex + 1 : 1;
      progressLabel.textContent = `${String(sectionIndex).padStart(2, '0')} / ${String(pageSections.length).padStart(2, '0')}`;
    }
  }

  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });

  function showSecret() {
    if (secretSection) {
      secretSection.classList.remove('hidden-secret');
      secretSection.setAttribute('aria-hidden', 'false');
      secretSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  if (secretTrigger) {
    secretTrigger.addEventListener('click', () => { window.location.href = 'secret.html'; });
    secretTrigger.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        window.location.href = 'secret.html';
      }
    });
  }

  const brandLabel = document.querySelector('.brand-label');
  if (brandLabel) {
    brandLabel.setAttribute('tabindex', '0');
    brandLabel.style.cursor = 'pointer';
    brandLabel.addEventListener('click', () => { window.location.href = 'secret.html'; });
    brandLabel.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        window.location.href = 'secret.html';
      }
    });
  }

  if (secretClose) {
    secretClose.addEventListener('click', () => {
      if (secretSection) {
        secretSection.classList.add('hidden-secret');
        secretSection.setAttribute('aria-hidden', 'true');
      }
    });
  }

  const lightboxItems = Array.from(placeholders).filter((item) => item.tagName === 'IMG' || item.classList.contains('placeholder'));
  let currentIndex = 0;

  function renderLightboxItem(index) {
    const item = lightboxItems[index];
    if (!item) return;
    lightboxMedia.innerHTML = '';
    if (item.tagName === 'IMG') {
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.alt || 'Photo';
      lightboxMedia.appendChild(img);
    } else {
      const placeholder = document.createElement('div');
      placeholder.className = 'lightbox-placeholder';
      placeholder.textContent = 'PHOTO';
      lightboxMedia.appendChild(placeholder);
    }
    lightboxOverlay.classList.add('visible');
    lightboxOverlay.setAttribute('aria-hidden', 'false');
  }

  function closeLightbox() {
    lightboxOverlay.classList.remove('visible');
    lightboxOverlay.setAttribute('aria-hidden', 'true');
  }

  function showPrevious() {
    currentIndex = (currentIndex - 1 + lightboxItems.length) % lightboxItems.length;
    renderLightboxItem(currentIndex);
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % lightboxItems.length;
    renderLightboxItem(currentIndex);
  }

  lightboxItems.forEach((item, index) => {
    item.addEventListener('click', (event) => {
      event.preventDefault();
      currentIndex = index;
      renderLightboxItem(currentIndex);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', (event) => { event.stopPropagation(); showPrevious(); });
  if (lightboxNext) lightboxNext.addEventListener('click', (event) => { event.stopPropagation(); showNext(); });

  if (lightboxOverlay) {
    lightboxOverlay.addEventListener('click', (event) => {
      if (event.target === lightboxOverlay || event.target.classList.contains('lightbox-backdrop')) {
        closeLightbox();
      }
    });
  }
});
