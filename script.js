console.log("Formulario desarrollado por www.ignovacion.com");

const scriptURL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"; // Reemplaza YOUR_SCRIPT_ID con tu Script ID.

// Identificar Coordinador
document.getElementById("leerCoordinador").addEventListener("click", () => leerNFC("coordinador"));

// Leer Responsable para Voucher
document.getElementById("leerResponsable").addEventListener("click", () => leerNFC("responsable"));

// Tipo de Rendición
document.getElementById("tipoRendicion").addEventListener("change", function () {
    const tipo = this.value;
    document.querySelectorAll(".seccion").forEach((seccion) => seccion.style.display = "none");
    if (tipo === "voucher") {
        document.getElementById("seccionVoucher").style.display = "block";
    } else if (tipo === "gastos") {
        document.getElementById("seccionGastos").style.display = "block";
    }
    document.getElementById("enviar").style.display = "block";
});

// Función para leer NFC
async function leerNFC(tipo) {
    if ("NDEFReader" in window) {
        try {
            const nfcReader = new NDEFReader();
            await nfcReader.scan();
            mostrarMensaje("Escaneando NFC... Acerca el tag al dispositivo.", "orange");

            nfcReader.onreading = (event) => {
                const lines = new TextDecoder().decode(event.message.records[0].data).split("\n");
                asignarCamposNFC(tipo, lines);
            };
        } catch (error) {
            mostrarMensaje("Error al leer NFC: " + error, "red");
        }
    } else {
        alert("NFC no soportado en este navegador. Usa Chrome en Android.");
    }
}

// Asignar los datos leídos
function asignarCamposNFC(tipo, datos) {
    if (tipo === "coordinador") {
        document.getElementById("coordinador").value = datos[0];
        document.getElementById("codigoCoordinador").value = datos[1];
        document.getElementById("colegio").value = datos[2];
        document.getElementById("programa").value = datos[3];
        document.getElementById("estudiantes").value = datos[4];
        document.getElementById("apoderados").value = datos[5];
        document.getElementById("correoCoordinador").value = datos[6];
        document.getElementById("seleccionarRendicion").style.display = "block";
    } else if (tipo === "responsable") {
        document.getElementById("responsable").value = datos[0];
        document.getElementById("actividad").value = datos[1];
        document.getElementById("correoResponsable").value = datos[2];
    }
    mostrarMensaje("Lectura completada con éxito.", "green");
}

// Mostrar mensajes en la interfaz
function mostrarMensaje(mensaje, color) {
    const status = document.getElementById("status");
    status.style.color = color;
    status.innerText = mensaje;
}

// Enviar formulario
document.getElementById("enviar").addEventListener("click", () => {
    alert("Formulario enviado correctamente.");
});
