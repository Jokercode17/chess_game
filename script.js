const tabuleiro = [];
let selecionado = null;
let turnoBranco = true;
let esperandoPromocao = false;
let promoPosicao = null;
const reiMovido = { branco: false, preto: false };
const torreMovida = { branco: [false, false], preto: [false, false] };

const pecasIniciais = [
  ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
  ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
  ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
];

function criarTabuleiro() {
  const board = document.getElementById("tabuleiro");
  board.innerHTML = "";
  for (let l = 0; l < 8; l++) {
    tabuleiro[l] = [];
    for (let c = 0; c < 8; c++) {
      const casa = document.createElement("div");
      casa.className = `casa ${(l + c) % 2 === 0 ? "branca" : "preta"}`;
      casa.dataset.l = l;
      casa.dataset.c = c;
      casa.textContent = pecasIniciais[l][c];
      casa.onclick = () => clicarCasa(l, c);
      board.appendChild(casa);
      tabuleiro[l][c] = casa;
    }
  }
  atualizarTurno();
}

function clicarCasa(l, c) {
  if (esperandoPromocao) return;
  const casa = tabuleiro[l][c];
  const conteudo = casa.textContent;

  if (selecionado) {
    if (casa === selecionado) {
      casa.classList.remove("selecionada");
      selecionado = null;
    } else {
      const origem = selecionado;
      const destino = casa;
      const pecaOrigem = origem.textContent;
      const pecaDestino = destino.textContent;

      const ehBrancoOrigem = "♙♖♘♗♕♔".includes(pecaOrigem);
      const ehBrancoDestino = "♙♖♘♗♕♔".includes(pecaDestino);

      // Permitir mover para casa vazia ou capturar peça inimiga
      const podeMoverOuComer = pecaDestino === "" || ehBrancoOrigem !== ehBrancoDestino;

      if (podeMoverOuComer) {
        mover(origem, destino);
        origem.classList.remove("selecionada");
        selecionado = null;
        turnoBranco = !turnoBranco;
        atualizarTurno();
      } else {
        // Se tentar mover para casa com peça do mesmo lado, cancela seleção
        origem.classList.remove("selecionada");
        selecionado = null;
      }
    }
  } else {
    if (!conteudo) return;
    const ehBranco = "♙♖♘♗♕♔".includes(conteudo);
    if (ehBranco !== turnoBranco) return;
    selecionado = casa;
    casa.classList.add("selecionada");
  }
}

function mover(origem, destino) {
  const peca = origem.textContent;
  const sl = +origem.dataset.l;
  const sc = +origem.dataset.c;
  const dl = +destino.dataset.l;
  const dc = +destino.dataset.c;

  // Roque
  if (peca === "♔" || peca === "♚") {
    reiMovido[turnoBranco ? "branco" : "preto"] = true;
    if (Math.abs(dc - sc) === 2) {
      if (dc === 6) {
        const torreOrig = tabuleiro[sl][7];
        const torreDest = tabuleiro[sl][5];
        torreDest.textContent = torreOrig.textContent;
        torreOrig.textContent = "";
      } else if (dc === 2) {
        const torreOrig = tabuleiro[sl][0];
        const torreDest = tabuleiro[sl][3];
        torreDest.textContent = torreOrig.textContent;
        torreOrig.textContent = "";
      }
    }
  }

  if (peca === "♖" || peca === "♜") {
    if (sc === 0) torreMovida[turnoBranco ? 'branco' : 'preto'][0] = true;
    if (sc === 7) torreMovida[turnoBranco ? 'branco' : 'preto'][1] = true;
  }

  origem.textContent = "";
  destino.textContent = peca;

  // Promoção
  if ((peca === "♙" && dl === 0) || (peca === "♟" && dl === 7)) {
    esperandoPromocao = true;
    promoPosicao = [dl, dc];
    document.getElementById("promoModal").style.display = "flex";
  }
}

function atualizarTurno() {
  const info = document.getElementById("info");
  info.textContent = `Turno: ${turnoBranco ? "♙ Brancas" : "♟ Pretas"}`;
}

document.querySelectorAll(".promoOption").forEach(opt => {
  opt.onclick = () => {
    const nova = opt.dataset.piece;
    const [l, c] = promoPosicao;
    tabuleiro[l][c].textContent = nova;
    document.getElementById("promoModal").style.display = "none";
    esperandoPromocao = false;
    promoPosicao = null;
  };
});

criarTabuleiro();
