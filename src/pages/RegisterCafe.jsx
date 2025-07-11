import React, { useEffect, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { createCafeService } from "../services/manager/cafe.service";
import "../styles/register-cafe.css";
import { useRef } from "react";

export default function RegisterCafe() {

    const cloudName = "dx4vlzl5r";
    const uploadPreset = "delatte_unsigned";
    const addressRef = useRef();

    const [form, setForm] = useState({
        name: "",
        address: "",
        phone: "",
        email: "",
        instagram: "",
        menuUrl: "",
        description: "",
        location: { lat: "", lng: "" },
        categories: [],
        schedule: [
            { day: "monday", open: "", close: "" },
            { day: "tuesday", open: "", close: "" },
            { day: "wednesday", open: "", close: "" },
            { day: "thursday", open: "", close: "" },
            { day: "friday", open: "", close: "" },
            { day: "saturday", open: "", close: "" },
            { day: "sunday", open: "", close: "" },
        ],
        hasPowerOutlets: false,
        isPetFriendly: false,
        isDigitalNomadFriendly: false,

    });

    const [gallery, setGallery] = useState([]);
    const [coverImage, setCoverImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [newCategories, setNewCategories] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) return navigate("/login");

        const fetchCategories = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/categories?type=structural&isActive=true`
                );
                const data = await res.json();
                setCategories(data);
            } catch (err) {
                setError("Error cargando categorías");
            }
        };

        fetchCategories();
        if (window.google && addressRef.current) {
            const autocomplete = new window.google.maps.places.Autocomplete(addressRef.current, {
                types: ["geocode"],
                componentRestrictions: { country: "uy" },
            });

            autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace();
                const address = place.formatted_address;
                const location = place.geometry?.location;

                if (address && location) {
                    setForm((prev) => ({
                        ...prev,
                        address,
                        location: {
                            lat: location.lat(),
                            lng: location.lng(),
                        },
                    }));
                }
            });
        }

    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!gallery.length) {
            return setError("Debés subir al menos una imagen");
        }
        if (!coverImage) {
            return setError("Seleccioná una imagen de portada");
        }

        if (!form.name || !form.address) {
            return setError("Completá los campos obligatorios: nombre y dirección");
        }

        const hasValidSchedule = form.schedule.some(day => day.open && day.close);
        if (!hasValidSchedule) {
            return setError("Cargá al menos un horario de atención");
        }

        setLoading(true);
        try {
            await createCafeService({
                ...form,
                gallery,
                coverImage,
                suggestedCategories: newCategories,
            }, token);
            setSuccess("Cafetería registrada con éxito");
            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        const uploadedImages = [];

        for (const file of files) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", uploadPreset);

            try {
                const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                    method: "POST",
                    body: formData,
                });
                const data = await res.json();
                uploadedImages.push(data.secure_url);
                if (file.size > 10 * 1024 * 1024) {
                    return setError("El archivo excede los 10MB permitidos");
                }

            } catch (err) {
                console.error("Error subiendo imagen a Cloudinary:", err);
            }
        }

        setGallery((prev) => [...prev, ...uploadedImages]);
    };

    const handleAddNewCategory = () => {
        const trimmed = newCategory.trim();
        if (trimmed && !newCategories.includes(trimmed)) {
            setNewCategories([...newCategories, trimmed]);
            setNewCategory("");
        }
    };

    const updateSchedule = (day, type, value) => {
        setForm((prev) => {
            const updatedSchedule = prev.schedule.map((s) =>
                s.day === day ? { ...s, [type]: value } : s
            );
            return { ...prev, schedule: updatedSchedule };
        });
    };

    return (
        <div className="container">
            <h1 className="title">Registrar cafetería</h1>
            <form onSubmit={handleSubmit} className="form">
                <div className="formGrid">
                    <div className="formLeft">
                        <label className="label">Nombre</label>
                        <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />

                        <label className="label">Dirección</label>
                        <input
                            className="input"
                            ref={addressRef}
                            defaultValue={form.address}
                            placeholder="Escribí y seleccioná una dirección"
                            required
                        />

                        <label className="label">Teléfono</label>
                        <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />

                        <label className="label">Email</label>
                        <input className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />

                        <label className="label">Instagram</label>
                        <input className="input" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />

                        <label className="label">Menú (URL)</label>
                        <input className="input" value={form.menuUrl} onChange={(e) => setForm({ ...form, menuUrl: e.target.value })} />
                    </div>

                    <div className="formRight">
                        <label className="label">Descripción</label>
                        <textarea
                            className="textarea"
                            placeholder="Descripción"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })} required
                        />
                        <label className="label">Imágenes</label>
                        <input type="file" multiple accept="image/*" onChange={handleImageUpload} />

                        <div className="image-preview-grid">
                            {gallery.map((url, index) => (
                                <div key={index} className="image-preview-card">
                                    <img src={url} alt={`preview-${index}`} className="preview-img" />
                                    <button
                                        type="button"
                                        className={`select-cover ${coverImage === url ? "selected" : ""}`}
                                        onClick={() => setCoverImage(url)}
                                    >
                                        {coverImage === url ? "✅ Portada seleccionada" : "Seleccionar como portada"}
                                    </button>
                                    <button
                                        type="button"
                                        className="delete-img"
                                        onClick={() => {
                                            const newGallery = gallery.filter((u) => u !== url);
                                            setGallery(newGallery);
                                            if (coverImage === url) setCoverImage(null);
                                            if (newGallery.length === 0 && fileInputRef.current) {
                                                fileInputRef.current.value = null;
                                            }
                                        }}

                                    >
                                        ❌
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="checkboxes">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={form.hasPowerOutlets}
                                    onChange={(e) => setForm({ ...form, hasPowerOutlets: e.target.checked })}
                                />
                                Enchufes disponibles
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={form.isPetFriendly}
                                    onChange={(e) => setForm({ ...form, isPetFriendly: e.target.checked })}
                                />
                                Pet friendly
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={form.isDigitalNomadFriendly}
                                    onChange={(e) => setForm({ ...form, isDigitalNomadFriendly: e.target.checked })}
                                />
                                Apto nómades digitales
                            </label>
                        </div>
                    </div>

                </div>

                <label className="label">Categorías</label>
                <div className="tagSelectWrapper">
                    <div className="tagSelect">
                        {categories.slice(0, 6).map((cat) => {
                            const selected = form.categories.includes(cat._id);
                            return (
                                <button
                                    type="button"
                                    key={cat._id}
                                    className={`tagOption ${selected ? "selected" : ""}`}
                                    onClick={() => {
                                        setForm((prev) => ({
                                            ...prev,
                                            categories: selected
                                                ? prev.categories.filter((id) => id !== cat._id)
                                                : [...prev.categories, cat._id],
                                        }));
                                    }}
                                >
                                    {cat.name}
                                </button>
                            );
                        })}
                        {categories.length > 6 && (
                            <button
                                type="button"
                                className="tagOption moreButton"
                                onClick={() => alert("Abrir modal con todas las categorías")}
                            >
                                + más
                            </button>
                        )}
                    </div>
                </div>

                <div className="formRow categoryRow">
                    <input
                        type="text"
                        className="input short"
                        placeholder="Sugerir nueva categoría"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={handleAddNewCategory}
                        className="suggestButton"
                    >
                        Agregar
                    </button>
                </div>

                {newCategories.length > 0 && (
                    <div className="tagList">
                        {newCategories.map((cat, index) => (
                            <span key={index} className="tag">{cat}</span>
                        ))}
                    </div>
                )}

                <label className="label">Horarios</label>
                <div className="scheduleGrid">
                    {form.schedule.map(({ day, open, close }) => (
                        <Fragment key={day}>
                            <span className="day">{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                            <div className="timeGroup">
                                <label className="timeLabel">Desde</label>
                                <input type="time" className="timeInput" value={open} onChange={(e) => updateSchedule(day, "open", e.target.value)} />
                            </div>
                            <div className="timeGroup">
                                <label className="timeLabel">Hasta</label>
                                <input type="time" className="timeInput" value={close} onChange={(e) => updateSchedule(day, "close", e.target.value)} />
                            </div>
                        </Fragment>
                    ))}
                </div>
                <div className="submitContainer">
                    <button type="submit" className="submit" disabled={loading}>
                        {loading ? "Registrando..." : "Registrar"}
                    </button>
                </div>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
            </form>
        </div>
    );
}
