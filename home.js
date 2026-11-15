(() => {
  'use strict';
  const scene = document.querySelector('.noren-scene');
  const stage = document.querySelector('.noren-stage');
  const panels = [...document.querySelectorAll('.noren-panel')];
  const enter = document.querySelector('.noren-enter');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const light = /Line\//i.test(navigator.userAgent);
  let frame = 0;
  const motionAllowed = () => !reduced.matches && !light;
  function draw() {
    frame = 0;
    if (!scene || !stage) return;
    const range = Math.max(1, scene.offsetHeight - stage.offsetHeight);
    const progress = Math.max(0, Math.min(1, -scene.getBoundingClientRect().top / range));
    panels.forEach((panel, i) => {
      panel.style.transform = motionAllowed()
        ? `translateY(${-progress * 115}%) rotate(${(i - 1) * progress * 5}deg)` : '';
    });
    if (enter) enter.querySelector('span').textContent = progress > .9 ? 'お店のことを見る' : '暖簾をくぐる';
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(draw); }
  function configure() {
    scene?.classList.toggle('motion-enabled', motionAllowed());
    if (enter) enter.hidden = !motionAllowed();
    draw();
  }
  enter?.addEventListener('click', () => {
    const range = scene.offsetHeight - stage.offsetHeight;
    const top = scene.getBoundingClientRect().top + scrollY;
    const opened = -scene.getBoundingClientRect().top / Math.max(1, range) > .9;
    if (opened) document.getElementById('concept').scrollIntoView({behavior:'smooth'});
    else window.scrollTo({top:top + range, behavior:motionAllowed() ? 'smooth' : 'auto'});
  });
  window.addEventListener('scroll', schedule, {passive:true});
  window.addEventListener('resize', schedule, {passive:true});
  reduced.addEventListener('change', configure);
  configure();

  const grid = document.getElementById('blog-latest-grid');
  fetch('./blog/posts.json', {cache:'no-store'}).then(r => {
    if (!r.ok) throw new Error('posts');
    return r.json();
  }).then(data => {
    if (!Array.isArray(data.posts)) throw new Error('posts');
    if (!data.posts.length) return;
    const fragment = document.createDocumentFragment();
    [...data.posts].sort((a,b) => String(b.date).localeCompare(String(a.date))).slice(0,3).forEach(post => {
      const a = document.createElement('a');
      a.className = 'home-news-row';
      a.href = './blog/posts/post.html?slug=' + encodeURIComponent(post.slug);
      const time = document.createElement('time');
      time.dateTime = post.date;
      time.textContent = String(post.date || '').replaceAll('-','.');
      const title = document.createElement('span');
      title.textContent = post.title;
      const arrow = document.createElement('span');
      arrow.textContent = '↗';
      arrow.setAttribute('aria-hidden','true');
      a.append(time,title,arrow);
      fragment.append(a);
    });
    grid.replaceChildren(fragment);
  }).catch(() => {}); // The HTML fallback remains usable.
})();
