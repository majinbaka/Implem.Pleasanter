document.addEventListener('DOMContentLoaded', () => {
  const buildDrillUrl = id => `/items/${id}`;

  document.querySelectorAll('.drill-button-1711:not(.note-1711) div').forEach(button => {
    button.addEventListener('click', e => {
      e.stopPropagation();

      const tr = button.closest('tr');
      const table = button.closest('table');
      if (!tr || !table) return;

      const id = tr.dataset.id;
      if (!id) return;

      window.location.href = buildDrillUrl(id);
    });
  });
});
