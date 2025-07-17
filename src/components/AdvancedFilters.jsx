import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/advancedFilters.css";

export default function AdvancedFilters({ onClose, onApply }) {
  const [categorias, setCategorias] = useState([]);
  const [selectedCategorias, setSelectedCategorias] = useState([]);
  const [ratingMin, setRatingMin] = useState(0);
  const [sortBy, setSortBy] = useState("rating");
  const [openNow, setOpenNow] = useState(false);

  useEffect(() => {
    axios.get("/api/categories?type=structural")
      .then(res => setCategorias(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = () => {
    onApply({ selectedCategorias, ratingMin, sortBy, openNow });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>✖</button>

        <h3>Filtros avanzados</h3>

        <label>Categorías</label>
        <div className="checkboxes">
          {categorias.map(cat => (
            <label key={cat.name}>
              <input
                type="checkbox"
                checked={selectedCategorias.includes(cat.name)}
                onChange={() => {
                  setSelectedCategorias(prev =>
                    prev.includes(cat.name)
                      ? prev.filter(c => c !== cat.name)
                      : [...prev, cat.name]
                  );
                }}
              />
              {cat.name}
            </label>
          ))}
        </div>

        <label>Rating mínimo</label>
        <select value={ratingMin} onChange={e => setRatingMin(e.target.value)}>
          {[0,1,2,3,4,5].map(n => (
            <option key={n} value={n}>{n}★</option>
          ))}
        </select>

        <label>Ordenar por</label>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="rating">Mejor rating</option>
          <option value="createdAt">Más recientes</option>
          <option value="reviewsCount">Más comentadas</option>
        </select>

        <label>
          <input
            type="checkbox"
            checked={openNow}
            onChange={() => setOpenNow(!openNow)}
          />
          Solo cafeterías abiertas ahora
        </label>

        <button className="apply-btn" onClick={handleSubmit}>Aplicar filtros</button>
      </div>
    </div>
  );
}
