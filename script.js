let d = 256;

function search(pat, txt, q) {
  let M = pat.length;
  let N = txt.length;
  let i, j;

  let p = 0;

  let t = 0;
  let h = 1;

  let posiciones = [];

  for (i = 0; i < M - 1; i++) h = (h * d) % q;

  for (i = 0; i < M; i++) {
    p = (d * p + pat[i].charCodeAt()) % q;
    t = (d * t + txt[i].charCodeAt()) % q;
  }

  for (i = 0; i <= N - M; i++) {
    if (p == t) {
      for (j = 0; j < M; j++) {
        if (txt[i + j] != pat[j]) break;
      }

      if (j == M) posiciones.push(i);
    }

    if (i < N - M) {
      t = (d * (t - txt[i].charCodeAt() * h) + txt[i + M].charCodeAt()) % q;
      if (t < 0) t = t + q;
    }
  }

  if (posiciones.length > 0) {
    const resultado = document.getElementById("resultado");
    resultado.value = `The "${pat}" is matched ${
      posiciones.length
    } number of tmes on the file: ${posiciones.join(", ")}`;
  } else {
    resultado.value = `The  "${pat}" It is not found in the text.`;
  }

  return posiciones;
}

let texto = "";

function cargarTXT() {
  const archivoInput = document.getElementById("fileInput");
  const archivo = archivoInput.files[0];

  if (archivo) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const contenido = e.target.result;
      texto = contenido;
      const resultado = document.getElementById("resultado");
      resultado.value = "File uploaded successfully.";
    };
    reader.readAsText(archivo);
  }
}

let posiciones = [];

function buscar() {
  const patron = document.getElementById("patron").value;
  if (texto == "") {
    alert("You must upload a text file first.", "Error");
  }
  let q = 101;
  posiciones = search(patron, texto, q);
}

function generarPDF() {
  const patron = document.getElementById("patron").value;
  const text = texto;

  const template = document.getElementById("template");
  const htmlConResaltado = resaltarPalabra(text, patron);

  template.innerHTML = htmlConResaltado;

  html2pdf()
    .set({
      margin: 1,
      filename: "resultado.pdf",
      html2canvas: { scale: 3 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    })
    .from(htmlConResaltado)
    .save()
    .catch((err) => console.log(err));
  const resultado = document.getElementById("resultado");
  resultado.value = "PDF generated successfully.";
}

function resaltarPalabra(texto, patron) {
  const lineas = texto.split("\n");
  let resultado = "";

  lineas.forEach((linea, indice) => {
    const partes = linea.split(new RegExp(`(${patron})`, "gi"));

    partes.forEach((part, index) => {
      if (index < partes.length - 1) {
        resultado +=
          part.toLowerCase() === patron.toLowerCase()
            ? `<span style="color: red;">${part}</span>`
            : part;
      } else {
        resultado +=
          part.toLowerCase() === patron.toLowerCase()
            ? `<span style="color: red;">${part}</span>`
            : part;
      }
    });

    resultado += "<br>";
  });

  return resultado;
}
