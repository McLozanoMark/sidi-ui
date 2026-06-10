const categoriesState = {
  page: 1,
  pageSize: 10,
  search: ''
};

const categoryPermissionsState = {
  page: 1,
  pageSize: 5
};

function tag(status) {
  const map = { Activa: 'success', Inactivo: 'inactive', Cerrada: 'neutral', Anulada: 'error' };
  return `<span class="sidi-tag sidi-tag--${map[status] || 'neutral'}">${status}</span>`;
}

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

function filterCategories(query) {
  const value = (query || '').trim().toLowerCase();
  return SIDI_DATA.categories.filter((item) => {
    return !value
      || item.code.toLowerCase().includes(value)
      || item.name.toLowerCase().includes(value)
      || item.menuPrincipal.toLowerCase().includes(value)
      || item.registered.toLowerCase().includes(value)
      || String(item.order).includes(value)
      || item.status.toLowerCase().includes(value);
  });
}

function paintCategories() {
  const data = filterCategories(categoriesState.search);
  const pageInfo = SIDI.paginate(data, categoriesState.page, categoriesState.pageSize);
  categoriesState.page = pageInfo.page;

  const rows = pageInfo.items.map((item, index) => `
    <tr>
      <td>${pageInfo.start + index}</td>
      <td>${item.code}</td>
      <td>${item.name}</td>
      <td>${item.menuPrincipal}</td>
      <td>${item.registered}</td>
      <td>${item.order}</td>
      <td>${tag(item.status)}</td>
      <td>
        <div class="sidi-table-actions">
          ${actionButton('edit', 'Actualizar', 'data-open-modal="modalCategoria"')}
          ${actionButton('person', 'Permisos', 'data-open-modal="modalPermisos"')}
          ${actionButton('delete', 'Eliminar', 'data-confirm="delete"')}
        </div>
      </td>
    </tr>`);

  renderTable(
    'categoriesTable',
    ['N°', 'Código categoría', 'Categoría', 'Menú Principal', 'Fecha de registro', 'Orden', 'Estado', 'Acciones'],
    rows,
    pageInfo,
    (page) => {
      categoriesState.page = page;
      paintCategories();
    }
  );
}

function paintPermissions() {
  const pageInfo = SIDI.paginate(SIDI_DATA.roles, categoryPermissionsState.page, categoryPermissionsState.pageSize);
  categoryPermissionsState.page = pageInfo.page;
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
      categoryPermissionsState.page = page;
      paintPermissions();
    }
  );
}

document.addEventListener('DOMContentLoaded', () => {
  paintCategories();
  paintPermissions();

  const form = document.getElementById('categoriesSearchForm');
  const input = document.getElementById('categoriesSearchInput');

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    categoriesState.search = input?.value || '';
    categoriesState.page = 1;
    paintCategories();
  });
});
