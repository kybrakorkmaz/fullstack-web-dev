console.log("⭐ star.js yüklendi!");

$(document).ready(function() {
  const $container = $('.star-container');
  const numStars = 40; 

  for (let i = 0; i < numStars; i++) {
    const $star = $(document.createElementNS("http://www.w3.org/2000/svg", "svg"))
      .attr("viewBox", "0 0 24 24")
      .addClass("star")
      .append($(document.createElementNS("http://www.w3.org/2000/svg", "polygon"))
        .attr("points", "12,2 15,8 22,9 17,14 18,21 12,18 6,21 7,14 2,9 9,8")
        .attr("fill", "white")
      )
      .css({
        'width': `${Math.random() * 20 + 10}px`,
        'height': `${Math.random() * 20 + 10}px`,
        'left': `${Math.random() * 100}%`,
        'animation-duration': `${Math.random() * 5 + 5}s`,
        'animation-delay': `${Math.random() * 5}s`
      });

    $container.append($star);
  }
});