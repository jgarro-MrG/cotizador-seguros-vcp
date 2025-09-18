// src/components/QuoteResultCard.jsx
import { useState } from 'react';

// Iconos para la tarjeta
const ShieldCheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 inline-block text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ChevronDownIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block ml-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);


/**
 * Componente QuoteResultCard:
 * Muestra una tarjeta individual con el resultado de una cotización para un plan específico.
 * Permite al usuario ver los detalles de la cobertura.
 */
const QuoteResultCard = ({ result, isFeatured }) => {
    const [showDetails, setShowDetails] = useState(false);

    const { providerName, planName, totalPrice, travelers, days, details } = result;

    const cardClasses = `
        bg-white p-6 rounded-2xl shadow-lg border-2 transition-all duration-300
        ${isFeatured ? 'border-blue-600 transform lg:scale-105' : 'border-gray-200'}
    `;

    const detailsContainerClasses = `
        transition-all duration-500 ease-in-out overflow-hidden
        ${showDetails ? 'max-h-96 mt-4' : 'max-h-0 mt-0'}
    `;

    return (
        <div className={cardClasses}>
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <ShieldCheckIcon /> {providerName}
            </h3>
            <p className="text-sm text-gray-500 mb-4 ml-8">{planName}</p>

            <div className="my-6 text-center">
                <span className="text-5xl font-extrabold text-gray-900">
                    {totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </span>
                <span className="text-base font-medium text-gray-500"> USD</span>
            </div>

            <p className="text-center text-gray-600 text-sm mb-6">
                Precio total por {travelers} viajero(s) durante {days} días.
            </p>

            {/* Sección de detalles desplegables */}
            <div className="border-t border-gray-200 pt-4">
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="w-full text-center text-sm font-semibold text-blue-600 hover:text-blue-800 focus:outline-none flex items-center justify-center"
                >
                    Ver Detalles
                    <span className={`transform transition-transform duration-300 ${showDetails ? 'rotate-180' : 'rotate-0'}`}>
                        <ChevronDownIcon />
                    </span>
                </button>
                <div className={detailsContainerClasses}>
                    <ul className="list-disc list-inside text-gray-600 text-sm space-y-2 pl-2 pt-2">
                        {details.map((detail, i) => (
                            <li key={i}>{detail}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <a
                href="https://cuanto.app/viajaconpri"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition mt-4"
            >
                Contratar Seguro
            </a>
        </div>
    );
};

export default QuoteResultCard;

