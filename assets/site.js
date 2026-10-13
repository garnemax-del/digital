(() => {
  const script = document.currentScript;
  const root = new URL('../', script.src);
  const language = () => document.documentElement.lang === 'en' ? 'en' : 'ru';
  const update = () => {
    const lang = language();
    document.querySelectorAll('a[href*="wa.me/"]').forEach(el => {
      el.href = 'https://wa.me/905343582898?text=' + encodeURIComponent(lang === 'en' ? 'Hello! I found your website online. My enquiry is:' : 'Здравствуйте! Я нашёл ваш сайт в интернете. У меня следующий запрос:');
    });
    document.querySelectorAll('form[data-email-form]').forEach(form => {
      form.querySelector('[name="_next"]').value = new URL((lang === 'en' ? 'en/' : '') + 'thank-you.html', root).href;
    });
  };
  if (!document.querySelector('.whatsapp-float')) {
    const a = document.createElement('a');
    a.className = 'whatsapp-float'; a.href = 'https://wa.me/905343582898';
    a.target = '_blank'; a.rel = 'noopener'; a.setAttribute('aria-label', 'WhatsApp');
    a.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 3A13 13 0 0 0 4.8 22.6L3 29l6.6-1.7A13 13 0 1 0 16 3Zm0 2a11 11 0 1 1-5.7 20.4l-.4-.2-4 .9 1-3.9-.3-.4A11 11 0 0 1 16 5Zm-4 5c-.7 0-2 1-2 3 0 4 5 9 9 9 2 0 3-1.3 3-2l-3-1.5-1.2 1.3c-2-.8-4.7-3.5-5.5-5.5L14 13l-1.5-3Z"/></svg>';
    document.body.append(a);
  }
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    const group = button.closest('[data-filter-group]');
    group.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    group.querySelectorAll('[data-category]').forEach(card => {card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;});
  }));
  document.querySelectorAll('[data-gallery-direction]').forEach(button => button.addEventListener('click', () => {
    const track = button.parentElement.querySelector('.photo-track');
    track.scrollBy({left: Number(button.dataset.galleryDirection) * track.clientWidth * .8, behavior:'smooth'});
  }));
  update();
})();
