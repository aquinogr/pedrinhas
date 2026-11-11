(() => {
  const houses = {
    edicula: { name: 'Casa da Galeria', subtitle: 'Edícula lateral · suítes voltadas ao jardim', description: 'A vida social ocupa a frente. Uma galeria coberta conecta os quartos ao jardim e ao quiosque, criando um caminho acolhedor até a piscina. A varanda superior se abre para a paisagem.' },
    patio: { name: 'Casa do Pátio', subtitle: 'Pátio de luz · lazer ao fundo', description: 'Um pátio descoberto traz luz e verde para o centro da casa. O estar se abre para esse jardim e segue até a cozinha e o gourmet. Ao fundo, piscina e quiosque aproximam os momentos de descanso e convivência.' },
    jardim: { name: 'Casa do Jardim', subtitle: 'Salão voltado ao quintal · piscina transversal', description: 'O jardim organiza a área de lazer. A sala e o gourmet se abrem para a piscina transversal, enquanto o quiosque independente cria outro espaço de encontro. O telhado de quatro águas e a varanda frontal completam a proposta.' }
  };
  function show(key, updateUrl) {
    if (!Object.hasOwn(houses, key)) key = 'edicula';
    const house = houses[key];
    document.querySelector('#name').textContent = house.name;
    document.querySelector('#subtitle').textContent = house.subtitle;
    document.querySelector('#description').textContent = house.description;
    document.querySelectorAll('[data-project]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.project === key)));
    window.RENDER_GALLERY.show(key);
    document.title = `${house.name} · Pedrinhas`;
    if (updateUrl) {
      const url = new URL(location.href);
      url.searchParams.set('projeto', key);
      history.replaceState(null, '', url);
    }
  }
  document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => show(button.dataset.project, true)));
  window.addEventListener('popstate', () => show(new URLSearchParams(location.search).get('projeto'), false));
  show(new URLSearchParams(location.search).get('projeto'), false);
})();
