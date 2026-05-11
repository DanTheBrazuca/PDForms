document.addEventListener("DOMContentLoaded", () => {
  /* Inicializa carrossel de anexos */
  const track = document.querySelector("[data-carousel-track]");
  if (track) {
    const prev = document.querySelector("[data-carousel-prev]");
    const next = document.querySelector("[data-carousel-next]");
    const cards = () => Array.from(track.querySelectorAll(".card-link"));
    let index = 0;

    const visibleCount = () => {
      /* Calcula cards por viewport */
      const w = window.innerWidth;
      if (w < 680) return 1;
      if (w < 900) return 2;
      return 3;
    };

    const maxIndex = () => Math.max(0, cards().length - visibleCount());

    /* Atualiza posição carrossel */
    const update = () => {
      index = Math.max(0, Math.min(index, maxIndex()));
      const card = track.querySelector(".card-link");
      if (!card) return;
      /* Espaço entre os cartões */
      const gap = 14;
      const cardWidth = card.getBoundingClientRect().width;
      /* Anima movimento com translate */
      track.style.transform = `translateX(${-index * (cardWidth + gap)}px)`;
      if (prev) prev.disabled = index === 0;
      /* Desativa botão no final */
      if (next) next.disabled = index >= maxIndex();
    };

    prev?.addEventListener("click", () => {
      index -= 1;
      update();
    });
    next?.addEventListener("click", () => {
      index += 1;
      update();
    });
    window.addEventListener("resize", update);
    update();
  }
});
