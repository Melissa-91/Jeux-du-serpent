window.onload = function() {
  var canvas = document.createElement("canvas");
  var affichage = document.createElement("div");
  var tige = document.createElement("div");
  var pieds = document.createElement("div");
  tige.id = "tige";
  pieds.id = "pieds";
  pieds.innerHTML = "GAME TV";
  //affichage.style.border = "2px solid black";
  //affichage.height = 80;
  affichage.id = "affichage";
  canvas.width = 900;
  canvas.height = 600;
  //canvas.style.border = "2px solid black";
  document.body.appendChild(affichage);
  document.body.appendChild(canvas);
  document.body.appendChild(tige);
  document.body.appendChild(pieds);
  var canvasWidth = canvas.width;
  var canvasHeight = canvas.height;
  var ctx = canvas.getContext("2d");
  var collision = false;
  var score =0;
  var vie = 3;
  var niveau = 0;
  var codeTouche = 0;
  var pause = false;


  document.addEventListener("keydown", interaction);

  /* Prop serpent*/
  var colorSerp = "teal";
  var tailleSerp = 15; // taille d'un block du serpent
  var nombreBlockParWidth = canvasWidth/tailleSerp;
  var nombreBlockParHeight = canvasHeight/tailleSerp;
  var xSerp = Math.trunc(Math.random()*nombreBlockParWidth)*tailleSerp;;
  var ySerp = Math.trunc(Math.random()*nombreBlockParHeight)*tailleSerp;
  var deplX = 0;
  var deplY = 0;
  var tailleBody = 5;
  var bodySerp = []; // le corps du serpent Expl: [{x:3,y:5},{x:3,y:6}]

  /* Prop pomme*/
  var colorPomme = "red";
  var xPomme = Math.trunc(Math.random()*nombreBlockParWidth)*tailleSerp;
  var yPomme =Math.trunc(Math.random()*nombreBlockParHeight)*tailleSerp;
  var rayonPomme = tailleSerp/2;
  var tempsPomme =0;
  var tempsMaxPomme = 100;

  // prop Bonus
  var colorBonus = "green";
  var xBonus = Math.trunc(Math.random()*nombreBlockParWidth)*tailleSerp;
  var yBonus = Math.trunc(Math.random()*nombreBlockParHeight)*tailleSerp;
  var tempsBonus = 0;
  var afficheBonus = false;


  var intervalID = setInterval(game,100);
  affiche();
  //fonction qui lance le jeu
  function game() {
    dessinerSerpent();
    dessinerPomme();
    detectionCollition();
    verifMangerPomme();
    gestionVieSerpent();
    gestionAffichageBonus();
  }

  /* function qui gère la position du serpent*/
  function gestionPositionSerpent() {
    xSerp = xSerp + deplX*tailleSerp;
    ySerp = ySerp + deplY*tailleSerp;
    bodySerp.push({x:xSerp,y:ySerp});
    while (bodySerp.length > tailleBody) {
      bodySerp.shift();
    }
  }

  /* fonction qui déssine le serpent*/
  function dessinerSerpent() {
    ctx.clearRect(0,0,canvasWidth,canvasHeight);
    gestionPositionSerpent();
    ctx.fillStyle = colorSerp;
    for (var i = 0; i < bodySerp.length; i++) {
      ctx.fillRect(bodySerp[i].x, bodySerp[i].y, tailleSerp-1, tailleSerp-1);
    }
  }

  // fonction qui dessine la xPomme
  function dessinerPomme() {
    ctx.font = "15px Arial";
    ctx.fillStyle = colorPomme;
    ctx.fillText("🍎",xPomme+1,yPomme+1);
  }
    
    /* ctx.beginPath();
    ctx.arc(xPomme+rayonPomme,yPomme+rayonPomme, rayonPomme, 0, 2*Math.PI);
    ctx.fillStyle = colorPomme;
    ctx.fill();
    ctx.font = "5px Arial";
    ctx.fillStyle = "green";
    ctx.fillText("V",xPomme+1,yPomme+1);
    ctx.closePath();
  } */

  //fonction qui dessine le Bonus
  function dessinerBonus() {
    ctx.font = "15px Arial";
    //ctx.fillStyle = "red";
    //ctx.fillRect(xBonus,yBonus,tailleSerp,tailleSerp);
    ctx.fillStyle = colorBonus;
    ctx.fillText("🐸",xBonus+1,yBonus+14);
  }

  // fonction qui initialise la position de la Pomme
  function initPositionPomme() {
    xPomme = Math.trunc(Math.random()*nombreBlockParWidth)*tailleSerp;
    yPomme =Math.trunc(Math.random()*nombreBlockParHeight)*tailleSerp;
  }


  // fonction qui initialise la position du serpent
  function initPositionSerpent() {
    xSerp = Math.trunc(Math.random()*nombreBlockParWidth)*tailleSerp;;
    ySerp = Math.trunc(Math.random()*nombreBlockParHeight)*tailleSerp;
  }
  // fonction qui initialise la position du Bonus
  function initPositionBonus() {
    xBonus = Math.trunc(Math.random()*nombreBlockParWidth)*tailleSerp;;
    yBonus = Math.trunc(Math.random()*nombreBlockParHeight)*tailleSerp;
  }

  /* Détection de collision*/
  function detectionCollition() {
    //cas 1 : le serpent se mord
    if (bodySerp.length>5) {
      for (var i = 0; i < bodySerp.length-1; i++) {
        if(bodySerp[i].x == bodySerp[bodySerp.length-1].x &&
           bodySerp[i].y == bodySerp[bodySerp.length-1].y){
             collision = true;
             break;
           }

      }
    }

    //cas 2: le serpent sort du canvas
    if (xSerp < 0 || ySerp < 0 || xSerp+tailleSerp > canvasWidth ||
        ySerp+tailleSerp > canvasHeight) {
      collision = true;
    }

  }

  // fonction qui vérifie si on a mangé la pomme
  function verifMangerPomme() {
    if(xPomme == xSerp && yPomme == ySerp){
      initPositionPomme();
      score += 10 + 3*bodySerp.length;
      niveau = Math.trunc(score/300);
      tailleBody +=5;
      affiche();
    }else if (tempsPomme++ > tempsMaxPomme) {
      initPositionPomme();
      tempsPomme=0;
    }
  }
  /* fonction qui affiche le score*/
  function affiche() {
    var message = "Score : "+score+" point(s) | Vies : "+vie+" | Niveau : "+niveau;
    document.getElementById("affichage").innerHTML = message;
  }
  // fonction qui gère la vie du serpent
  function gestionVieSerpent() {
    if (pause == true) {
      collision = false;
      return;
    }
    if(collision){
      vie--;
      collision = false;
      tailleBody =5;
      initPositionPomme();
      initPositionSerpent();
      affiche();
      bodySerp = [bodySerp[bodySerp.length-1]];
      if (vie==0) {
        ctx.fillStyle = "#fff";
        ctx.font = "40px Arial";
        ctx.fillText("GAME OVER", canvasWidth/2-130, canvasHeight/2);
        ctx.font = "15px Arial";
        ctx.fillText("SCORE : "+score+" point(s)", canvasWidth/2 -130, canvasHeight*2/3);
        ctx.fillText("Appuyer sur la touche ENTRER du clavier pour rejouer !", canvasWidth/2-130, canvasHeight*3/4);
        clearTimeout(intervalID);
      }
    }
  }
  // fonction qui sert à gérer l'affichage du Bonus
  function gestionAffichageBonus() {
    if (tempsBonus++ > 50) {
      tempsBonus =0;
      // on peut afficher le bonus
      if (Math.random() > 0.8) {
        //on va afficher le bonus
        initPositionBonus();
        afficheBonus = true;
      }else {
        //on va pas afficher le bonus
        xBonus = 1000;
        yBonus = 800;
        afficheBonus = false;

      }
    }

    if (afficheBonus == true) {
      dessinerBonus();
    }

    // tester si le serpent a mangé le bonus
    if (xSerp == xBonus && ySerp == yBonus) {
      vie++;
      affiche();
      xBonus = 1000;
      yBonus = 800;
      afficheBonus = false;
    }

  }
  /* fonction qui dirige le serpent*/
  function interaction(event) {
    console.log(event.keyCode);
    switch (event.keyCode) {
      case 37:
        pause = false;
        if (codeTouche == 39) {
          break;
        }
        // gauche
        deplX = -1;
        deplY = 0;
        codeTouche = event.keyCode;
        break;
      case 38:
        // haut
        pause = false;
        if (codeTouche == 40) {
          break;
        }
        deplX = 0;
        deplY = -1;
        codeTouche = event.keyCode;
        break;
      case 39:
        //droite
        pause = false;
        if (codeTouche == 37) {
          break;
        }
        deplX = 1;
        deplY = 0;
        codeTouche = event.keyCode;
        break;
      case 40:
        //bas
        pause = false;
        if (codeTouche == 38) {
          break;
        }
        deplX = 0;
        deplY = 1;
        codeTouche = event.keyCode;
        break;
      case 32:
        //Pause
        pause = true;
        deplX = 0;
        deplY = 0;
        codeTouche = event.keyCode;
        break;
      case 13:
          //Rejouer
          document.location.reload(true);
          break;
      default:

    }
  }
}
