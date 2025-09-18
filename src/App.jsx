// src/App.jsx
import { useState } from 'react';
import QuoteForm from './components/QuoteForm.jsx';
import Results from './components/Results.jsx';

/**
 * Componente App:
 * Es el componente principal que organiza la aplicación.
 * Gestiona el estado de los resultados de la cotización y si están desactualizados.
 */
function App() {
    const [quoteResults, setQuoteResults] = useState(null);
    const [isStale, setIsStale] = useState(false);

    const handleNewQuote = (results) => {
        setQuoteResults(results);
        setIsStale(false); // Los nuevos resultados no están desactualizados.
        // Scroll suave a los resultados después de que se rendericen
        setTimeout(() => {
            document.getElementById('results-container')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    // Marca los resultados como desactualizados si el usuario cambia los datos del formulario.
    const handleFormChange = () => {
        if (quoteResults) {
            setIsStale(true);
        }
    };

    return (
        <div className="bg-gray-100 flex flex-col items-center min-h-screen p-4 font-sans">
            <main className="w-full max-w-4xl mx-auto py-8">
                <QuoteForm onQuote={handleNewQuote} onFormChange={handleFormChange} />
                <Results results={quoteResults} isStale={isStale} />
            </main>
        </div>
    );
}

export default App;

