console.log("Formulario desarrollado por www.ignovacion.com");

// Asegurarnos de ocultar todas las secciones al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("seccionVoucher").style.display = "none";
    document.getElementById("seccionGastos").style.display = "none";
    document.getElementById("formulario").style.display = "block";
});

// Mostrar la sección según el tipo de rendición
document.getElementById("tipoRendicion").addEventListener("change", function () {
    const tipo = this.value;

    // Ocultar ambas secciones al cambiar
    document.getElementById("seccionVoucher").style.display = "none";
    document.getElementById("seccionGastos").style.display = "none";

    // Mostrar solo la sección seleccionada
    if (tipo === "voucher") {
        document.getElementById("seccionVoucher").style.display = "block";
    } else if (tipo === "gastos") {
        document.getElementById("seccionGastos").style.display = "block";
    }
});

// Función para leer NFC
async function leerNFC(campoDestino) {
    if ('NDEFReader' in window) {
        try {
            const nfcReader = new NDEFReader();
            await nfcReader.scan();
            nfcReader.onreading = (event) => {
                const nfcMessage = event.message.records[0];
                const nfcData = new TextDecoder().decode(nfcMessage.data);
                document.getElementById(campoDestino).value = nfcData;
            };
        } catch (error) {
            alert("Error al leer NFC: " + error);
        }
    } else {
        alert("Tu navegador no soporta NFC.");
    }
}

// Botones de Escanear NFC
document.getElementById("firmarResponsable").addEventListener("click", () => {
    leerNFC("responsable");
});

document.getElementById("firmarCoordinador").addEventListener("click", () => {
    leerNFC("coordinador");
});

// Envío del formulario
document.getElementById("formulario").addEventListener("submit", (event) => {
    event.preventDefault();
    document.body.innerHTML = `
        <h1 style="text-align: center; color: #4CAF50;">Los datos rendidos se han enviado con éxito</h1>
        <p style="text-align: center; color: #333;">Preparando el formulario para una nueva rendición...</p>
    `;
    setTimeout(() => window.location.reload(), 3000);
});
