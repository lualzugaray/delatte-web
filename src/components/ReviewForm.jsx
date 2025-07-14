import React, { useEffect, useState } from "react";
import "../styles/cafeDetails.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ReviewForm({ cafeId, onReviewSent }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [newCategoryNames, setNewCategoryNames] = useState([""]);
    const [submitting, setSubmitting] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [suggestedCategories, setSuggestedCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;
    const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;


    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_URL}/categories?isActive=true`)
            .then((res) => setCategories(res.data))
            .catch((err) => console.error("Error cargando categorías:", err));
    }, []);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const form = new FormData();
        form.append("file", file);
        form.append("upload_preset", UPLOAD_PRESET);

        try {
            const res = await fetch(CLOUDINARY_URL, {
                method: "POST",
                body: form,
            });
            if (!res.ok) throw new Error("Error uploading image");
            const data = await res.json();
            setImage(data.secure_url);
        } catch (err) {
            const message = err.response?.data?.error ||
                "Error al subir imagen. Asegurate de no exceder el tamaño o formato permitidos.";
            toast.error(message);
            console.error(err);
        }
    };
    const toggleCategory = (id) => {
        setSelectedCategories((prev) =>
            prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
        );
    };

    const handleAddNewCategory = () => {
        const trimmed = newCategory.trim();
        if (trimmed && !suggestedCategories.includes(trimmed)) {
            setSuggestedCategories([...suggestedCategories, trimmed]);
            setNewCategory("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        console.log({
            cafeId,
            rating,
            comment,
            image,
            selectedCategoryIds: selectedCategories,
            newCategoryNames: suggestedCategories,
        });
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/reviews`,
                {
                    cafeId,
                    rating,
                    comment,
                    image,
                    selectedCategoryIds: selectedCategories,
                    newCategoryNames: suggestedCategories,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            toast.success("¡Reseña enviada con éxito!");
            setTimeout(() => {
                if (onReviewSent) onReviewSent();
            }, 1000);
        } catch (err) {
            toast.error("Ten en cuenta que solo un cliente registrado puede enviar una reseña :) No puedes enviar varias reseñas a la misma cafeterìa.");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="review-form">
            <div className="review-grid">
                {/* Columna izquierda */}
                <div className="left-column">
                    <label>Calificación:</label>
                    <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                        {[5, 4, 3, 2, 1].map((n) => (
                            <option key={n} value={n}>{n} ⭐</option>
                        ))}
                    </select>

                    <label>Imagen (opcional):</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} />
                </div>

                {/* Columna derecha */}
                <div className="right-column">
                    <label>Comentario:</label>
                    <textarea
                        placeholder="Contanos tu experiencia..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                    />
                </div>
            </div>

            <label className="label">Categorías</label>
            <div className="tagSelectWrapper">
                <div className="tagSelect">
                    {categories.slice(0, 6).map((cat) => (
                        <button type="button" key={cat.id}
                            className={`tagOption ${selectedCategories.includes(cat.id) ? "selected" : ""}`}
                            onClick={() => toggleCategory(cat.id)}>
                            {cat.name}
                        </button>
                    ))}
                    {categories.length > 6 && (
                        <button type="button" className="tagOption moreButton" onClick={() => setShowCategoryModal(true)}>+ más</button>
                    )}
                </div>
            </div>

            <div className="formRow categoryRow">
                <input type="text" className="input short" placeholder="Sugerir nueva categoría" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
                <button type="button" onClick={handleAddNewCategory} className="suggestButton">Agregar</button>
            </div>

            {suggestedCategories.length > 0 && (
                <div className="tagList">
                    {suggestedCategories.map((cat, index) => <span key={index} className="tag">{cat}</span>)}
                </div>
            )}

            <div style={{ display: "flex", justifyContent: "center" }}>
                <button type="submit" className="submit" disabled={submitting}>
                    {submitting ? "Enviando..." : "Enviar reseña"}
                </button>
            </div>
            {showCategoryModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Todas las categorías</h2>
                        <div className="modal-tags">
                            {categories.map((cat) => (
                                <button key={cat.id}
                                    type="button"
                                    className={`tagOption ${selectedCategories.includes(cat.id) ? "selected" : ""}`}
                                    onClick={() => toggleCategory(cat.id)}>
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                        <button className="closeModal" onClick={() => setShowCategoryModal(false)}>Cerrar</button>
                    </div>
                </div>
            )}

        </form>

    );
}
