const alertsState = {
  page: 1,
  pageSize: 10,
  search: ''
};

function actionButton(icon, label, attrs) {
  return `<button class="sidi-btn-icon" type="button" ${attrs} aria-label="${label}" title="${label}">${SIDI.icon(icon, 'sidi-icon--sm')}</button>`;
}

function renderTable(target, headers, rows, pageInfo) {
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
    alertsState.page = Number(button.dataset.page);
    paintAlerts();
  });
}

function filterAlerts(query) {
  const value = (query || '').trim().toLowerCase();
  return SIDI_DATA.alerts.filter((item) => {
    return !value
      || item.code.toLowerCase().includes(value)
      || item.name.toLowerCase().includes(value)
      || item.description.toLowerCase().includes(value)
      || item.desde.toLowerCase().includes(value)
      || item.hasta.toLowerCase().includes(value);
  });
}

function paintAlerts() {
  const data = filterAlerts(alertsState.search);
  const pageInfo = SIDI.paginate(data, alertsState.page, alertsState.pageSize);
  alertsState.page = pageInfo.page;

  const rows = pageInfo.items.map((item, index) => `
    <tr>
      <td>${pageInfo.start + index}</td>
      <td>${item.code}</td>
      <td>${item.name}</td>
      <td>${item.description}</td>
      <td>${item.desde}</td>
      <td>${item.hasta}</td>
      <td>
        <div class="sidi-table-actions">
          ${actionButton('edit', 'Actualizar alerta', 'data-open-modal="modalAlerta"')}
          ${actionButton('delete', 'Eliminar', 'data-confirm="delete"')}
        </div>
      </td>
    </tr>`);

  renderTable('alertsTable', ['N°', 'ID Alerta', 'Nombre', 'Descripción', 'Desde', 'Hasta', 'Acciones'], rows, pageInfo);
}

document.addEventListener('DOMContentLoaded', () => {
  paintAlerts();

  const form = document.getElementById('alertsSearchForm');
  const input = document.getElementById('alertsSearchInput');

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    alertsState.search = input?.value || '';
    alertsState.page = 1;
    paintAlerts();
  });
});
