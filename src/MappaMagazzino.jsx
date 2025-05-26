import React, { useEffect, useRef, useState } from 'react';
import mapSvg from './assets/warehouse_map.svg?raw';
import './MappaMagazzino.css';

export default function MappaMagazzino({ risultati }) {
  const containerRef = useRef(null);
  const [isFs, setIsFs] = useState(false);

  // Montaggio SVG + style (solo una volta)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = mapSvg;
    const svgEl = container.querySelector('svg');
    if (!svgEl) return;
    const styleTag = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    styleTag.textContent = `
      rect, path { fill: #cccccc; stroke: #888888; transition: fill .3s, stroke .3s, filter .3s; }
      rect.highlight, path.highlight { fill: rgba(255,215,0,0.7)!important; stroke: #ffae00!important; stroke-width:2!important; filter:drop-shadow(0 0 8px rgba(255,215,0,0.8))!important; }
    `;
    svgEl.prepend(styleTag);
  }, []);

  // Highlight sui cambi di risultati
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const svgEl = container.querySelector('svg');
    if (!svgEl) return;
    svgEl.querySelectorAll('rect.highlight, path.highlight')
         .forEach(el => el.classList.remove('highlight'));
    risultati.forEach(item => {
      if (!item.slug) return;
      const node = svgEl.getElementById(`shelf-${item.slug}`);
      if (node) node.classList.add('highlight');
    });
  }, [risultati]);

  // Gestione fullscreenchange per aggiornare lo stato
  useEffect(() => {
    const onFsChange = () => {
      setIsFs( Boolean(document.fullscreenElement) );
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Funzione di toggle
  const toggleFs = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  return (
    <>
      {/* Pulsante mobile-only per fullscreen */}
      <button
        onClick={toggleFs}
        className={`sm:hidden fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg`}
        aria-label={isFs ? 'Esci da schermo intero' : 'Schermo intero'}
      >
        {isFs ? '✖️' : '🔍'}
      </button>

      {/* Contenitore mappa */}
      <div
        ref={containerRef}
        className={`map-container${isFs ? ' fullscreen' : ''}`}
      ></div>
    </>
  );
}
