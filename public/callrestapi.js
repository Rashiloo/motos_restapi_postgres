const API_URL = "http://localhost:8900/api/motos"; // Cambia por tu URL real

function getMotos() {
    $("#resultado").html("<p class='loading'>Cargando motos...</p>");

    $.ajax({
        url: API_URL,
        type: "GET",
        success: function (response) {
            const motos = response.motos;
            if (!motos || !motos.length) {
                $("#resultado").html("<p>No hay motos registradas.</p>");
                return;
            }

            let table = `<table class='moto-table'><thead><tr>
                <th>ID</th><th>Marca</th><th>Modelo</th><th>Año</th><th>Cilindrada</th><th>Acciones</th>
                </tr></thead><tbody>`;

            motos.forEach(moto => {
                table += `<tr>
                    <td>${moto.id}</td>
                    <td>${moto.marca}</td>
                    <td>${moto.modelo}</td>
                    <td>${moto.anio}</td>
                    <td>${moto.cilindrada || "N/A"}</td>
                    <td>
                        <button class='btn-sm btn-warning' onclick='loadMoto(${JSON.stringify(moto)})'>Editar</button>
                        <button class='btn-sm btn-danger' onclick='deleteMoto(${moto.id})'>Eliminar</button>
                    </td>
                </tr>`;
            });

            table += "</tbody></table>";
            $("#resultado").html(table);
        },
        error: function (err) {
            console.error(err);
            $("#resultado").html("<p class='loading'>Error al obtener las motos.</p>");
        }
    });
}

function postMoto() {
    const moto = getFormData();
    if (!moto.marca || !moto.modelo) {
        alert("Marca y modelo son obligatorios.");
        return;
    }

    $.ajax({
        url: API_URL,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(moto),
        success: function () {
            clearForm();
            getMotos();
        },
        error: function (err) {
            alert("Error al crear moto");
            console.error(err);
        }
    });
}

function putMoto() {
    const id = $("#id").val();
    if (!id) {
        alert("Debes seleccionar una moto para actualizar.");
        return;
    }

    const moto = getFormData();

    $.ajax({
        url: `${API_URL}/${id}`,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(moto),
        success: function () {
            clearForm();
            getMotos();
            alert("Moto actualizada correctamente");
        },
        error: function (err) {
            console.error("Detalles del error:", err.responseJSON || err);
            alert(`Error al actualizar moto. Detalles en consola (F12)`);
        }
    });
}

function deleteMoto(id) {
    if (!confirm("¿Estás seguro de eliminar esta moto?")) return;

    $.ajax({
        url: `${API_URL}/${id}`,
        type: "DELETE",
        success: function () {
            getMotos();
        },
        error: function (err) {
            alert("Error al eliminar moto");
            console.error(err);
        }
    });
}

function loadMoto(moto) {
    $("#id").val(moto.id);
    $("#marca").val(moto.marca);
    $("#modelo").val(moto.modelo);
    $("#anio").val(moto.anio);
    $("#cilindrada").val(moto.cilindrada || "");
}

function getFormData() {
    return {
        marca: $("#marca").val(),
        modelo: $("#modelo").val(),
        anio: parseInt($("#anio").val(), 10),
        cilindrada: $("#cilindrada").val() || null
    };
}

function clearForm() {
    $("#id").val('');
    $("#marca").val('');
    $("#modelo").val('');
    $("#anio").val('');
    $("#cilindrada").val('');
}

// Inicialización
$(document).ready(function () {
    getMotos();
});
