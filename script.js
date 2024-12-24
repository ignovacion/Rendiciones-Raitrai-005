console.log("Formulario desarrollado por www.ignovacion.com");

const scriptURL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"; // Reemplaza YOUR_SCRIPT_ID con tu Script ID.

// Mostrar/ocultar secciones según el tipo de rendición
document.getElementById("tipoRendicion").addEventListener("change", function () {
    const tipo = this.value;

    // Mostrar solo la sección correspondiente
    document.querySelectorAll(".seccion").forEach((seccion) => {
        seccion.style.display = "none";
    });

    if (tipo === "voucher") {
        document.getElementById("seccionVoucher").style.display = "block";
    } else if (tipo === "gastos") {
        document.getElementById("seccionGastos").style.display = "block";
    }

    mostrarMensaje("Completa la información y presiona Enviar.", "blue");
});

// Función para mostrar mensajes en pantalla
function mostrarMensaje(mensaje, color) {
    const status = document.getElementById("status");
    status.style.color = color;
    status.innerText = mensaje;
}

// Configurar eventos de lectura NFC (respetando los campos correspondientes)
document.getElementById("firmarCoordinador").addEventListener("click", () => leerNFC("coordinador"));
document.getElementById("firmarResponsable").addEventListener("click", () => leerNFC("responsable"));
document.getElementById("firmarCoordinadorGastos").addEventListener("click", () => leerNFC("coordinadorGasto"));

// Lógica para manejar los datos NFC
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

// Asignar datos leídos a los campos correctos
function asignarCamposNFC(tipo, datos) {
    if (tipo === "coordinador") {
        document.getElementById("coordinador").value = datos[0] || "";
        document.getElementById("codigoCoordinador").value = datos[1] || "";
        document.getElementById("colegio").value = datos[2] || "";
        document.getElementById("programa").value = datos[3] || "";
    } else if (tipo === "responsable") {
        document.getElementById("responsable").value = datos[0] || "";
        document.getElementById("actividad").value = datos[1] || "";
        document.getElementById("correoResponsable").value = datos[2] || "";
    } else if (tipo === "coordinadorGasto") {
        document.getElementById("coordinadorGasto").value = datos[0] || "";
        document.getElementById("codigoCoordinadorGasto").value = datos[1] || "";
        document.getElementById("colegioGasto").value = datos[2] || "";
        document.getElementById("programaGasto").value = datos[3] || "";
    }
    mostrarMensaje("Lectura completada con éxito.", "green");
}

// Enviar el formulario
document.getElementById("formulario").addEventListener("submit", async (event) => {
    event.preventDefault();
    alert("Formulario enviado correctamente.");
});
