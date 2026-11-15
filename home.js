(() => {
  'use strict';
  const scene = document.querySelector('.noren-scene');
  const stage = document.querySelector('.noren-stage');
  const panels = [...document.querySelectorAll('.noren-panel')];
  const photo = document.querySelector('.noren-photo');
  const enter = document.querySelector('.noren-enter');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const light = /Line\//i.test(navigator.userAgent);
  let frame = 0;
  let previousTime = 0;
  let progress = 0;
  let target = 0;
  let range = 1;
  let sceneTop = 0;
  const motionAllowed = () => !reduced.matches && !light;
  const clamp = value => Math.max(0, Math.min(1, value));
  const ease = value => value * value * (3 - 2 * value);

  function paint() {
    panels.forEach((panel, i) => {
      // The middle cloth leads slightly; all three finish above the doorway.
      const delay = [0.025, 0, 0.045][i];
      const lifted = ease(clamp((progress - delay) / (1 - delay)));
      const sway = Math.sin(lifted * Math.PI);
      panel.style.transform = motionAllowed()
        ? `translate3d(0, ${-lifted * 115}%, 0) rotateX(${sway * 5}deg) rotateZ(${(i - 1) * sway * 1.2}deg)` : '';
    });
    if (photo) photo.style.transform = motionAllowed()
      ? `scale(${1.025 + ease(progress) * 0.045})` : '';
    if (enter) enter.querySelector('span').textContent = progress > .97 ? 'お店のことを見る' : '暖簾をくぐる';
  }

  function animate(time) {
    frame = 0;
    // Time-based smoothing feels the same on 60 Hz and 120 Hz screens.
    const elapsed = previousTime ? Math.min(time - previousTime, 64) : 16;
    previousTime = time;
    progress += (target - progress) * (1 - Math.exp(-elapsed / 95));
    if (Math.abs(target - progress) < .0001) progress = target;
    paint();
    if (progress !== target) frame = requestAnimationFrame(animate);
    else previousTime = 0;
  }

  function schedule() {
    if (!scene || !stage || !motionAllowed() || document.hidden) return;
    target = clamp((window.scrollY - sceneTop) / range);
    if (!frame && target !== progress) frame = requestAnimationFrame(animate);
  }
  function measure(scheduleFrame = true) {
    if (!scene || !stage) return;
    sceneTop = scene.getBoundingClientRect().top + window.scrollY;
    range = Math.max(1, scene.offsetHeight - stage.offsetHeight);
    if (scheduleFrame) schedule();
  }
  function configure() {
    cancelAnimationFrame(frame);
    frame = 0;
    previousTime = 0;
    scene?.classList.toggle('motion-enabled', motionAllowed());
    if (enter) enter.hidden = !motionAllowed();
    measure(false);
    progress = target = motionAllowed() ? clamp((window.scrollY - sceneTop) / range) : 0;
    paint();
  }
  enter?.addEventListener('click', () => {
    if (target > .97) document.getElementById('concept')?.scrollIntoView({behavior:'smooth'});
    else window.scrollTo({top:sceneTop + range, behavior:motionAllowed() ? 'smooth' : 'auto'});
  });
  window.addEventListener('scroll', schedule, {passive:true});
  window.addEventListener('resize', measure, {passive:true});
  window.addEventListener('pageshow', configure);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; previousTime = 0; }
    else configure();
  });
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
