const submenusState = {
  page: 1,
  pageSize: 10,
  search: ''
};

const submenuPermissionsState = {
  page: 1,
  pageSize: 5
};

function actionButton(icon, label, attrs) {
  return `<button class="sidi-btn-icon" type="button" ${attrs} aria-label="${label}" title="${label}">${SIDI.icon(icon, 'sidi-icon--sm')}</button>`;
}

function renderTable(target, headers, rows, pageInfo, onPageChange) {
  const body = rows.length
    ? rows.join('')
    : `<tr><td colspan="${headers.length}">No se encontraron registros.</td></tr>`;

  const container = document.getElementById(target);
  container.innerHTML = `
    <section class="sidi-table-shell">
      <div class="sidi-table-wrapper">
        <table class="sidi-table">
          <thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
          <tbody>${body}</tbody>
        </table>
      </div>
      <div class="sidi-table-foot" data-pagination="${target}"></div>
    </section>`;

  const pagination = container.querySelector(`[data-pagination="${target}"]`);
  SIDI.renderPagination({ container: pagination, ...pageInfo });
  pagination.addEventListener('click', (event) => {
    const button = event.target.closest('[data-page]');
    if (!button || button.disabled) return;
    onPageChange(Number(button.dataset.page));
  });
}

function filterSubmenus(query) {
  const value = (query || '').trim().toLowerCase();
  return SIDI_DATA.submenus.filter((item) => {
    return !value
      || item.code.toLowerCase().includes(value)
      || item.menu.toLowerCase().includes(value)
      || item.submenu.toLowerCase().includes(value)
      || item.registered.toLowerCase().includes(value)
      || String(item.order).includes(value);
  });
}

function paintSubmenus() {
  const data = filterSubmenus(submenusState.search);
  const pageInfo = SIDI.paginate(data, submenusState.page, submenusState.pageSize);
  submenusState.page = pageInfo.page;

  const rows = pageInfo.items.map((item, index) => `
    <tr>
      <td>${pageInfo.start + index}</td>
      <td>${item.code}</td>
      <td>${item.menu}</td>
      <td>${item.submenu}</td>
      <td>${item.registered}</td>
      <td>${item.order}</td>
      <td>
        <div class="sidi-table-actions">
          ${actionButton('edit', 'Actualizar Submenú', 'data-open-modal="modalSubmenu"')}
          ${actionButton('person', 'Permisos', 'data-open-modal="modalPermisos"')}
          ${actionButton('delete', 'Eliminar Submenú', 'data-confirm="delete"')}
        </div>
      </td>
    </tr>`);

  renderTable(
    'submenusTable',
    ['N°', 'Código', 'Menú', 'Submenú', 'Fecha de registro', 'Orden', 'Acciones'],
    rows,
    pageInfo,
    (page) => {
      submenusState.page = page;
      paintSubmenus();
    }
  );
}

function paintPermissions() {
  const pageInfo = SIDI.paginate(SIDI_DATA.roles, submenuPermissionsState.page, submenuPermissionsState.pageSize);
  submenuPermissionsState.page = pageInfo.page;
  const rows = pageInfo.items.map((role, index) => `
    <tr>
      <td>${pageInfo.start + index}</td>
      <td>${role.id}</td>
      <td>${role.code}</td>
      <td>${role.name}</td>
      <td><input type="checkbox" ${role.checked ? 'checked' : ''} aria-label="Asignar permiso a ${role.name}"></td>
    </tr>`);

  renderTable(
    'permissionsTable',
    ['N°', 'ID', 'Código', 'Nombre', 'Acciones'],
    rows,
    pageInfo,
    (page) => {
      submenuPermissionsState.page = page;
      paintPermissions();
    }
  );
}

document.addEventListener('DOMContentLoaded', () => {
  paintSubmenus();
  paintPermissions();

  const form = document.getElementById('submenusSearchForm');
  const input = document.getElementById('submenusSearchInput');
  const dependency = document.getElementById('submenuHasParent');
  const parent = document.getElementById('submenuParent');

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    submenusState.search = input?.value || '';
    submenusState.page = 1;
    paintSubmenus();
  });

  dependency?.addEventListener('change', () => {
    if (parent) parent.disabled = !dependency.checked;
  });
});
