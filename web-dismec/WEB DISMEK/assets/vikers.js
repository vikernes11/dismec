(function () {
  const root = typeof document !== 'undefined' ? document.querySelector('[data-vikers]') : null;
  const toggle = root?.querySelector('[data-vikers-toggle]');
  const panel = root?.querySelector('[data-vikers-panel]');
  const closeButton = root?.querySelector('[data-vikers-close]');
  const resetButton = root?.querySelector('[data-vikers-reset]');
  const form = root?.querySelector('[data-vikers-form]');
  const input = root?.querySelector('[data-vikers-input]');
  const messages = root?.querySelector('[data-vikers-messages]');
  const suggestions = root?.querySelector('[data-vikers-suggestions]');
  const status = root?.querySelector('[data-vikers-status]');
  const count = root?.querySelector('[data-vikers-count]');
  const knowledgePath = root?.getAttribute('data-vikers-knowledge') || '';
  const maxLength = Number(input?.getAttribute('maxlength') || 500);
  let knowledgePromise = null;
  let index = null;
  let composing = false;
  let lengthNotice = false;

  const STOP_WORDS = new Set([
    'a','al','algo','ante','busco','como','con','cual','cuales','cuando','de','del','desde','donde','el','ella','en','es','esa','ese','esto','hacen','hacer','hay','la','las','lo','los','me','mi','necesito','ofrecen','ofrecer','para','pero','por','que','quiero','realizan','realizar','se','si','su','sus','tienen','trabajan','trabajar','un','una','unas','unos','y','ya'
  ]);
  const TOKEN_MAP = new Map(Object.entries({
    cotizacion: 'cotizar', cotizaciones: 'cotizar', cotizo: 'cotizar', presupuesto: 'cotizar', presupuestos: 'cotizar',
    costos: 'precio', costo: 'precio', precios: 'precio', valor: 'precio', valores: 'precio', tarifa: 'precio', tarifas: 'precio',
    cuesta: 'precio', cuestan: 'precio', vale: 'precio', valen: 'precio', sale: 'precio', salen: 'precio',
    plazos: 'tiempo', plazo: 'tiempo', tarda: 'tiempo', tardan: 'tiempo', demora: 'tiempo', duracion: 'tiempo',
    panel: 'solar', paneles: 'solar', solares: 'solar', fotovoltaica: 'solar', fotovoltaico: 'solar', fotovoltaicas: 'solar', fotovoltaicos: 'solar',
    fotoboltaica: 'solar', fotoboltaico: 'solar', fotoboltaicas: 'solar', fotoboltaicos: 'solar',
    climatizacion: 'hvac', acondicionado: 'hvac', refrigeracion: 'hvac',
    vehiculos: 'vehiculo', carros: 'carro', cargadores: 'cargador', recargas: 'recarga', armonicos: 'armonico',
    aplicaciones: 'software', aplicacion: 'software', app: 'software', apps: 'software', programacion: 'software',
    telefonos: 'telefono', celular: 'telefono', email: 'correo', emails: 'correo',
    documentos: 'archivo', documentacion: 'archivo', editables: 'editable',
    calcula: 'calculo', calcule: 'calculo', calculos: 'calculo', calcular: 'calculo', dimensionar: 'calculo',
    certifica: 'certificado', certifican: 'certificado', certificada: 'certificado', certificadas: 'certificado', certificado: 'certificado', certificados: 'certificado', certificar: 'certificado', certificacion: 'certificado', certificaciones: 'certificado',
    cumple: 'cumplimiento', cumplen: 'cumplimiento', cumplir: 'cumplimiento', cumplimiento: 'cumplimiento',
    garantiza: 'garantia', garantizan: 'garantia', garantizar: 'garantia', garantia: 'garantia', garantias: 'garantia',
    acreditada: 'acreditado', acreditadas: 'acreditado', acreditado: 'acreditado', acreditados: 'acreditado', acreditacion: 'acreditado',
    homologada: 'homologado', homologadas: 'homologado', homologado: 'homologado', homologados: 'homologado', homologacion: 'homologado'
  }));
  const SERVICE_SIGNAL_TOKENS = new Set([
    'asme','recipiente','recipientes','solar','hvac','mep','retie','electrico','vehiculo','carro','cargador','electromovilidad','recarga','evse','analizador','armonico','thd','estructura','estructuras','acero','nsr','mecanico','maquinaria','planos','fabricacion','cfd','fea','simulacion','pid','tuberia','tuberias','gases','medicinales','hidrosanitario','concreto','patologia','fisuras','vulnerabilidad','sismica','subestacion','subestaciones','potencia','contencion','taludes','hidraulica','vivienda','diagnostico','integracion','automatizacion'
  ]);
  const DIRECT_SERVICE_TOKENS = new Map(Object.entries({
    asme: 'recipientes-presion-asme', recipiente: 'recipientes-presion-asme', recipientes: 'recipientes-presion-asme',
    solar: 'energia-solar-fotovoltaica', hvac: 'sistemas-hvac-y-mep', mep: 'sistemas-hvac-y-mep',
    cfd: 'simulacion-cfd-fea', fea: 'simulacion-cfd-fea', pid: 'tuberias-pid',
    subestacion: 'diseno-energetico-potencia-subestaciones', subestaciones: 'diseno-energetico-potencia-subestaciones',
    patologia: 'patologia-estructural', hidrosanitario: 'hidrosanitario-y-gas',
    cargador: 'vehiculos-electricos-y-cargadores', electromovilidad: 'vehiculos-electricos-y-cargadores',
    recarga: 'vehiculos-electricos-y-cargadores', evse: 'vehiculos-electricos-y-cargadores'
  }));

  function normalize(value) {
    return String(value || '')
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\bp\s*&\s*i\s*d\b/g, ' pid ')
      .replace(/\bcfd\s*\/\s*fea\b/g, ' cfd fea ')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function tokenize(value) {
    const output = [];
    normalize(value).split(/\s+/).forEach((raw) => {
      if (!raw || STOP_WORDS.has(raw)) return;
      const token = TOKEN_MAP.get(raw) || raw;
      if (!STOP_WORDS.has(token) && !output.includes(token)) output.push(token);
    });
    return output.slice(0, 40);
  }

  function trigrams(token) {
    const padded = `  ${token} `;
    const grams = new Set();
    for (let i = 0; i < padded.length - 2; i += 1) grams.add(padded.slice(i, i + 3));
    return grams;
  }

  function dice(left, right) {
    if (left === right) return 1;
    if (left.length < 5 || right.length < 5) return 0;
    const a = trigrams(left);
    const b = trigrams(right);
    let overlap = 0;
    a.forEach((gram) => { if (b.has(gram)) overlap += 1; });
    return (2 * overlap) / (a.size + b.size || 1);
  }

  function uniqueStrings(values) {
    return Array.from(new Set((values || []).filter((value) => typeof value === 'string' && value.trim()).map((value) => value.trim())));
  }

  function buildIndex(data) {
    if (!data || data.version !== 1 || data.assistant?.mode !== 'faq' || !Array.isArray(data.services) || !Array.isArray(data.faqs)) {
      throw new Error('Catálogo de orientación no válido.');
    }
    const candidates = [];
    data.services.forEach((service) => {
      if (!service || typeof service.slug !== 'string' || typeof service.title !== 'string' || typeof service.summary !== 'string' || !Array.isArray(service.keywords)) return;
      candidates.push({
        kind: 'service',
        id: service.slug,
        title: service.title,
        answer: service.summary,
        url: service.url,
        keywords: uniqueStrings(service.keywords),
        scope: uniqueStrings(service.scope),
        deliverables: uniqueStrings(service.deliverables),
        standards: uniqueStrings(service.standards),
        software: uniqueStrings(service.software),
      });
    });
    data.faqs.forEach((faq) => {
      if (!faq || typeof faq.id !== 'string' || typeof faq.question !== 'string' || typeof faq.answer !== 'string' || !Array.isArray(faq.keywords)) return;
      const related = Array.isArray(faq.related_services) ? faq.related_services : [];
      const relatedService = candidates.find((item) => item.kind === 'service' && related.includes(item.id));
      candidates.push({
        kind: 'faq',
        id: faq.id,
        title: faq.question,
        answer: faq.answer,
        url: relatedService?.url || faq.url || '',
        serviceTitle: relatedService?.title || '',
        source: typeof faq.source === 'string' ? faq.source : '',
        keywords: uniqueStrings(faq.keywords),
        scope: [], deliverables: [], standards: [], software: [],
      });
    });
    if (!candidates.length) throw new Error('Catálogo de orientación vacío.');

    const documentFrequency = new Map();
    candidates.forEach((item) => {
      item.titleText = normalize(item.title);
      item.titleTokens = new Set(tokenize(item.title));
      item.keywordTokens = new Set(tokenize(item.keywords.join(' ')));
      item.contentTokens = new Set(tokenize([item.answer, ...item.scope, ...item.deliverables, ...item.standards, ...item.software].join(' ')));
      item.allTokens = new Set([...item.titleTokens, ...item.keywordTokens, ...item.contentTokens]);
      item.allTokens.forEach((token) => documentFrequency.set(token, (documentFrequency.get(token) || 0) + 1));
    });
    const idf = (token) => Math.log((candidates.length + 1) / ((documentFrequency.get(token) || 0) + 1)) + 1;
    return { data, candidates, idf };
  }

  async function loadKnowledge() {
    if (!knowledgePath || /^(?:[a-z]+:)?\/\//i.test(knowledgePath)) throw new Error('Ruta local no válida.');
    if (!knowledgePromise) {
      knowledgePromise = fetch(knowledgePath, { credentials: 'same-origin' })
        .then((response) => {
          if (!response.ok) throw new Error('No fue posible cargar el catálogo.');
          return response.json();
        })
        .then(buildIndex)
        .catch((error) => {
          knowledgePromise = null;
          throw error;
        });
    }
    index = await knowledgePromise;
    return index;
  }

  function safeLink(raw, allowWhatsApp) {
    if (!raw) return '';
    try {
      const url = new URL(raw, window.location.href);
      if (url.origin === window.location.origin) return url.href;
      if (allowWhatsApp && url.protocol === 'https:' && url.hostname === 'wa.me') return url.href;
    } catch (_) { return ''; }
    return '';
  }

  function scrollMessages() { messages.scrollTop = messages.scrollHeight; }

  function appendActions(container) {
    const actions = document.createElement('div');
    actions.className = 'vikers-actions';
    const values = [
      ['Ver servicios', safeLink(root.getAttribute('data-vikers-services'), false), false],
      ['Solicitar propuesta', safeLink(root.getAttribute('data-vikers-contact'), false), true],
      ['Hablar por WhatsApp', safeLink(root.getAttribute('data-vikers-whatsapp'), true), false],
    ];
    values.forEach(([label, href, primary]) => {
      if (!href) return;
      const link = document.createElement('a');
      link.className = `vikers-action${primary ? ' is-primary' : ''}`;
      link.href = href;
      link.textContent = label;
      if (href.startsWith('https:') && new URL(href).origin !== window.location.origin) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
      actions.appendChild(link);
    });
    container.appendChild(actions);
  }

  function appendMessage(role, text, options) {
    const article = document.createElement('article');
    article.className = `vikers-message${role === 'user' ? ' is-user' : ''}`;
    const bubble = document.createElement('div');
    bubble.className = 'vikers-bubble';
    const paragraph = document.createElement('p');
    const author = document.createElement('span');
    author.className = 'vikers-sr-only';
    author.textContent = role === 'user' ? 'Tú: ' : 'Vikers: ';
    paragraph.appendChild(author);
    paragraph.appendChild(document.createTextNode(text));
    bubble.appendChild(paragraph);
    const settings = options || {};
    if (Array.isArray(settings.bullets) && settings.bullets.length) {
      const list = document.createElement('ul');
      settings.bullets.slice(0, 5).forEach((value) => {
        const item = document.createElement('li');
        item.textContent = value;
        list.appendChild(item);
      });
      bubble.appendChild(list);
    }
    if (settings.source) {
      const source = document.createElement('span');
      source.className = 'vikers-source';
      source.textContent = `Fuente: ${settings.source}`;
      bubble.appendChild(source);
    }
    const href = safeLink(settings.url, false);
    if (href) {
      const link = document.createElement('a');
      link.className = 'vikers-source-link';
      link.href = href;
      link.textContent = settings.linkLabel || 'Consultar información publicada';
      bubble.appendChild(link);
    }
    if (settings.actions) appendActions(bubble);
    article.appendChild(bubble);
    messages.appendChild(article);
    while (messages.children.length > 24) messages.removeChild(messages.children[1] || messages.firstChild);
    scrollMessages();
    return bubble;
  }

  function appendOptions(items) {
    const bubble = appendMessage('assistant', 'Encontré estas opciones relacionadas. Elige una para revisar la información publicada:', { source: 'Servicios DISMEK' });
    const list = document.createElement('div');
    list.className = 'vikers-options';
    items.slice(0, 3).forEach((item) => {
      const href = safeLink(item.url, false);
      if (!href) return;
      const link = document.createElement('a');
      link.className = 'vikers-option';
      link.href = href;
      link.textContent = item.title;
      list.appendChild(link);
    });
    bubble.appendChild(list);
    scrollMessages();
  }

  function findById(id) { return index?.candidates.find((item) => item.id === id); }

  function fixedIntent(queryText) {
    const text = normalize(queryText);
    const tokenList = tokenize(queryText);
    const tokens = new Set(tokenList);
    const hasSpecificService = tokenList.some((token) => SERVICE_SIGNAL_TOKENS.has(token));
    if (/^(hola|buenas|buenos dias|buenas tardes|buenas noches|hey)$/.test(text)) return { type: 'welcome' };
    if (['certificado','cumplimiento','garantia','acreditado','homologado'].some((token) => tokens.has(token))) return { type: 'verification' };
    const directProfessionalRequest = /^(?:por favor )?(?:hazme|haz|haga|calcula|calcular|calcule|calculame|dimensiona|dimensionar|dimensione|dimensioname|valida|validar|valide|validame|diagnostica|diagnosticar|diagnostique|analiza|analizar|resuelve|resolver|determina|determinar|realiza|disena|disenar|disename|diseneme|elabora|elaborar|elabore|prepara|preparar|prepare|simula|simular|simule|modela|modelar|modele|evalua|evaluar|evalue|revisa|revisar|revise|firma|firmar)\b(?!\s+(?:dismek|ustedes|la empresa|su empresa)\b)/;
    const explicitProfessionalRequest = /\b(?:quiero|necesito) que (?:me )?(?:calcules|dimensiones|valides|diagnostiques|analices|resuelvas|determines|disenes|elabores|prepares|simules|modeles|evalues|revises|firmes)\b/;
    const capabilityRequest = /\b(?:puedes|puede|podrias|podria) (?:calcular|dimensionar|validar|diagnosticar|analizar|resolver|determinar|disenar|elaborar|simular|modelar|evaluar|revisar|firmar)\b/;
    if (directProfessionalRequest.test(text) || explicitProfessionalRequest.test(text) || capabilityRequest.test(text)) return { type: 'professional' };
    if (tokens.has('precio') || tokens.has('cotizar')) return { type: 'candidate', id: tokens.has('precio') ? 'general-precios' : 'general-cotizacion' };
    if (tokens.has('tiempo') || text.includes('fecha exacta')) return { type: 'candidate', id: 'general-plazos' };
    if (['telefono','correo','whatsapp','contacto','hablar'].some((token) => tokens.has(token))) return { type: 'candidate', id: 'general-contacto' };
    if (/\b(fuera|remoto|otra ciudad|colombia)\b/.test(text)) return { type: 'candidate', id: 'general-cobertura' };
    const directServices = new Set(tokenList.map((token) => DIRECT_SERVICE_TOKENS.get(token)).filter(Boolean));
    if (directServices.size === 1) return { type: 'candidate', id: Array.from(directServices)[0] };
    if (!hasSpecificService && /\b(servicios|soluciones|capacidades)\b/.test(text) && tokenList.length <= 4) return { type: 'candidate', id: 'general-servicios' };
    if (!hasSpecificService && /\b(software|programas|herramientas)\b/.test(text) && tokenList.length <= 4) return { type: 'candidate', id: 'general-software' };
    return null;
  }

  function rank(queryText) {
    const queryTokens = tokenize(queryText);
    if (!queryTokens.length) return [];
    const queryNormalized = normalize(queryText);
    const totalWeight = queryTokens.reduce((sum, token) => sum + index.idf(token), 0) || 1;
    return index.candidates.map((item) => {
      let matched = 0;
      let titleMatched = 0;
      queryTokens.forEach((token) => {
        const weight = index.idf(token);
        if (item.titleTokens.has(token)) { matched += weight; titleMatched += weight; return; }
        if (item.keywordTokens.has(token)) { matched += weight * .9; return; }
        if (item.contentTokens.has(token)) { matched += weight * .52; return; }
        let similarity = 0;
        item.allTokens.forEach((candidateToken) => { similarity = Math.max(similarity, dice(token, candidateToken)); });
        if (similarity >= .76) matched += weight * similarity * .56;
      });
      const coverage = matched / totalWeight;
      const titleCoverage = titleMatched / totalWeight;
      const phrase = item.titleText.includes(queryNormalized) || queryNormalized.includes(item.titleText) ? 1 : 0;
      return { item, coverage, score: coverage * .72 + titleCoverage * .18 + phrase * .1 };
    }).sort((a, b) => b.score - a.score);
  }

  function selectAnswer(queryText) {
    const intent = fixedIntent(queryText);
    if (intent?.type === 'welcome' || intent?.type === 'professional' || intent?.type === 'verification') return intent;
    if (intent?.type === 'candidate') {
      const item = findById(intent.id);
      if (item) return { type: 'candidate', item };
    }

    const hasSpecificService = tokenize(queryText).some((token) => SERVICE_SIGNAL_TOKENS.has(token));
    const ranked = rank(queryText).filter((result) => (
      !hasSpecificService || !['general-servicios', 'general-software'].includes(result.item.id)
    ));
    const top = ranked[0];
    const second = ranked[1];
    const margin = top ? top.score - (second?.score || 0) : 0;
    if (top && top.score >= .5 && top.coverage >= .42 && (margin >= .08 || top.score >= .68)) {
      return { type: 'candidate', item: top.item };
    }
    const items = ranked
      .filter((result) => result.item.kind === 'service' && result.score >= .27)
      .map((result) => result.item)
      .slice(0, 3);
    return items.length ? { type: 'options', items } : { type: 'fallback' };
  }

  function serviceDetails(item, queryText) {
    const text = normalize(queryText);
    if (/\b(entregable|entregables|archivo|editable|plano|memoria)\b/.test(text)) return item.deliverables;
    if (/\b(norma|normas|criterio|reglamento|codigo)\b/.test(text)) return item.standards;
    if (/\b(software|programa|herramienta)\b/.test(text)) return item.software;
    if (/\b(alcance|incluye|realizan|hacen)\b/.test(text)) return item.scope;
    return [];
  }

  function answerCandidate(item, queryText) {
    if (!item) return false;
    if (item.kind === 'faq') {
      appendMessage('assistant', item.answer, {
        source: item.serviceTitle ? `Servicio — ${item.serviceTitle}` : (item.source || 'Preguntas frecuentes'),
        url: item.url,
      });
      return true;
    }
    appendMessage('assistant', item.answer, {
      bullets: serviceDetails(item, queryText),
      source: `Servicio — ${item.title}`,
      url: item.url,
      linkLabel: 'Ver alcance del servicio',
    });
    return true;
  }

  function renderWelcome() {
    appendMessage('assistant', 'Hola, soy Vikers, el asistente virtual de DISMEK. Puedo orientarte sobre nuestros servicios y preguntas frecuentes. ¿Qué necesitas?', {
      source: 'Información publicada por DISMEK',
    });
  }

  function renderFallback() {
    appendMessage('assistant', 'No encontré una respuesta segura en el contenido publicado. Puedo mostrarte los servicios o puedes hablar con el equipo de DISMEK por WhatsApp.', {
      actions: true,
    });
  }

  function setBusy(value, text) {
    messages.setAttribute('aria-busy', String(value));
    if (input) input.disabled = value;
    if (resetButton) resetButton.disabled = value;
    suggestions?.querySelectorAll('button').forEach((button) => { button.disabled = value; });
    const send = form?.querySelector('[data-vikers-send]');
    if (send) send.disabled = value;
    if (status) status.textContent = text || '';
  }

  async function handleQuestion(question) {
    setBusy(true, 'Vikers está revisando la información.');
    try {
      await loadKnowledge();
      const result = selectAnswer(question);
      if (result.type === 'welcome') { renderWelcome(); return; }
      if (result.type === 'professional') {
        appendMessage('assistant', 'Puedo orientarte con información general, pero no realizar cálculos, diagnósticos, diseños ni validaciones desde este chat. Un profesional debe revisar los datos y el contexto del proyecto.', { actions: true });
        return;
      }
      if (result.type === 'verification') {
        appendMessage('assistant', 'Vikers no puede confirmar certificaciones, cumplimiento normativo, acreditaciones ni garantías. Esos aspectos deben verificarse para el proyecto, la entidad responsable y el alcance contractual.', { actions: true });
        return;
      }
      if (result.type === 'candidate' && answerCandidate(result.item, question)) return;
      if (result.type === 'options') { appendOptions(result.items); return; }
      renderFallback();
    } catch (_) {
      knowledgePromise = null;
      index = null;
      appendMessage('assistant', 'Vikers no está disponible en este momento. La información del sitio sigue disponible.', { actions: true });
    } finally {
      setBusy(false, '');
      input?.focus();
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      createMatcher(data) {
        index = buildIndex(data);
        return (question) => {
          const result = selectAnswer(question);
          return {
            type: result.type,
            id: result.item?.id || null,
            ids: Array.isArray(result.items) ? result.items.map((item) => item.id) : [],
          };
        };
      },
      normalize,
      tokenize,
    };
  }

  if (!root) return;

  function openPanel() {
    panel.hidden = false;
    panel.inert = false;
    root.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    loadKnowledge().catch(() => {});
    window.requestAnimationFrame(() => input?.focus());
  }

  function closePanel() {
    panel.hidden = true;
    panel.inert = true;
    root.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.focus();
  }

  toggle?.addEventListener('click', () => panel.hidden ? openPanel() : closePanel());
  closeButton?.addEventListener('click', closePanel);
  resetButton?.addEventListener('click', () => {
    messages.replaceChildren();
    renderWelcome();
    input.value = '';
    lengthNotice = false;
    if (status) status.textContent = '';
    if (count) count.textContent = `0/${maxLength}`;
    input.focus();
  });
  suggestions?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-vikers-question]');
    if (!button || !input) return;
    input.value = button.getAttribute('data-vikers-question') || button.textContent || '';
    input.dispatchEvent(new Event('input'));
    form.requestSubmit();
  });
  input?.addEventListener('compositionstart', () => { composing = true; });
  input?.addEventListener('compositionend', () => { composing = false; });
  input?.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 112)}px`;
    if (count) count.textContent = `${input.value.length}/${maxLength}`;
    if (status && input.value.length >= maxLength) {
      status.textContent = `Límite de ${maxLength} caracteres alcanzado.`;
      lengthNotice = true;
    } else if (status && lengthNotice) {
      status.textContent = '';
      lengthNotice = false;
    }
  });
  input?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey && !composing) {
      event.preventDefault();
      form.requestSubmit();
    }
  });
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question) { status.textContent = 'Escribe una pregunta para continuar.'; input.focus(); return; }
    if (question.length > maxLength) { status.textContent = `Tu pregunta supera ${maxLength} caracteres. Resúmela para poder buscar una respuesta.`; return; }
    appendMessage('user', question);
    input.value = '';
    input.style.height = 'auto';
    lengthNotice = false;
    if (count) count.textContent = `0/${maxLength}`;
    handleQuestion(question);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) closePanel();
  });
  document.addEventListener('vikers:close', () => { if (!panel.hidden) closePanel(); });
})();
