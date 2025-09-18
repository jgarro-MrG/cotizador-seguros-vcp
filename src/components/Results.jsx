// src/components/Results.jsx
import QuoteResultCard from '/src/components/QuoteResultCard.jsx';

/**
 * Componente Results:
 * Muestra las tarjetas con los resultados de la cotización.
 * Aplica un estilo "deshabilitado" si los resultados están desactualizados.
 */
const Results = ({ results, isStale }) => {
    if (!results) {
        return null;
    }

    // Ordena los resultados para mostrar siempre el más barato primero
    const sortedResults = [...results].sort((a, b) => a.totalPrice - b.totalPrice);

    const containerClasses = `
        mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity duration-300
        ${isStale ? 'opacity-50 pointer-events-none' : 'opacity-100'}
    `;

    return (
        <div id="results-container" className={containerClasses}>
            {sortedResults.map((result, index) => (
                <QuoteResultCard
                    key={result.planId}
                    result={result}
                    isFeatured={index === 0} // Destaca la primera tarjeta (la más barata)
                />
            ))}
        </div>
    );
};

export default Results;

