import React from 'react';

/**
 * Componente que representa el encabezado de la aplicación.
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.titulo - Título que se mostrará en el encabezado.
 * @returns {JSX.Element} - La representación JSX del componente Header.
 */
const Header = ({ titulo }) => {
    return ( 
        <div className="header">
            <h1>{titulo}</h1>
        </div>
    );
}
    
export default Header;
