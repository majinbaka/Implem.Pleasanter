document.addEventListener('DOMContentLoaded', () => {
  const buildNoteUrl = (siteIDtable, id) =>
    `/items/${$p.siteId(_1171NOTETITLE)}/new?FromSiteId=${siteIDtable}&LinkId=${id}&FromTabIndex=0&NotReturnParentRecord=false`;

  document.querySelectorAll('.note-1711 div').forEach(button => {
    button.addEventListener('click', e => {
      e.stopPropagation();

      const tr = button.closest('tr');
      const table = button.closest('table');
      if (!tr || !table) return;

      const id = tr.dataset.id;
      const siteIDtable = table.dataset.id;
      if (!id || !siteIDtable) return;

      window.location.href = buildNoteUrl(siteIDtable, id);
    });
  });
});
