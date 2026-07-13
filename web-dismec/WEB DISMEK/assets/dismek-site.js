(function () {
  const year = document.querySelector('[data-current-year]');
  if (year) year.textContent = new Date().getFullYear();

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function track(name, detail) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: name, ...detail });
  }

  document.querySelectorAll('[data-track]').forEach((el) => {
    el.addEventListener('click', () => {
      track(el.getAttribute('data-track'), {
        text: (el.textContent || '').trim(),
        href: el.getAttribute('href') || '',
      });
    });
  });

  const lazyImages = Array.from(document.querySelectorAll('img[data-src]'));
  const loadImage = (img) => {
    if (!img.dataset.src) return;
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
  };
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        loadImage(entry.target);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '240px 0px' });
    lazyImages.forEach((img) => imageObserver.observe(img));
  } else {
    lazyImages.forEach(loadImage);
  }

const form = document.querySelector('[data-contact-form]');
if (form) {
  const status = form.querySelector('[data-form-status]');
  const submitButton = form.querySelector('button[type="submit"]');
  form.addEventListener('submit', async (event) => {
    status.classList.remove('is-error', 'is-ok');
    if (!form.checkValidity()) {
      event.preventDefault();
        status.textContent = 'Revise los campos requeridos, el consentimiento y el formato de contacto antes de enviar.';
        status.classList.add('is-error');
      form.reportValidity();
      return;
    }

    const endpoint = form.dataset.apiEndpoint;
    if (!endpoint) return;

    event.preventDefault();
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    payload.autorizacion_datos = formData.has('autorizacion_datos');
    payload._honey = payload._honey || '';
    status.textContent = 'Enviando la solicitud de forma segura…';
    status.classList.add('is-ok');
    if (submitButton) submitButton.disabled = true;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const contentType = response.headers.get('content-type') || '';
      if (!response.ok || !contentType.includes('application/json')) {
        if ([404, 405, 501].includes(response.status) || !contentType.includes('application/json')) {
          form.submit();
          return;
        }
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || 'No fue posible registrar la solicitud.');
      }
      const result = await response.json();
      status.textContent = result.message || 'Solicitud registrada correctamente. Nos pondremos en contacto.';
      status.classList.add('is-ok');
      form.reset();
      track('form_submit_success', { form: 'contacto_dismek', lead_id: result.id || '' });
    } catch (error) {
      if (error instanceof TypeError) {
        form.submit();
        return;
      }
      status.textContent = error.message || 'No fue posible enviar la solicitud. Intente nuevamente o use WhatsApp.';
      status.classList.remove('is-ok');
      status.classList.add('is-error');
      track('form_submit_error', { form: 'contacto_dismek' });
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}
})();

