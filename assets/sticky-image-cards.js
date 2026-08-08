document.addEventListener("DOMContentLoaded", () => {

  const texts = document.querySelectorAll(".sticky-cards__text");
  const images = document.querySelectorAll(".sticky-cards__image");

  if (!texts.length) return;

  const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        const index = entry.target.dataset.index;

        images.forEach(img => img.classList.remove("active"));

        const active = document.querySelector(
          `.sticky-cards__image[data-index="${index}"]`
        );

        if (active) active.classList.add("active");

      }

    });

  }, {
    threshold: 0.5
  });

  texts.forEach(text => observer.observe(text));

  if (images[0]) images[0].classList.add("active");

});