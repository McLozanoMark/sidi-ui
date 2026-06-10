
(function () {
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

  const iconMap = {
    home: 'fa-house',
    search: 'fa-magnifying-glass',
    map: 'fa-map',
    help: 'fa-circle-question',
    notifications: 'fa-bell',
    account_circle: 'fa-circle-user',
    close: 'fa-xmark',
    menu: 'fa-bars',
    add: 'fa-plus',
    edit: 'fa-pen',
    delete: 'fa-trash-can',
    lock: 'fa-lock',
    save: 'fa-floppy-disk',
    cancel: 'fa-rotate-left',
    filter_alt: 'fa-filter',
    check_circle: 'fa-circle-check',
    warning: 'fa-triangle-exclamation',
    error: 'fa-circle-exclamation',
    info: 'fa-circle-info',
    bar_chart: 'fa-chart-simple',
    folder: 'fa-folder',
    folder_open: 'fa-folder-open',
    settings: 'fa-gear',
    person: 'fa-user',
    history: 'fa-clock-rotate-left',
    visibility: 'fa-eye',
    open_in_new: 'fa-arrow-up-right-from-square',
    description: 'fa-file-lines',
    dashboard: 'fa-gauge-high',
    landmark: 'fa-building-columns',
    user_graduate: 'fa-user-graduate',
    teacher: 'fa-chalkboard-user',
    school: 'fa-school',
    book: 'fa-book-open',
    building: 'fa-building',
    hands_helping: 'fa-handshake-angle',
    toolbox: 'fa-toolbox',
    university: 'fa-graduation-cap',
    network: 'fa-sitemap',
    chart_line: 'fa-chart-line',
    archive: 'fa-box-archive',
    clipboard_check: 'fa-clipboard-check',
    coins: 'fa-coins',
    scale: 'fa-scale-balanced',
    diagram: 'fa-diagram-project',
    location: 'fa-map-location-dot',
    award: 'fa-award',
    heart_pulse: 'fa-heart-pulse',
    lightbulb: 'fa-lightbulb',
    chevron_right: 'fa-chevron-down',
    expand_more: 'fa-chevron-down'
  };

  const icon = (name, extraClass = '') => {
    const className = iconMap[name] || 'fa-circle';
    return `<i class="sidi-icon ${extraClass} fa-solid ${className}" aria-hidden="true"></i>`;
  };


  function paginate(items, page = 1, pageSize = 10) {
    const source = Array.isArray(items) ? items : [];
    const size = Number(pageSize) > 0 ? Number(pageSize) : 10;
    const totalItems = source.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / size));
    const currentPage = Math.min(Math.max(Number(page) || 1, 1), totalPages);
    const startIndex = (currentPage - 1) * size;
    const endIndex = Math.min(startIndex + size, totalItems);

    return {
      items: source.slice(startIndex, endIndex),
      page: currentPage,
      pageSize: size,
      totalItems,
      totalPages,
      start: totalItems ? startIndex + 1 : 0,
      end: endIndex
    };
  }

  function renderPagination(options = {}) {
    const container = typeof options.container === 'string'
      ? document.querySelector(options.container)
      : options.container;

    if (!container) return;

    const page = Number(options.page) || 1;
    const totalPages = Math.max(1, Number(options.totalPages) || 1);
    const totalItems = Math.max(0, Number(options.totalItems) || 0);
    const start = Math.max(0, Number(options.start) || 0);
    const end = Math.max(0, Number(options.end) || 0);
    const maxButtons = 5;
    const half = Math.floor(maxButtons / 2);
    let first = Math.max(1, page - half);
    let last = Math.min(totalPages, first + maxButtons - 1);

    if (last - first + 1 < maxButtons) {
      first = Math.max(1, last - maxButtons + 1);
    }

    const pages = [];
    for (let current = first; current <= last; current += 1) {
      pages.push(current);
    }

    container.innerHTML = `
      <p class="sidi-table-summary">Mostrando ${start} a ${end} de ${totalItems} registros</p>
      <nav class="sidi-pagination" aria-label="Paginación de tabla">
        <button class="sidi-pagination__btn" type="button" data-page="${page - 1}" ${page <= 1 ? 'disabled' : ''}>Anterior</button>
        ${pages.map((current) => `
          <button class="sidi-pagination__btn ${current === page ? 'is-active' : ''}" type="button" data-page="${current}" ${current === page ? 'aria-current="page"' : ''}>${current}</button>
        `).join('')}
        <button class="sidi-pagination__btn" type="button" data-page="${page + 1}" ${page >= totalPages ? 'disabled' : ''}>Siguiente</button>
      </nav>`;
  }

  const categoryIconMap = {
    'Alta Dirección': 'landmark',
    'Estudiantes': 'user_graduate',
    'Directivos y Docentes': 'teacher',
    'Gestión Escolar': 'school',
    'Recursos Educativos': 'book',
    'Infraestructura Educativa': 'building',
    'Intervenciones Minedu': 'hands_helping',
    'Herramientas USE': 'toolbox',
    'Educación Superior': 'university',
    'Gestión Descentralizada': 'network',
    'Presupuesto e Inversiones': 'chart_line',
    'Histórico': 'archive',
    'Evaluación de Aprendizajes': 'clipboard_check',
    'Programas Presupuestales': 'coins',
    'Políticas Educativas': 'scale',
    'Planeamiento Institucional': 'diagram',
    'Seguimiento Territorial': 'location',
    'Becas y Créditos': 'award',
    'Salud Escolar': 'heart_pulse',
    'Innovación Educativa': 'lightbulb',
    'Configuración del Sistema': 'settings'
  };

  function getCategoryIcon(category) {
    return categoryIconMap[category] || 'folder_open';
  }

  window.SIDI = {
    icon,
    paginate,
    renderPagination,
    toast,
    confirm: openConfirm,
    openModal,
    closeModal,
    sidebar: {
      toggle: toggleSidebar,
      openActivePath,
      collapse: collapseDesktopSidebar,
      expand: expandDesktopSidebar
    }
  };

  function init() {
    renderSidebar();
    initHeader();
    initModals();
    initActiveNav();
    initCopy();
  }

  function reportHref(report) {
    return `visor-bi.html?reporte=${encodeURIComponent(report.id)}`;
  }

  function renderSidebar() {
    const nav = $('[data-sidebar]');
    if (!nav || !window.SIDI_DATA) return;

    const categories = [...new Set(SIDI_DATA.reports.map((report) => report.category))];
    let html = '<div class="sidi-nav">';

    html += navLink('index.html', 'home', 'Inicio');
    html += actionButton('help', '¿Qué es el SIDI?', 'helpModal');
    html += '<div class="sidi-section-label">Reportes Power BI</div>';

    categories.forEach((category) => {
      const reports = SIDI_DATA.reports.filter((report) => report.category === category);
      const directReports = reports.filter((report) => report.group === 'Reporte directo');
      const groups = [...new Set(reports.filter((report) => report.group !== 'Reporte directo').map((report) => report.group))];
      const categoryIcon = getCategoryIcon(category);

      html += `
        <section class="sidi-nav-section" data-nav-section>
          <button class="sidi-nav-toggle" type="button" aria-expanded="false" title="${escapeHtml(category)}" aria-label="${escapeHtml(category)}">
            ${icon(categoryIcon, 'sidi-icon--category')}
            <span class="sidi-nav-text">${escapeHtml(category)}</span>
            ${icon('expand_more', 'sidi-chevron')}
          </button>
          <div class="sidi-nav-subnav">
      `;

      directReports.forEach((report) => {
        html += reportLink(report);
      });

      groups.forEach((group) => {
        html += `
          <div class="sidi-nav-subgroup" data-nav-subgroup>
            <button class="sidi-nav-subtoggle" type="button" aria-expanded="false" title="${escapeHtml(group)}" aria-label="${escapeHtml(group)}">
              ${icon('folder', 'sidi-icon--folder')}
              <span class="sidi-nav-text">${escapeHtml(group)}</span>
              ${icon('expand_more', 'sidi-chevron')}
            </button>
            <div class="sidi-nav-subnav">
        `;

        reports
          .filter((report) => report.group === group)
          .forEach((report) => {
            html += reportLink(report);
          });

        html += '</div></div>';
      });

      html += '</div></section>';
    });

    html += `
      <div class="sidi-section-label">Configuración</div>
      <section class="sidi-nav-section" data-nav-section>
        <button class="sidi-nav-toggle" type="button" aria-expanded="false" title="Configuración del Sistema" aria-label="Configuración del Sistema">
          ${icon('settings', 'sidi-icon--category')}
          <span class="sidi-nav-text">Configuración del Sistema</span>
          ${icon('expand_more', 'sidi-chevron')}
        </button>
        <div class="sidi-nav-subnav">
          <div class="sidi-nav-subgroup" data-nav-subgroup>
            <button class="sidi-nav-subtoggle" type="button" aria-expanded="false" title="Administración" aria-label="Administración">
              ${icon('folder', 'sidi-icon--folder')}
              <span class="sidi-nav-text">Administración</span>
              ${icon('expand_more', 'sidi-chevron')}
            </button>
            <div class="sidi-nav-subnav">
              ${navLink('administrar-submenus.html', 'description', 'Administrar SubMenús')}
              ${navLink('administrar-categorias.html', 'folder_open', 'Administrar Categorías')}
            </div>
          </div>
          ${navLink('alertas.html', 'notifications', 'Alertas', '<span class="sidi-tag sidi-tag--warning sidi-nav-meta">3</span>')}
          <span class="sidi-nav-link is-disabled" aria-disabled="true" title="Base" aria-label="Base">
            ${icon('lock')}
            <span class="sidi-nav-text">Base</span>
            <span class="sidi-tag sidi-tag--inactive sidi-nav-meta">Inactivo</span>
          </span>
        </div>
      </section>
    `;

    html += `
      <div class="sidi-section-label">Soporte</div>
      ${navLink('mapa-sitio.html', 'map', 'Mapa de sitio')}
      ${navLink('componentes.html', 'description', 'Componentes')}
      <div class="sidi-sidebar-card">
        <strong>SIDI</strong><br>
        Sistema integrado de información del MINEDU
      </div>
    `;

    html += '</div>';
    nav.innerHTML = html;
  }

  function navLink(href, iconName, text, meta = '') {
    return `
      <a class="sidi-nav-link" href="${href}" data-nav-link title="${escapeHtml(text)}" aria-label="${escapeHtml(text)}">
        ${icon(iconName)}
        <span class="sidi-nav-text">${escapeHtml(text)}</span>
        ${meta}
      </a>
    `;
  }

  function actionButton(iconName, text, modalId) {
    return `
      <button class="sidi-nav-action" type="button" data-open-modal="${modalId}" title="${escapeHtml(text)}" aria-label="${escapeHtml(text)}">
        ${icon(iconName)}
        <span class="sidi-nav-text">${escapeHtml(text)}</span>
      </button>
    `;
  }

  function reportLink(report) {
    const disabled = report.status !== 'active';
    if (disabled) {
      return `
        <span class="sidi-nav-link is-disabled" aria-disabled="true" title="${escapeHtml(report.title)}" aria-label="${escapeHtml(report.title)}">
          ${icon('bar_chart', 'sidi-icon--bi')}
          <span class="sidi-nav-text">${escapeHtml(report.title)}</span>
        </span>
      `;
    }

    return `
      <a class="sidi-nav-link" href="${reportHref(report)}" data-nav-link data-report="${escapeHtml(report.id)}" title="${escapeHtml(report.title)}" aria-label="${escapeHtml(report.title)}">
        ${icon('bar_chart', 'sidi-icon--bi')}
        <span class="sidi-nav-text">${escapeHtml(report.title)}</span>
      </a>
    `;
  }

  function initActiveNav() {
    const here = new URL(location.href);

    $$('[data-nav-link]').forEach((link) => {
      link.classList.remove('is-active');
      link.removeAttribute('aria-current');
    });

    $$('.sidi-nav-section, .sidi-nav-subgroup').forEach((section) => {
      section.classList.remove('is-parent-active', 'is-open');
      const toggle = section.querySelector(':scope > .sidi-nav-toggle, :scope > .sidi-nav-subtoggle');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });

    const activeLink = $$('[data-nav-link]').find((link) => {
      try {
        const url = new URL(link.getAttribute('href'), location.href);
        return url.pathname === here.pathname && url.search === here.search;
      } catch (error) {
        return false;
      }
    });

    if (!activeLink) return;

    activeLink.classList.add('is-active');
    activeLink.setAttribute('aria-current', 'page');
    openActivePath(activeLink);
  }

  function openActivePath(activeLink = $('[data-nav-link].is-active')) {
    if (!activeLink) return;

    const subgroup = activeLink.closest('[data-nav-subgroup]');
    if (subgroup) {
      openSubgroup(subgroup, { closeSiblings: true });
      subgroup.classList.add('is-parent-active');
    }

    const section = activeLink.closest('[data-nav-section]');
    if (section) {
      openSection(section, { closeSiblings: true });
      section.classList.add('is-parent-active');
    }
  }

  function openSection(section, options = {}) {
    const { closeSiblings = true } = options;
    if (!section) return;

    if (closeSiblings) {
      $$('[data-nav-section]').forEach((sibling) => {
        if (sibling !== section) closeSection(sibling);
      });
    }

    section.classList.add('is-open');
    const toggle = section.querySelector(':scope > .sidi-nav-toggle');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
  }

  function closeSection(section) {
    section.classList.remove('is-open');
    const toggle = section.querySelector(':scope > .sidi-nav-toggle');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');

    $$('[data-nav-subgroup]', section).forEach((subgroup) => closeSubgroup(subgroup));
  }

  function toggleSection(section) {
    if (!section) return;
    const isOpen = section.classList.contains('is-open');

    $$('[data-nav-section]').forEach((sibling) => {
      if (sibling !== section) closeSection(sibling);
    });

    if (isOpen) {
      closeSection(section);
    } else {
      openSection(section, { closeSiblings: false });
    }
  }

  function openSubgroup(subgroup, options = {}) {
    const { closeSiblings = true } = options;
    if (!subgroup) return;

    const parentPanel = subgroup.parentElement;
    if (closeSiblings && parentPanel) {
      $$(':scope > [data-nav-subgroup]', parentPanel).forEach((sibling) => {
        if (sibling !== subgroup) closeSubgroup(sibling);
      });
    }

    subgroup.classList.add('is-open');
    const toggle = subgroup.querySelector(':scope > .sidi-nav-subtoggle');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
  }

  function closeSubgroup(subgroup) {
    subgroup.classList.remove('is-open');
    const toggle = subgroup.querySelector(':scope > .sidi-nav-subtoggle');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }

  function toggleSubgroup(subgroup) {
    if (!subgroup) return;
    const isOpen = subgroup.classList.contains('is-open');

    const parentPanel = subgroup.parentElement;
    if (parentPanel) {
      $$(':scope > [data-nav-subgroup]', parentPanel).forEach((sibling) => {
        if (sibling !== subgroup) closeSubgroup(sibling);
      });
    }

    if (isOpen) {
      closeSubgroup(subgroup);
    } else {
      openSubgroup(subgroup, { closeSiblings: false });
    }
  }

  function initHeader() {
    const shell = $('.sidi-shell');

    $('[data-menu-button]')?.addEventListener('click', () => {
      toggleSidebar();
    });

    $('[data-sidebar-overlay]')?.addEventListener('click', () => {
      shell?.classList.remove('is-sidebar-open');
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        shell?.classList.remove('is-sidebar-open');
        $$('.sidi-dropdown').forEach((dropdown) => dropdown.classList.remove('is-open'));
      }
    });

    window.addEventListener('resize', () => {
      if (!isMobileLayout()) {
        shell?.classList.remove('is-sidebar-open');
      }
    });

    $$('[data-toggle-dropdown]').forEach((button) => {
      button.addEventListener('click', () => {
        const dropdown = $('#' + button.dataset.toggleDropdown);
        $$('.sidi-dropdown').forEach((item) => {
          if (item !== dropdown) item.classList.remove('is-open');
        });
        dropdown?.classList.toggle('is-open');
      });
    });

    document.addEventListener('click', (event) => {
      if (!event.target.closest('[data-toggle-dropdown], .sidi-dropdown')) {
        $$('.sidi-dropdown').forEach((dropdown) => dropdown.classList.remove('is-open'));
      }

      if (!event.target.closest('[data-tooltip]')) {
        $$('.sidi-title-help.is-tooltip-open').forEach((button) => {
          button.classList.remove('is-tooltip-open');
        });
      }
    });

    renderDropdowns();
    restoreDesktopSidebarState();
  }

  function isMobileLayout() {
    return window.matchMedia('(max-width: 900px)').matches;
  }

  function toggleSidebar() {
    const shell = $('.sidi-shell');
    if (!shell) return;

    if (isMobileLayout()) {
      shell.classList.toggle('is-sidebar-open');
      return;
    }

    shell.classList.toggle('is-sidebar-collapsed');

    const isCollapsed = shell.classList.contains('is-sidebar-collapsed');
    localStorage.setItem('sidiSidebarCollapsed', isCollapsed ? '1' : '0');

    if (!isCollapsed) {
      initActiveNav();
    }
  }

  function collapseDesktopSidebar() {
    const shell = $('.sidi-shell');
    if (!shell || isMobileLayout()) return;
    shell.classList.add('is-sidebar-collapsed');
    localStorage.setItem('sidiSidebarCollapsed', '1');
  }

  function expandDesktopSidebar() {
    const shell = $('.sidi-shell');
    if (!shell || isMobileLayout()) return;
    shell.classList.remove('is-sidebar-collapsed');
    localStorage.setItem('sidiSidebarCollapsed', '0');
    initActiveNav();
  }

  function restoreDesktopSidebarState() {
    const shell = $('.sidi-shell');
    if (!shell || isMobileLayout()) return;

    if (localStorage.getItem('sidiSidebarCollapsed') === '1') {
      shell.classList.add('is-sidebar-collapsed');
    }
  }

  function renderDropdowns() {
    const notificationMenu = $('#notificationsMenu');
    if (notificationMenu && window.SIDI_DATA) {
      notificationMenu.innerHTML = `
        <div class="sidi-dropdown-title">Notificaciones</div>
        ${SIDI_DATA.notifications
          .map((item) => `
            <a class="sidi-dropdown-item" href="${item.href}">
              ${icon('notifications')}
              <span>
                <strong>${escapeHtml(item.title)}</strong><br>
                <span class="sidi-dropdown-note">${escapeHtml(item.meta)}</span>
              </span>
            </a>
          `)
          .join('')}
        <a class="sidi-dropdown-item" href="alertas.html">
          ${icon('open_in_new')}
          <span>Ver todas las alertas</span>
        </a>
      `;
    }

    const userMenu = $('#userMenu');
    if (userMenu && window.SIDI_DATA) {
      const user = SIDI_DATA.user;
      userMenu.innerHTML = `
        <div class="sidi-dropdown-title">${escapeHtml(user.name)}</div>
        <div class="sidi-dropdown-item">
          ${icon('person')}
          <span>
            <strong>${escapeHtml(user.role)}</strong><br>
            <span class="sidi-dropdown-note">${escapeHtml(user.email)}</span>
          </span>
        </div>
        <button class="sidi-dropdown-item" type="button" data-confirm="logout">
          ${icon('cancel')}
          <span>Cerrar sesión</span>
        </button>
      `;
    }
  }

  function initModals() {
    document.addEventListener('click', (event) => {
      const tooltipButton = event.target.closest('[data-tooltip]');
      if (tooltipButton) {
        $$('.sidi-title-help.is-tooltip-open').forEach((button) => {
          if (button !== tooltipButton) button.classList.remove('is-tooltip-open');
        });
        tooltipButton.classList.toggle('is-tooltip-open');
      }

      const navToggle = event.target.closest('.sidi-nav-toggle');
      if (navToggle) {
        toggleSection(navToggle.closest('[data-nav-section]'));
      }

      const navSubtoggle = event.target.closest('.sidi-nav-subtoggle');
      if (navSubtoggle) {
        toggleSubgroup(navSubtoggle.closest('[data-nav-subgroup]'));
      }

      const open = event.target.closest('[data-open-modal]');
      if (open) openModal(open.dataset.openModal);

      const close = event.target.closest('[data-close-modal]');
      if (close) closeModal(close.closest('.sidi-modal-layer')?.id);

      const confirmButton = event.target.closest('[data-confirm]');
      if (confirmButton) handleConfirm(confirmButton.dataset.confirm);
    });

    $$('.sidi-modal-layer').forEach((layer) => {
      layer.addEventListener('click', (event) => {
        if (event.target === layer) closeModal(layer.id);
      });
    });

    const searchInput = $('#globalSearchInput');
    searchInput?.addEventListener('input', () => filterSearch(searchInput.value));
  }

  function openModal(id) {
    $('#' + id)?.classList.add('is-open');
    setTimeout(() => $('#' + id + ' input')?.focus(), 50);
  }

  function closeModal(id) {
    if (id) $('#' + id)?.classList.remove('is-open');
  }

  function handleConfirm(kind) {
    const messages = {
      logout: ['Confirmar cierre de sesión', '¿Desea cerrar sesión?', 'Cerrar sesión', 'Sesión cerrada', 'La sesión se cerró correctamente.'],
      update: ['Confirmación de Actualización', '¿Está seguro de modificar el registro seleccionado?', 'Sí, actualizar', 'Actualización Exitosa', 'La información fue actualizada correctamente.'],
      delete: ['Confirmar eliminación', '¿Está seguro de eliminar el registro seleccionado?', 'Sí, eliminar', 'Eliminación Exitosa', 'El registro fue eliminado correctamente.'],
      inactive: ['Confirmación de Inactivación', '¿Está seguro de inactivar el registro seleccionado?', 'Sí, inactivar', 'Actualización Exitosa', 'La información fue actualizada correctamente.'],
      continue: ['Confirmación de Continuidad', 'Se identificó una alerta similar en el mismo periodo. ¿Desea continuar con el registro?', 'Sí, continuar', 'Registro Exitoso', 'La información fue registrada correctamente.']
    };

    const selected = messages[kind] || messages.update;
    openConfirm({
      type: kind === 'delete' ? 'danger' : 'confirm',
      title: selected[0],
      message: selected[1],
      confirmText: selected[2],
      successToast: {
        type: 'success',
        title: selected[3],
        message: selected[4]
      }
    });
  }

  function openConfirm(options) {
    const layer = $('#confirmModal');
    if (!layer) return;

    $('#confirmTitle').textContent = options.title;
    $('#confirmMessage').textContent = options.message;
    $('#confirmAccept').textContent = options.confirmText || 'Aceptar';
    layer.dataset.toastType = options.successToast?.type || 'success';
    layer.dataset.toastTitle = options.successToast?.title || 'Operación exitosa';
    layer.dataset.toastMessage = options.successToast?.message || 'La acción se realizó correctamente.';
    openModal('confirmModal');
  }

  document.addEventListener('click', (event) => {
    if (event.target.id !== 'confirmAccept') return;
    const layer = $('#confirmModal');
    closeModal('confirmModal');
    toast(layer.dataset.toastType, layer.dataset.toastTitle, layer.dataset.toastMessage);
  });

  function toast(type, title, message) {
    const area = $('.sidi-toast-area');
    if (!area) return;

    const element = document.createElement('div');
    element.className = `sidi-toast sidi-toast--${type || 'info'}`;
    const iconName = { success: 'check_circle', error: 'error', warning: 'warning', info: 'info' }[type] || 'info';

    element.innerHTML = `
      ${icon(iconName)}
      <div>
        <div class="sidi-toast-title">${escapeHtml(title)}</div>
        <div class="sidi-toast-message">${escapeHtml(message)}</div>
      </div>
      <button class="sidi-btn-icon" type="button" aria-label="Cerrar notificación">
        ${icon('close', 'sidi-icon--sm')}
      </button>
    `;

    area.appendChild(element);
    element.querySelector('button').addEventListener('click', () => element.remove());
    setTimeout(() => element.remove(), 5200);
  }

  function filterSearch(query) {
    const list = $('#globalSearchResults');
    if (!list || !window.SIDI_DATA) return;

    const value = query.trim().toLowerCase();
    const results = SIDI_DATA.reports
      .filter((report) => !value || report.title.toLowerCase().includes(value) || report.category.toLowerCase().includes(value))
      .slice(0, 8);

    list.innerHTML = results
      .map((report) => `
        <a class="sidi-dropdown-item" href="${reportHref(report)}">
          ${icon('bar_chart', 'sidi-icon--bi')}
          <span>
            <strong>${escapeHtml(report.title)}</strong><br>
            <span class="sidi-dropdown-note">${escapeHtml(report.category)}${report.group !== 'Reporte directo' ? ' / ' + escapeHtml(report.group) : ''}</span>
          </span>
        </a>
      `)
      .join('');
  }

  function initCopy() {
    document.addEventListener('click', (event) => {
      const button = event.target.closest('[data-copy]');
      if (!button) return;

      const source = $('#' + button.dataset.copy);
      if (source) navigator.clipboard?.writeText(source.textContent.trim());
      toast('success', 'Copiado', 'El código fue copiado correctamente.');
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
