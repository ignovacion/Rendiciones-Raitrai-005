// Mostrar/ocultar secciones según el tipo de rendición
document.getElementById("tipoRendicion").addEventListener("change", function () {
    const tipo = this.value;

    document.getElementById("seccionVoucher").style.display = tipo === "voucher" ? "block" : "none";
    document.getElementById("seccionGastos").style.display = tipo === "gastos" ? "block" : "none";
});

// Función para leer NFC
async function leerNFC(campoDestino, statusMsg) {
    if ('NDEFReader' in window) {
        try {
            const nfcReader = new NDEFReader();
            await nfcReader.scan();
            document.getElementById(statusMsg).innerText = "Escaneando Tag NFC...";

            nfcReader.onreading = (event) => {
                const nfcMessage = event.message.records[0];
                const nfcData = new TextDecoder().decode(nfcMessage.data);
                document.getElementById(campoDestino).value = nfcData;
                document.getElementById(statusMsg).innerText = "Firma completada.";
            };
        } catch (error) {
            console.error("Error al leer NFC:", error);
            document.getElementById(statusMsg).innerText = "Error al leer NFC. Intenta nuevamente.";
        }
    } else {
        alert("Tu navegador no soporta NFC.");
    }
}

// Asociar botones NFC
document.getElementById("firmarResponsable").addEventListener("click", () => {
    leerNFC("responsable", "status");
});

document.getElementById("firmarCoordinador").addEventListener("click", () => {
    leerNFC("coordinador", "status");
});

// Manejo del envío
document.getElementById("formulario").addEventListener("submit", (event) => {
    event.preventDefault();
    const tipo = document.getElementById("tipoRendicion").value;

    const datos = {
        tipo,
        programa: tipo === "voucher" ? document.getElementById("programa").value : document.getElementById("programaGasto").value,
        colegio: tipo === "voucher" ? document.getElementById("colegio").value : document.getElementById("colegioGasto").value,
        fecha: tipo === "voucher" ? document.getElementById("fecha").value : document.getElementById("fechaGasto").value,
        asuntoGasto: document.getElementById("asuntoGasto")?.value || null,
        valorGasto: document.getElementById("valorGasto")?.value || null,
        responsable: document.getElementById("responsable")?.value || null,
        coordinador: document.getElementById("coordinador").value,
        correoResponsable: document.getElementById("correoResponsable")?.value || null,
        correoCoordinador: document.getElementById("correoCoordinador").value,
    };

    console.log("Formulario enviado:", datos);
    alert("Formulario enviado correctamente.");
});