(function () {
  const header = document.querySelector('[data-premium-header]');
  const menuButton = document.querySelector('[data-premium-menu-toggle]');
  const menuClose = document.querySelector('[data-premium-menu-close]');
  const nav = document.querySelector('[data-premium-nav]');
  const backTop = document.querySelector('[data-back-top]');

  const syncScrollState = () => {
    const scrolled = window.scrollY > 24;
    if (header) header.classList.toggle('is-scrolled', scrolled);
    if (backTop) backTop.classList.toggle('is-visible', window.scrollY > 650);
  };
  syncScrollState();
  window.addEventListener('scroll', syncScrollState, { passive: true });

  const setMenu = (open) => {
    if (!nav || !menuButton) return;
    nav.classList.toggle('is-open', open);
    header?.classList.toggle('menu-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) menuClose?.focus();
  };
  menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  menuClose?.addEventListener('click', () => { setMenu(false); menuButton?.focus(); });
  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav?.classList.contains('is-open')) { setMenu(false); menuButton?.focus(); }
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1120 && nav?.classList.contains('is-open')) setMenu(false);
  }, { passive: true });

  const heroVideo = document.querySelector('[data-hero-video]');
  const videoButton = document.querySelector('[data-video-toggle]');
  const videoLabel = videoButton?.querySelector('[data-video-label]');
  const videoPauseIcon = videoButton?.querySelector('[data-video-icon-pause]');
  const videoPlayIcon = videoButton?.querySelector('[data-video-icon-play]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const renderVideoState = () => {
    if (!heroVideo || !videoButton || !videoLabel) return;
    const paused = heroVideo.paused;
    videoButton.setAttribute('aria-pressed', String(paused));
    videoButton.setAttribute('aria-label', paused ? 'Reproducir video de fondo' : 'Pausar video de fondo');
    videoLabel.textContent = paused ? 'Reproducir video' : 'Pausar video';
    if (videoPauseIcon) videoPauseIcon.hidden = paused;
    if (videoPlayIcon) videoPlayIcon.hidden = !paused;
    heroVideo.classList.toggle('is-paused', paused);
  };
  if (heroVideo) {
    if (reducedMotion.matches) heroVideo.pause();
    else heroVideo.play().catch(() => {});
    heroVideo.addEventListener('play', renderVideoState);
    heroVideo.addEventListener('pause', renderVideoState);
    renderVideoState();
  }
  videoButton?.addEventListener('click', () => {
    if (!heroVideo) return;
    if (heroVideo.paused) heroVideo.play().catch(() => {}); else heroVideo.pause();
  });
  document.addEventListener('visibilitychange', () => {
    if (!heroVideo) return;
    if (document.hidden) heroVideo.pause();
  });

  const filters = Array.from(document.querySelectorAll('[data-service-filter]'));
  const cards = Array.from(document.querySelectorAll('[data-service-category]'));
  filters.forEach((button) => button.addEventListener('click', () => {
    const selected = button.dataset.serviceFilter || 'all';
    filters.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    cards.forEach((card) => { card.hidden = selected !== 'all' && card.dataset.serviceCategory !== selected; });
  }));

  const serviceDialog = document.querySelector('[data-service-dialog]');
  const dataNode = document.querySelector('#premium-service-data');
  let serviceData = {};
  try { serviceData = dataNode ? JSON.parse(dataNode.textContent || '{}') : {}; } catch (_) { serviceData = {}; }
  let dialogOpener = null;
  const fillList = (selector, items) => {
    const list = serviceDialog?.querySelector(selector);
    if (!list) return;
    list.replaceChildren(...(items || []).map((text) => { const li = document.createElement('li'); li.textContent = text; return li; }));
  };
  document.querySelectorAll('[data-service-quick]').forEach((button) => button.addEventListener('click', () => {
    const item = serviceData[button.dataset.serviceQuick || ''];
    if (!serviceDialog || !item) return;
    dialogOpener = button;
    const image = serviceDialog.querySelector('[data-dialog-image]');
    const tag = serviceDialog.querySelector('[data-dialog-tag]');
    const title = serviceDialog.querySelector('[data-dialog-title]');
    const lead = serviceDialog.querySelector('[data-dialog-lead]');
    const page = serviceDialog.querySelector('[data-dialog-page]');
    const whatsapp = serviceDialog.querySelector('[data-dialog-whatsapp]');
    if (image) { image.src = item.image; image.alt = item.title; }
    if (tag) tag.textContent = item.tag;
    if (title) title.textContent = item.title;
    if (lead) lead.textContent = item.intro;
    if (page) page.href = item.page;
    if (whatsapp) whatsapp.href = item.whatsapp;
    fillList('[data-dialog-scope]', item.scope);
    fillList('[data-dialog-deliverables]', item.deliverables);
    fillList('[data-dialog-standards]', item.standards);
    serviceDialog.showModal();
  }));
  serviceDialog?.addEventListener('close', () => dialogOpener?.focus());
  serviceDialog?.addEventListener('click', (event) => { if (event.target === serviceDialog) serviceDialog.close(); });

  backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' }));

  const revealItems = Array.from(document.querySelectorAll('.reveal-item'));
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    document.body.classList.add('reveal-ready');
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); } });
    }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const navLinks = Array.from(document.querySelectorAll('[data-premium-nav] a[href^="#"]'));
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!current) return;
      navLinks.forEach((link) => link.setAttribute('aria-current', String(link.getAttribute('href') === `#${current.target.id}`)));
    }, { threshold: [.25, .5, .75], rootMargin: '-15% 0px -60% 0px' });
    sections.forEach((section) => spy.observe(section));
  }
})();
