$w.onReady(function () {
    // Evento al hacer clic en el botón "Firmar"
    $w("#firmarButton").onClick(async () => {
        // Verifica si el navegador soporta NFC
        if ('NDEFReader' in window) {
            try {
                // Inicia el lector NFC
                const nfcReader = new NDEFReader();
                await nfcReader.scan();
                nfcReader.onreading = event => {
                    const nfcTagData = event.message.records[0].data; // Datos del Tag NFC
                    console.log("Datos NFC leídos:", nfcTagData);
                    
                    // Guarda los datos NFC en un campo oculto
                    $w("#nfcDataField").value = nfcTagData;

                    // Verifica si el Tag NFC es válido
                    validarYEnviarFormulario(nfcTagData);
                };
            } catch (error) {
                console.error("Error al leer NFC:", error);
                $w("#errorText").text = "Hubo un problema al leer el NFC. Intenta de nuevo.";
            }
        } else {
            $w("#errorText").text = "Tu dispositivo no soporta NFC.";
        }
    });
});

// Función para validar y enviar el formulario
function validarYEnviarFormulario(nfcTagData) {
    const formularioDatos = {
        gira: $w("#giraInput").value,
        colegio: $w("#colegioInput").value,
        nombreCoordinador: $w("#nombreCoordinadorInput").value,
        actividad: $w("#actividadInput").value,
        fecha: $w("#fechaInput").value,
        cantidadEstudiantes: $w("#cantidadEstudiantesInput").value,
        cantidadAdultos: $w("#cantidadAdultosInput").value,
        cantidadCoordinadores: $w("#cantidadCoordinadoresInput").value,
        nfcData: nfcTagData
    };

    // Comprueba si el Tag NFC contiene datos válidos
    if (nfcTagData && nfcTagData.length > 0) {
        // Envía los datos a la base de datos
        wixData.insert("nombreDeTuColeccion", formularioDatos)
            .then(() => {
                console.log("Datos guardados correctamente.");
                $w("#successText").text = "Formulario enviado con éxito.";
            })
            .catch((err) => {
                console.error("Error al guardar los datos:", err);
                $w("#errorText").text = "Hubo un error al enviar el formulario.";
            });
    } else {
        $w("#errorText").text = "El Tag NFC no es válido.";
    }
}

