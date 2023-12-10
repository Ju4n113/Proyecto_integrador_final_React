import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './App.css';
import Header from './componentes/Header';
import Formulario from './componentes/Formulario';
import Resultado from './componentes/Resultado';
import Mensaje from "./componentes/Mensaje";
import Historial from './componentes/Historial';

/**
 * Componente principal que representa la aplicación del simulador de cotizaciones de seguros.
 * @returns {JSX.Element} - La representación JSX del componente App.
 */
function App() {
  // Variables de estado para gestionar la entrada del usuario y el estado de la aplicación
  const [cantidad, setCantidad] = useState(0);
  const [propiedad, setPropiedad] = useState(0);
  const [ubicacion, setUbicacion] = useState(0);
  const [total, setTotal] = useState(0);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [historialCotizaciones, setHistorialCotizaciones] = useState([]);

  // El hook useEffect maneja la inicialización y actualizaciones de las cotizaciones históricas
  useEffect(() => {
    // Recupera las cotizaciones históricas desde el almacenamiento local
    const storedHistorial = JSON.parse(localStorage.getItem('historialCotizaciones')) || [];

    // Verifica si las cotizaciones históricas fueron eliminadas recientemente y actualiza el estado en consecuencia
    if (storedHistorial.length === 0 && historialCotizaciones.length > 0) {
      setHistorialCotizaciones([]);
    } else {
      // Actualiza el estado con las cotizaciones históricas
      setHistorialCotizaciones(storedHistorial);
    }
  }, [historialCotizaciones]);

  /**
   * Función para guardar la cotización actual en las cotizaciones históricas.
   * Muestra mensajes de advertencia o error utilizando SweetAlert según sea necesario.
   */
  const guardarCotizacion = () => {
    // Verifica si se proporcionaron los valores de entrada requeridos
    if (cantidad === 0 || propiedad === 0 || ubicacion === 0) {
      // Muestra un mensaje de advertencia con SweetAlert
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'Por favor, calcula la cotización antes de guardar.',
      });
      return;
    }
  
    // Crea un nuevo objeto de cotización
    const nuevaCotizacion = {
      fechaCotizacion: new Date().toLocaleString(),
      propiedad: propiedad,
      ubicacion: ubicacion,
      metrosCuadrados: cantidad,
      poliza: total,
    };

    // Verifica si la cotización ya existe en las cotizaciones históricas
    const esDuplicado = historialCotizaciones.some((cotizacion) =>
      JSON.stringify(cotizacion) === JSON.stringify(nuevaCotizacion)
    );

    // Muestra un mensaje de error si la cotización ya es duplicada
    if (esDuplicado) {
      Swal.fire({
        icon: 'error',
        title: 'Cotización duplicada',
        text: 'Ya existe una cotización idéntica en el historial.',
      });
      return;
    }

    // Guarda la nueva cotización en las cotizaciones históricas
    const nuevoHistorial = [...historialCotizaciones, nuevaCotizacion];
    setHistorialCotizaciones(nuevoHistorial);
    localStorage.setItem('historialCotizaciones', JSON.stringify(nuevoHistorial));

    // Limpia los campos de entrada después de guardar
    setCantidad(0);
    setPropiedad(0);
    setUbicacion(0);
    setTotal(0);

    // Muestra un mensaje de éxito con SweetAlert
    Swal.fire({
      icon: 'success',
      title: 'Cotización guardada exitosamente',
      showConfirmButton: false,
      timer: 2000, // Se cierra automáticamente después de 2 segundos
    });
  };

  // Estructura JSX que representa el diseño de la aplicación
  return (
    <>
      <Header titulo="Cotizador de Seguros 🏡" />
      <div className="container">
        {mostrarHistorial ? (
          <Historial historial={historialCotizaciones} volver={() => setMostrarHistorial(false)} />
        ) : (
          <Formulario
            cantidad={cantidad}
            setCantidad={setCantidad}
            propiedad={propiedad}
            setPropiedad={setPropiedad}
            ubicacion={ubicacion}
            setUbicacion={setUbicacion}
            setTotal={setTotal}
          />
        )}
      </div>
      <div className="mensaje">
        {total === 0 ? (
          <Mensaje />
        ) : (
          <Resultado total={total} cantidad={cantidad} ubicacion={ubicacion} propiedad={propiedad} />
        )}
        {!mostrarHistorial && (
          <button onClick={guardarCotizacion}>Guardar Cotización en Historial</button>
        )}
      </div>
      {!mostrarHistorial && (
        <button className="ver-historial-btn" onClick={() => setMostrarHistorial(true)}>
          Ver Historial 📋
        </button>
      )}
    </>
  );
}

export default App;
