import CryptoJS from "crypto-js";

const dragArea = document.querySelector(".drag-area");
const dragText = dragArea.querySelector('h2');
const button = dragArea.querySelector('button');
const input = dragArea.querySelector('#input-file');

let trimmedValue;


let archivo;
let archivoUrl;

let stringEncriptado;

let key;
let keyValue;

let output;

let btnDesencripta;
let btnDescarga;

const validationResult = {};


/* Carga drag and drop */
dragArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  dragArea.classList.add('active');
  dragText.textContent = 'Suelta para cargar tu archivo';
})

dragArea.addEventListener('dragleave', (e) => {
  e.preventDefault();
  dragArea.classList.remove('active');
  dragText.textContent = 'Arrastra y suelta tu archivo';
})

dragArea.addEventListener('drop', (e) => {
  e.preventDefault();
  archivo = e.dataTransfer.files[0];
  dragArea.classList.remove('active');
  dragText.textContent = 'Arrastra y suelta tu archivo';
  if(archivo.type != 'text/plain') {
    Swal.fire({
      icon: 'error',
      title: 'El archivo seleccionado no es .txt',
      showConfirmButton: false,
    })
    setTimeout(() => {
      window.location.reload()
    }, 2000);
    return;
  } else {
    console.log('Si es txt');
  }
  archivoToUrl();
})


/* Carga manual de archivo */

button.addEventListener('click', e => {
  input.click();
})

input.addEventListener('change', e => {
  dragArea.classList.add('active');
  archivo = e.target.files[0];
  dragArea.classList.remove('active');
  archivoToUrl();
})

let archivoURLTrim;

/* Lee contenido de TXT */
function archivoToUrl() {
  const fileReader = new FileReader();

  fileReader.readAsText(archivo);

  fileReader.addEventListener('load', e => {
    archivoUrl = e.target.result;
    archivoURLTrim = archivoUrl.trim();
    inputDatos();
  })
}

function inputDatos() {
  dragArea.classList.add('drag-area--desencripta');
  dragArea.innerHTML = `<div class="encriptaFlex contenedor"> 
                            <div>
                                <h3>Ingresa la contraseña:</h3><input id="key" type="text">
                                <p class="parrafoMinimo">Debe tener mínimo 8 caracteres</p>
                                <p class="parrafoMayus">Debe incluir una letra mayúscula</p>
                                <p class="parrafoMinus">Debe incluir una letra minúscula</p>
                                <p class="parrafoNum">Debe incluir un número</p>
                                <p class="parrafoEspecial">Debe incluir un caracter especial</p>
                            </div> 

                            <div class="botonesFlex">
                                <button id="btnDesencripta" class="btnPrincipal">Desencripta</button>
                                <a id="enlace"><button id="btnDescarga" class="btnDescargaDenied" disabled>Descarga</button></a>
                            </div>

                        </div>`;

  key = document.getElementById('key');
  key.addEventListener('input', validaKey);

  btnDesencripta = document.getElementById('btnDesencripta');
  btnDesencripta.addEventListener('click', desencripta);

  btnDescarga = document.getElementById('btnDescarga');
  btnDescarga.addEventListener('click', descarga);

  output = document.getElementById('output');
}

function validaKey() {

    keyValue = key.value;
  
    trimmedValue = keyValue.trim();
    const MINIMUM_LENGTH = 8;
    const mayus = /[A-Z]/;
    const minus = /[a-z]/;
    const number = /[0-9]/;
    const caracteresEspeciales = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  
    validationResult.minimumLength = trimmedValue.length >= MINIMUM_LENGTH;
    validationResult.containsMayus = mayus.test(trimmedValue);
    validationResult.containsMinus = minus.test(trimmedValue);
    validationResult.containsEspecial = caracteresEspeciales.test(trimmedValue);
    validationResult.containsNumber = number.test(trimmedValue);
  
    const parrafoEspecial = document.querySelector('.parrafoEspecial');
    const parrafoMayus = document.querySelector('.parrafoMayus');
    const parrafoMinus = document.querySelector('.parrafoMinus');
    const parrafoMinimo = document.querySelector('.parrafoMinimo');
    const parrafoNum = document.querySelector('.parrafoNum');
  
    if( validationResult.minimumLength ) {
      parrafoMinimo.classList.remove('error');
      parrafoMinimo.classList.add('validado');
    } else {
      parrafoEspecial.classList.remove('validado');
      parrafoMinimo.classList.add('error');
    }
    if( validationResult.containsMayus ) {
      parrafoMayus.classList.remove('error');
      parrafoMayus.classList.add('validado');
    } else {
      parrafoMayus.classList.remove('validado');
      parrafoMayus.classList.add('error');
    }
    if( validationResult.containsMinus ) {
      parrafoMinus.classList.remove('error');
      parrafoMinus.classList.add('validado');
    } else {
      parrafoMinus.classList.remove('validado');
      parrafoMinus.classList.add('error');
    }
    if( validationResult.containsEspecial ) {
      parrafoEspecial.classList.remove('error');
      parrafoEspecial.classList.add('validado');
    } else {
      parrafoEspecial.classList.remove('validado');
      parrafoEspecial.classList.add('error');
    }
    if( validationResult.containsNumber ) {
      parrafoNum.classList.remove('error');
      parrafoNum.classList.add('validado');
    } else {
      parrafoNum.classList.remove('validado');
      parrafoNum.classList.add('error');
    }
  
  }

  let keyHash;
  let resultadoDesencriptado = '';

  function desencripta() {
    if(validationResult.minimumLength && validationResult.containsMayus && validationResult.containsMinus && validationResult.containsNumber && validationResult.containsEspecial) {
        try {
          keyHash = CryptoJS.MD5(keyValue).toString();
          resultadoDesencriptado = CryptoJS.TripleDES.decrypt(archivoURLTrim, keyHash).toString(CryptoJS.enc.Utf8);
          validaDesencripta();
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Lo sentimos',
            text: 'No se puede desencriptar debido a un error en contraseña o daño en el archivo txt',
          })
        }


    } else {
        Swal.fire({
          icon: 'error',
          title: 'La contraseña no cumple con los requisitos',
          showConfirmButton: false,
          timer: 1500
        })
    }
  }

  function validaDesencripta() {
    if(resultadoDesencriptado.includes('data')) {
        btnDescarga.classList.remove('btnDescargaDenied');
        btnDescarga.classList.add('btnPrincipal');
        btnDescarga.setAttribute('disabled', 'false');
  
        btnDescarga = document.getElementById('btnDescarga').disabled = false;
    } else {
      console.log('No se desencriptó debido a un error');
    }
  }

  function descarga() {
    const enlace = document.getElementById('enlace');

    enlace.href = resultadoDesencriptado;
    enlace.download = 'desencriptado';

  }