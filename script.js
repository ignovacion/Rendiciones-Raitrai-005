console.log("Formulario desarrollado por www.ignovacion.com");

const scriptURL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"; // Reemplaza YOUR_SCRIPT_ID con tu Script ID.

// Mostrar/ocultar secciones según el tipo de rendición
document.getElementById("tipoRendicion").addEventListener("change", function () {
    const tipo = this.value;

    // Ocultar todas las secciones
    document.querySelectorAll(".seccion").forEach((seccion) => {
        seccion.style.display = "none";
    });

    // Mostrar solo la sección correspondiente
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

// Configurar eventos de lectura NFC
document.getElementById("firmarCoordinador").addEventListener("click", () => leerNFC("coordinador"));
document.getElementById("firmarResponsable").addEventListener("click", () => leerNFC("responsable"));
document.getElementById("firmarCoordinadorGastos").addEventListener("click", () => leerNFC("coordinadorGasto"));

// Función para leer datos NFC
async function leerNFC(tipo) {
    if ("NDEFReader" in window) {
        try {
            const nfcReader = new NDEFReader();
            await nfcReader.scan();
            mostrarMensaje("Escaneando NFC... Acerca el tag al dispositivo.", "orange");

            nfcReader.onreading = (event) => {
                // Decodificar los datos leídos del TAG NFC
                const lines = new TextDecoder().decode(event.message.records[0].data).split("\n");
                asignarCamposNFC(tipo, lines);
            };
        } catch (error) {
            mostrarMensaje("Error al leer NFC: " + error, "red");
        }
    } else {
        alert("Tu navegador no soporta NFC. Usa Google Chrome en Android.");
    }
}

// Asignar los datos leídos a los campos correspondientes
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

    // Mostrar mensaje de éxito temporal
    mostrarMensaje("Formulario enviado correctamente.", "green");
    alert("Formulario enviado correctamente.");

    // Recargar la página después de 3 segundos
    setTimeout(() => {
        window.location.reload();
    }, 3000);
});
