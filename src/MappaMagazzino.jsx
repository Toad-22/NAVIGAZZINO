import React, { useEffect, useRef } from 'react';
import mapSvg from './assets/warehouse_map.svg?raw';
import './MappaMagazzino.css';

export default function MappaMagazzino({ risultati }) {
  const containerRef = useRef(null);

  // 1) Montaggio: inietta SVG + <style> una volta sola
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = mapSvg;  // inietta l'SVG
    const svgEl = container.querySelector('svg');
    if (!svgEl) return;

    // Inietta il <style> nel namespace SVG
    const styleTag = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'style'
    );
    styleTag.textContent = `
      rect, path {
        fill: #cccccc;
        stroke: #888888;
        transition: fill 0.3s, stroke 0.3s, filter 0.3s;
      }
      rect.highlight, path.highlight {
        fill: rgba(255,215,0,0.7) !important;
        stroke: #ffae00 !important;
        stroke-width: 2 !important;
        filter: drop-shadow(0 0 8px rgba(255,215,0,0.8)) !important;
      }
    `;
    svgEl.prepend(styleTag);
  }, []); // <-- solo al montaggio

  // 2) Aggiorna highlight ogni volta che cambiano i risultati
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const svgEl = container.querySelector('svg');
    if (!svgEl) return;

    // Rimuovi highlight precedenti
    svgEl.querySelectorAll('rect.highlight, path.highlight')
         .forEach(el => el.classList.remove('highlight'));

    // Applica highlight ai nodi corrispondenti
    risultati.forEach(item => {
      if (!item.slug) return;
      const node = svgEl.getElementById(`shelf-${item.slug}`);
      if (node) node.classList.add('highlight');
    });
  }, [risultati]); // <-- solo quando cambia risultati

  return (
    <div
      className="overflow-auto"
      ref={containerRef}
    ></div>
  );
}
