// JS del contenedor padre (NO modifica la lógica interna de las calculadoras)
document.addEventListener("DOMContentLoaded", () => {
  // Animación de aparición al hacer scroll
  const containers = document.querySelectorAll(".calc-container");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.15 }
  ); 

  containers.forEach((c) => observer.observe(c));

  // Logs para verificar que los iframes se cargan bien
  const frameIds = [
    "frameExpresiones",
    "frameRecta",
    "frameComplejos",
    "frameOperaciones",
    "frameProductos",
    "frameDivision",
    "frameEcuaciones"
  ];

  frameIds.forEach((id) => {
    const frame = document.getElementById(id);
    if (frame) {
      frame.addEventListener("load", () => {
        console.log("📌 Iframe cargado:", id);
      });
    } else {
      console.warn("⚠ No se encontró el iframe con id:", id);
    }
  });

  console.log("🚀 JS padre listo (7 calculadoras unificadas)");
});