import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import '../App';
import jsPDF from 'jspdf'; // Necesitarás instalar esta biblioteca

/**
 * Componente que muestra el historial de cotizaciones, permite gestionar las cotizaciones seleccionadas,
 * y ofrece opciones como borrar y exportar a PDF.
 * @param {Object} props - Propiedades del componente.
 * @param {Function} props.volver - Función para volver al cotizador.
 * @returns {JSX.Element} - La representación JSX del componente Historial.
 */
const Historial = ({ volver }) => {
  // Estado para almacenar el historial de cotizaciones y las filas seleccionadas
  const [historialCotizaciones, setHistorialCotizaciones] = useState([]);
  const [filasSeleccionadas, setFilasSeleccionadas] = useState({});

  // Efecto para cargar el historial de cotizaciones desde el almacenamiento local al montar el componente
  useEffect(() => {
    const storedHistorial = JSON.parse(localStorage.getItem('historialCotizaciones')) || [];
    setHistorialCotizaciones(storedHistorial);
  }, []);

  // Nombres asociados a los códigos de tipo de inmueble y ubicación para mostrar en la tabla
  const tipoInmuebleNombres = {
    1: 'Casa',
    2: 'P.H.',
    3: 'Depto. Edificio',
    4: 'Barrio Privado',
    5: 'Oficina',
    6: 'Local Comercial',
    7: 'Depósito Logística',
  };

  const ubicacionNombres = {
    24: 'CABA',
    12: 'GBA',
    10: 'Prov. de Buenos Aires',
  };

  /**
   * Función que devuelve una fila de la tabla en formato JSX.
   * @param {Object} fila - Objeto que representa una cotización en el historial.
   * @returns {JSX.Element} - La representación JSX de la fila de la tabla.
   */
  const retornoTablaHTML = (fila) => (
    <tr
      key={fila.fechaCotizacion}
      onClick={() => toggleSeleccion(fila.fechaCotizacion)}
      className={filasSeleccionadas[fila.fechaCotizacion] ? 'seleccionada' : ''}
    >
      <td>{fila.fechaCotizacion}</td>
      <td>{tipoInmuebleNombres[fila.propiedad]}</td>
      <td>{ubicacionNombres[fila.ubicacion]}</td>
      <td>{fila.metrosCuadrados}</td>
      <td>
        {fila.poliza !== undefined ? `$ ${fila.poliza.toLocaleString()}` : 'Póliza no disponible'}
      </td>
    </tr>
  );

  /**
   * Función para cambiar el estado de selección de una fila en la tabla.
   * @param {string} id - Identificador único de la fila.
   */
  const toggleSeleccion = (id) => {
    setFilasSeleccionadas((prevFilas) => {
      const nuevasFilas = { ...prevFilas, [id]: !prevFilas[id] };
  
      // Verifica si hay alguna fila seleccionada
      const hayFilasSeleccionadas = Object.values(nuevasFilas).some((seleccionada) => seleccionada);
  
      // Actualiza el estado y devuelve las nuevas filas
      return hayFilasSeleccionadas ? nuevasFilas : {};
    });
  };

  /**
   * Función para borrar las cotizaciones seleccionadas del historial.
   */
  const borrarSeleccionadas = () => {
    const filasSeleccionadasKeys = Object.keys(filasSeleccionadas);

    if (filasSeleccionadasKeys.length === 0) {
      // Mostrar mensaje de advertencia con SweetAlert
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Selecciona las cotizaciones que quieres borrar',
      });
      return;
    }

    const nuevasCotizaciones = historialCotizaciones.filter(
      (fila) => !filasSeleccionadas[fila.fechaCotizacion]
    );
    setHistorialCotizaciones(nuevasCotizaciones);
    setFilasSeleccionadas({});
    localStorage.setItem('historialCotizaciones', JSON.stringify(nuevasCotizaciones));
  };

  /**
   * Función para borrar todo el historial de cotizaciones.
   */
  const borrarTodo = () => {
    // Mostrar SweetAlert de confirmación
    Swal.fire({
      icon: 'warning',
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará todo el historial. ¿Deseas continuar?',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrar todo',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, borrar todo
        setHistorialCotizaciones([]);
        setFilasSeleccionadas({});
        localStorage.removeItem('historialCotizaciones');

        // Mostrar SweetAlert de éxito
        Swal.fire({
          icon: 'success',
          title: 'Historial borrado exitosamente',
          showConfirmButton: false,
          timer: 2000, // Cierra automáticamente después de 2 segundos
        });
      }
    });
  };

  /**
   * Función para imprimir las cotizaciones seleccionadas en un archivo PDF.
   */
  const imprimirSeleccionadas = () => {
    const filasSeleccionadasKeys = Object.keys(filasSeleccionadas);
  
    if (filasSeleccionadasKeys.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Selecciona cotizaciones haciendo clic sobre las que deseas imprimir',
      });
      return;
    }
  
    // Configuración del documento PDF
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true, // Para reducir el tamaño del archivo PDF
    });
  
    // Configuración de los títulos y dimensiones de celdas en el PDF
    const titulos = ['Fecha', 'Tipo de Propiedad', 'Ubicación', 'Metros Cuadrados', 'Costo de la Póliza'];
    const anchoMinimoCelda = 15; // Ancho mínimo de cada celda
    const paddingCelda = 3; // Espacio adicional a cada lado del texto en la celda
    const anchoPagina = pdf.internal.pageSize.getWidth();
  
    // Función para obtener el ancho óptimo de una celda
    const obtenerAnchoCelda = (titulo) => {
      const valorMaximoEncabezado = Math.max(...titulos.map((t) => pdf.getTextWidth(t) + 2 * paddingCelda));
      const valorMaximoDatos = Math.max(...historialCotizaciones.map((fila) => pdf.getTextWidth(obtenerValor(fila, titulo)) + 2 * paddingCelda));
      return Math.max(anchoMinimoCelda, Math.max(valorMaximoEncabezado, valorMaximoDatos));
    };
  
    let x = 10; // Posición inicial de la primera celda
    let y = 20; // Posición vertical para encabezados
  
    // Encabezados de tabla en el PDF
    for (let i = 0; i < titulos.length; i++) {
      const anchoCelda = obtenerAnchoCelda(titulos[i]);
  
      if (x + anchoCelda > anchoPagina && i > 0) {
        // Si la celda actual no cabe en la página actual, pasa a la siguiente página
        pdf.addPage();
        x = 10;
        y = 5;
      }
  
      pdf.setFillColor(255, 165, 0);
      pdf.rect(x, y, anchoCelda, 8, 'F');  // Ajusta la altura de la celda
      pdf.text(x + anchoCelda / 2, y + 4, titulos[i], null, null, 'center');
      x += anchoCelda;
    }
  
    y += 8; // Ajusta la altura de la celda para los datos
  
    // Datos en el PDF
    historialCotizaciones.forEach((fila) => {
      if (filasSeleccionadas[fila.fechaCotizacion]) {
        x = 10; // Restaurar la posición para la primera celda en cada fila
  
        for (let i = 0; i < titulos.length; i++) {
          const anchoCelda = obtenerAnchoCelda(titulos[i]);
  
          if (x + anchoCelda > anchoPagina && i > 0) {
            // Si la celda actual no cabe en la página actual, pasa a la siguiente página
            pdf.addPage();
            x = 10;
            y = 5;
          }
  
          pdf.rect(x, y, anchoCelda, 8);  // Ajusta la altura de la celda
          pdf.text(x + anchoCelda / 2, y + 4, obtenerValor(fila, titulos[i]), null, null, 'center');
          x += anchoCelda; // Mover la posición para la próxima celda
        }
  
        y += 8; // Ajusta la altura de la celda
      }
    });
  
    const filasSeleccionadasDespues = Object.keys(filasSeleccionadas);
    if (filasSeleccionadasDespues.length === 0) {
      alert("Seleccionar cotizaciones haciendo click sobre las que desea imprimir");
      return;
    }

    // Guardar el PDF con el nombre 'historial_seleccionado.pdf'
    pdf.save('historial_seleccionado.pdf');
  };
  
  /**
   * Función para obtener el valor de una propiedad específica de una fila.
   * @param {Object} fila - Objeto que representa una cotización en el historial.
   * @param {string} titulo - Título de la propiedad cuyo valor se desea obtener.
   * @returns {string} - El valor de la propiedad.
   */
  const obtenerValor = (fila, titulo) => {
    switch (titulo) {
      case 'Fecha':
        return fila.fechaCotizacion;
      case 'Tipo de Propiedad':
        return tipoInmuebleNombres[fila.propiedad];
      case 'Ubicación':
        return ubicacionNombres[fila.ubicacion];
      case 'Metros Cuadrados':
        return fila.metrosCuadrados.toString();
      case 'Costo de la Póliza':
        return `$ ${fila.poliza.toLocaleString()}`;
      default:
        return '';
    }
  };

  // Creación de la representación JSX del historial
  const tablaHTML = historialCotizaciones.map((fila) => retornoTablaHTML(fila));

  // Renderización del componente
  return (
    <div className="historial">
      <h2>Historial de Cotizaciones</h2>
      <div className="botones-container">
        <button onClick={volver}>Volver al Cotizador</button>
        <button onClick={borrarSeleccionadas}>Borrar Seleccionadas</button>
        <button onClick={borrarTodo}>Borrar Todo</button>
        <button onClick={imprimirSeleccionadas}>Imprimir Seleccionadas</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Tipo de Propiedad</th>
            <th>Ubicación</th>
            <th>Metros Cuadrados</th>
            <th>Costo de la Póliza</th>
          </tr>
        </thead>
        <tbody>{tablaHTML}</tbody>
      </table>
    </div>
  );
};

export default Historial;
