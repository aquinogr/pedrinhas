/* Galerias das três alternativas; os modelos e as plantas permanecem como referência geométrica. */
(() => {
  const names = { edicula: 'Casa da Galeria · Edícula', patio: 'Casa do Pátio', jardim: 'Casa do Jardim' };
  const views = [
    { file: '01-conjunto-aereo', title: 'Conjunto visto de cima' },
    { file: '02-fachada', title: 'Fachada e varanda' },
    { file: '03-piscina-e-quiosque', title: 'Piscina e quiosque' }
  ];
  const root = document.querySelector('#renders');
  if (!root) return;
  const image = root.querySelector('#render-image');
  const full = root.querySelector('#render-full');
  const download = root.querySelector('#render-download');
  const caption = root.querySelector('#render-caption');
  const choices = root.querySelector('#render-choices');
  let project = '', selected = 0;

  function select(index) {
    selected = index;
    const view = views[index];
    const src = `assets/renders/${project}/${view.file}.jpg`;
    image.src = src;
    image.alt = `${names[project]} — ${view.title.toLowerCase()}, visualização fotorrealista`;
    full.href = download.href = src;
    full.setAttribute('aria-label', `Ampliar: ${names[project]} — ${view.title}`);
    download.download = `${project}-${view.file}.jpg`;
    caption.textContent = `${names[project]} · ${view.title}`;
    choices.querySelectorAll('button').forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
  }

  choices.addEventListener('click', event => {
    const button = event.target.closest('button[data-render-index]');
    if (button) select(Number(button.dataset.renderIndex));
  });
  choices.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (selected + (event.key === 'ArrowRight' ? 1 : 2)) % 3;
    select(next);
    choices.querySelectorAll('button')[next].focus();
  });

  window.RENDER_GALLERY = {
    show(key) {
      if (!names[key] || project === key) return;
      project = key;
      root.querySelector('#render-house').textContent = names[key];
      choices.replaceChildren(...views.map((view, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.renderIndex = index;
        button.setAttribute('aria-label', `Mostrar ${view.title.toLowerCase()} de ${names[key]}`);
        const thumbnail = document.createElement('img');
        thumbnail.src = `assets/renders/${key}/${view.file}-thumb.jpg`;
        thumbnail.alt = '';
        thumbnail.loading = 'lazy';
        thumbnail.decoding = 'async';
        const label = document.createElement('span');
        label.textContent = view.title;
        button.append(thumbnail, label);
        return button;
      }));
      select(0);
    }
  };
})();
