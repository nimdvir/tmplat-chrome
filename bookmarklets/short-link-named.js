// Short link (name it): asks what to call the short link, then opens the d.nimdvir.com admin
// page with the form filled in. Click Create there and the new link is copied to the clipboard.
// No passcode is stored in the bookmark; the admin page asks for it if the tab isn't unlocked.
(() => {
  const suggestion = document.title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter((w) => w && !/^(the|a|an|of|and|or|for|to|in|on|at|with|by|from)$/.test(w))
    .slice(0, 3)
    .join('-')
    .slice(0, 24);
  const name = prompt('Short link name (letters, numbers, - or _):', suggestion);
  if (name === null) return;
  const slug = name.trim().toLowerCase().replace(/\s+/g, '-');
  if (!/^[a-z0-9][a-z0-9_-]{0,47}$/.test(slug)) {
    alert('Use 1-48 lowercase letters, numbers, - or _, starting with a letter or number.');
    return;
  }
  const target = new URL('https://d.nimdvir.com/admin');
  target.searchParams.set('url', location.href);
  target.searchParams.set('title', document.title);
  target.searchParams.set('slug', slug);
  open(target.href, '_blank');
})();
