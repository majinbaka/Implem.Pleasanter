(function cleanupElements() {
  if ($p.responsive()) {
    const removeById = id => document.getElementById(id)?.remove();
    ['RecordHeader', 'Notes'].forEach(removeById);
  }
  const input = document.getElementById('JoinedSites');
  const currentSiteId = document.getElementById('SiteId')?.value;
})();
