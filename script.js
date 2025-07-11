//obtener valores ingresados por el usuario
const form = document.getElementById("form-cita");
const listasCitas = document.getElementById("lista-citas");

//areglo(array) para almacenar citas
let citas = [];

//Cargar citas guardadas en localStorage (si existen)
document.addEventListener("DOMContentLoaded", ()=> {
    const citasGuardadas = localStorage.getItem("citas");
    if(citasGuardadas){
        citas = JSON.parse(citasGuardadas);
        mostrarCitas();
    }
});

//Evento para enviar el formulario
form.addEventListener("submit", function (e){
    e.preventDefault(); //Evita que la pagina se recarge
    const nombre = document.getElementById("nombre").value.trim();
    const fecha = document.getElementById("fecha").value;
    const servicio = document.getElementById("servicio").value;
    const telefono = document.getElementById("telefono").value.trim();
    
    //validación simple
    if(!nombre || !fecha || !servicio){
        alert("Por favor completa todos los campos requeridos");
        return;
    }
    //crear objeto de cita
    const nuevaCita = {
        id: Date.now(), //identificador unico
        nombre,
        fecha,
        servicio,
        telefono
    };
    const citaExistente = citas.find(cita => cita.fecha === fecha);
    if(citaExistente) {
        mostrarAlerta("Ya hay una cita agendada para esa fecha y hora. Por favor elige otra.", "danger");
        return;
    }

    citas.push(nuevaCita);
    guardarEnLocalStorage();
    mostrarCitas();
    form.reset(); //limpiar formulario
});

//Funcion para mostrar citas
function mostrarCitas() {
    listasCitas.innerHTML = ""; //limpiar antes de mostrar
    
    if (citas.length === 0) {
        listasCitas.innerHTML = "<li class='list-group-item text-center'>No hay citas agendadas</li>";
        return;
    };

    citas.forEach(cita => {
        const li = document.createElement("li");
        li.classList.add("list-group-item");

        li.innerHTML = `
    <strong>${cita.nombre}</strong> - ${cita.servicio}<br>
    📅 ${formatearFecha(cita.fecha)} ${cita.telefono ? `| 📱 ${cita.telefono}` : ""}
    <button class="btn btn-sm btn-danger float-end" onclick="eliminarCita(${cita.id})">Eliminar</button>
  `;

        listasCitas.appendChild(li);
    });
};

//funcion para guardar cita en local storage
function guardarEnLocalStorage () {
    localStorage.setItem("citas", JSON.stringify(citas));
    mostrarAlerta("¡Cita Agendada Correctamente!", "success");
}

//funcion para eliminar una cita
function eliminarCita(id) {
    citas = citas.filter(cita => cita.id !== id);
    guardarEnLocalStorage();
    mostrarCitas();
    mostrarAlerta("¡Cita eliminada Correctamente!", "success")
}

//Formatear fecha a un formato lelgible
function formatearFecha(fecha){
    const f = new Date(fecha);
    return f.toLocaleString("es-MX", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
};

/*
"danger" → rojo (error)
"warning" → amarillo (advertencia)
"success" → verde (éxito)
"info" → azul
*/
//Funcion que permite mostrar alertas con boostrap
function mostrarAlerta(mensaje, tipo){
    const alerta = document.getElementById("alerta");
    alerta.textContent = mensaje;
    alerta.className = `alert alert-${tipo}`;
    alerta.classList.remove("d-none");

    //ocultar despues de 3 segundos
    setTimeout(() => {
        alerta.classList.add("d-none");
    }, 3000);
};


function generarPDFCitas() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const margenX = 10;
    let y = 20;
  
    doc.setFontSize(18);
    doc.text("📄 Listado de Citas - Barbería <Nombre>", margenX, y);
    y += 10;
  
    if (citas.length === 0) {
      doc.setFontSize(14);
      doc.text("No hay citas registradas.", margenX, y + 10);
    } else {
      doc.setFontSize(12);
      citas.forEach((cita, index) => {
        y += 10;
        if (y > 280) { // Salto de página
          doc.addPage();
          y = 20;
        }
        doc.text(
          `${index + 1}. ${cita.nombre} | ${formatearFecha(cita.fecha)} | ${cita.servicio} ${cita.telefono ? '| ' + cita.telefono : ''}`,
          margenX,
          y
        );
      });
    }
  
    doc.save("citas_barberia_REKE.pdf");
  }
  
  