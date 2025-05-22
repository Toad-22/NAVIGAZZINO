import { useEffect, useState } from "react";

const STORAGE_KEY = "magazzinoCuscinetti";

export default function RicercaSerie() {
  const [query, setQuery] = useState("");
  const [datiMagazzino, setDatiMagazzino] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [nuovoScaffale, setNuovoScaffale] = useState("");
  const [nuoveSerie, setNuoveSerie] = useState("");
  const [matchEsatto, setMatchEsatto] = useState(false);


  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setDatiMagazzino(JSON.parse(stored));
    } else {
      fetch("/scaffali.json")
        .then((res) => res.json())
        .then((data) => {
          console.log("Dati caricati da scaffali.json:", data);
          setDatiMagazzino(data);
        })
        .catch((err) => console.error("Errore nel caricamento JSON:", err));
    }
  }, []);

  useEffect(() => {
    if (datiMagazzino.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(datiMagazzino));
    }
  }, [datiMagazzino]);

  const risultati = datiMagazzino.filter((item) => {
    const allCodici = [...item.serie, ...item.codici_extra];
    return allCodici.some((s) => {
      const valore = s.toLowerCase();
      const queryPulita = query.trim().toLowerCase();

    return matchEsatto
      ? valore === queryPulita
      : valore.startsWith(queryPulita);
    });
  });

  const aggiungiScaffale = () => {
    if (!nuovoScaffale || !nuoveSerie) return;
    const nuoveSerieArray = nuoveSerie.split(",").map(s => s.trim());
    const nuovoItem = {
      scaffale: nuovoScaffale,
      serie: nuoveSerieArray,
      codici_extra: []
    };
    setDatiMagazzino([...datiMagazzino, nuovoItem]);
    setNuovoScaffale("");
    setNuoveSerie("");
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 pt-6">
      <div className="w-full max-w-5xl px-4 mb-6 flex flex-col sm:flex-row sm:justify-between items-center">
        <img
          src="/logo.png"
          alt="Logo Azienda"
          className="h-12 sm:h-[12.5vh] object-contain"
        />

        <button
          onClick={() => setMatchEsatto(!matchEsatto)}
          className={`mt-4 sm:mt-0 flex items-center gap-2 px-3 py-2 
            text-xs sm:text-sm rounded-full shadow transition-all duration-200 ${
              matchEsatto ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-800'
            }`}
        >
          <span>{matchEsatto ? "🔒" : "🔓"}</span>
          <span>{matchEsatto ? "Match esatto ON" : "Match esatto OFF"}</span>
        </button>
      </div>




      <input
        type="text"
        placeholder="🔍 Cerca una serie (es. 240, NJ2, 323...)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full max-w-2xl text-xl font-medium p-4 mb-8 border-2 border-blue-500 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
      />

      {query && risultati.length === 0 && (
        <p className="text-red-500 font-semibold text-center mb-4">❌ Nessuno scaffale contiene questa serie.</p>
      )}

      <div className="w-full max-w-4xl bg-gray-100 p-6 rounded-xl shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {risultati.map((item, index) => (
            <div key={index} className="border rounded p-4 bg-white shadow">
              <h2 className="text-lg font-bold text-blue-800 mb-1">Scaffale: {item.scaffale}</h2>
              <p className="text-sm"><span className="font-semibold">Serie:</span> {item.serie.join(", ")}</p>
              {item.codici_extra.length > 0 && (
                <p className="text-sm"><span className="font-semibold">Codici extra:</span> {item.codici_extra.join(", ")}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="border p-4 rounded mb-6 bg-gray-50 mt-8 max-w-2xl w-full">
          <h2 className="font-semibold mb-3 text-lg">Nuovo scaffale</h2>
          <input
            type="text"
            placeholder="📁 Nome scaffale (es. B5)"
            value={nuovoScaffale}
            onChange={(e) => setNuovoScaffale(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-2"
          />
          <input
            type="text"
            placeholder="🔢 Serie (es. 6200, 6300, NJ2)"
            value={nuoveSerie}
            onChange={(e) => setNuoveSerie(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <button
            onClick={aggiungiScaffale}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Salva scaffale
          </button>
        </div>
      )}

      <button
        onClick={() => setShowForm(!showForm)}
        className="mt-6 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded"
      >
        {showForm ? "Annulla" : "➕ Aggiungi scaffale"}
      </button>
    </div>
  );
}

