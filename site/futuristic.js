// Shared lightweight canvas particle/mesh effect for futuristic concept pages.
// No external dependencies, self-contained.
(function(){
  var reducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initParticles(canvasId, opts){
    var canvas = document.getElementById(canvasId);
    if(!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var count = (opts && opts.count) || 46;
    var color = (opts && opts.color) || '79,168,255';
    var w, h;

    function resize(){
      w = canvas.width = canvas.offsetWidth * devicePixelRatio;
      h = canvas.height = canvas.offsetHeight * devicePixelRatio;
    }
    resize();
    window.addEventListener('resize', resize);

    for(var i=0;i<count;i++){
      particles.push({
        x: Math.random()*w,
        y: Math.random()*h,
        vx: (Math.random()-0.5)*0.25*devicePixelRatio,
        vy: (Math.random()-0.5)*0.25*devicePixelRatio,
        r: (Math.random()*1.6+0.6)*devicePixelRatio
      });
    }

    var mouseX = -9999, mouseY = -9999;
    canvas.addEventListener('mousemove', function(e){
      var rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) * devicePixelRatio;
      mouseY = (e.clientY - rect.top) * devicePixelRatio;
    });
    canvas.addEventListener('mouseleave', function(){ mouseX=-9999; mouseY=-9999; });

    function frame(){
      ctx.clearRect(0,0,w,h);
      for(var i=0;i<particles.length;i++){
        var p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if(p.x<0||p.x>w) p.vx*=-1;
        if(p.y<0||p.y>h) p.vy*=-1;

        var dx = p.x-mouseX, dy = p.y-mouseY;
        var dist = Math.sqrt(dx*dx+dy*dy);
        if(dist < 140*devicePixelRatio){
          var force = (1 - dist/(140*devicePixelRatio)) * 0.6;
          p.x += dx*force*0.02;
          p.y += dy*force*0.02;
        }

        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle = 'rgba('+color+',0.55)';
        ctx.fill();
      }
      for(var i=0;i<particles.length;i++){
        for(var j=i+1;j<particles.length;j++){
          var a=particles[i], b=particles[j];
          var dx=a.x-b.x, dy=a.y-b.y;
          var d = Math.sqrt(dx*dx+dy*dy);
          if(d < 120*devicePixelRatio){
            ctx.beginPath();
            ctx.moveTo(a.x,a.y);
            ctx.lineTo(b.x,b.y);
            ctx.strokeStyle = 'rgba('+color+','+(0.12*(1-d/(120*devicePixelRatio)))+')';
            ctx.lineWidth = devicePixelRatio*0.6;
            ctx.stroke();
          }
        }
      }
      if(!reducedMotion) requestAnimationFrame(frame);
    }
    if(reducedMotion){
      frame(); // draw a single static frame, no animation loop
    } else {
      requestAnimationFrame(frame);
    }
  }

  function initParallax(selector){
    if(reducedMotion) return;
    var els = document.querySelectorAll(selector);
    if(!els.length) return;
    document.addEventListener('mousemove', function(e){
      var cx = (e.clientX / window.innerWidth) - 0.5;
      var cy = (e.clientY / window.innerHeight) - 0.5;
      els.forEach(function(el, i){
        var depth = parseFloat(el.getAttribute('data-depth') || (0.4 + i*0.15));
        el.style.transform = 'translate(' + (cx*depth*30) + 'px,' + (cy*depth*30) + 'px)';
      });
    });
  }

  window.FX = { initParticles: initParticles, initParallax: initParallax };
})();
