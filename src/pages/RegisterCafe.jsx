import React, { useEffect, useState, Fragment, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useJsApiLoader } from "@react-google-maps/api";
import { createCafeService } from "../services/manager/cafe.service";
import "../styles/registerCafe.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const libraries = ["places"];

export default function RegisterCafe() {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
        libraries,
    });

    const cloudName = "dx4vlzl5r";
    const uploadPreset = "delatte_unsigned";
    const addressRef = useRef();
    const fileInputRef = useRef();
    const navigate = useNavigate();

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
            { day: "lunes", open: "", close: "" },
            { day: "martes", open: "", close: "" },
            { day: "miércoles", open: "", close: "" },
            { day: "jueves", open: "", close: "" },
            { day: "viernes", open: "", close: "" },
            { day: "sábado", open: "", close: "" },
            { day: "domingo", open: "", close: "" },
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
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) return navigate("/login");

        const fetchCategories = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/categories?type=structural&isActive=true`);
                const data = await res.json();
                console.log("Categorías cargadas:", data);
                setCategories(data);
            } catch (err) {
                toast.error("Error cargando categorías ❌");
            }
        };

        fetchCategories();
    }, [token, navigate]);

    useEffect(() => {
        if (isLoaded && addressRef.current) {
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
    }, [isLoaded]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (gallery.length < 3) {
            toast.error("Debés subir al menos 3 fotos del café ❌");
            return;
        }

        if (!form.name || !form.address) {
            toast.error("Completá nombre y dirección ❌");
            return;
        }

        const hasValidSchedule = form.schedule.some(day => day.open && day.close);
        if (!hasValidSchedule) {
            toast.error("Cargá al menos un horario de atención ❌");
            return;
        }

        // Si no hay coverImage seleccionada, usar la primera imagen de la galería
        const finalCoverImage = coverImage || gallery[0];

        setLoading(true);
        try {
            await createCafeService({
                ...form,
                gallery,
                coverImage: finalCoverImage,
                suggestedCategories: newCategories,
            }, token);
            
            toast.success("¡Cafetería registrada con éxito! ✅");
            
            // Esperar 2 segundos antes de redirigir
            setTimeout(() => {
                navigate("/explorar");
            }, 2000);
            
        } catch (err) {
            toast.error(err.message || "Hubo un error al registrar la cafetería ❌");
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        const uploadedImages = [];

        for (const file of files) {
            if (file.size > 10 * 1024 * 1024) {
                toast.error("El archivo excede los 10MB permitidos ❌");
                continue;
            }

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
            } catch (err) {
                console.error("Error subiendo imagen:", err);
                toast.error("Error al subir imagen ❌");
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

    const toggleCategory = (id) => {
        const selected = form.categories.includes(id);
        setForm((prev) => ({
            ...prev,
            categories: selected
                ? prev.categories.filter((catId) => catId !== id)
                : [...prev.categories, id],
        }));
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
                        <input className="input" ref={addressRef} value={form.address} placeholder="Escribí y seleccioná una dirección" required onChange={(e) => setForm({ ...form, address: e.target.value })} />

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
                        <textarea className="textarea" placeholder="Descripción" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />

                        <label className="label">Imágenes</label>
                        <input type="file" multiple accept="image/*" onChange={handleImageUpload} ref={fileInputRef} />

                        <div className="image-preview-grid">
                            {gallery.map((url, index) => (
                                <div key={index} className="image-preview-card">
                                    <img src={url} alt={`preview-${index}`} className="preview-img" />
                                    <button type="button" className={`select-cover ${coverImage === url ? "selected" : ""}`} onClick={() => setCoverImage(url)}>
                                        {coverImage === url ? "✅ Portada seleccionada" : "Seleccionar como portada"}
                                    </button>
                                    <button type="button" className="delete-img" onClick={() => {
                                        const updated = gallery.filter((u) => u !== url);
                                        setGallery(updated);
                                        if (coverImage === url) setCoverImage(null);
                                    }}>
                                        ❌
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="checkboxes">
                            <label><input type="checkbox" checked={form.hasPowerOutlets} onChange={(e) => setForm({ ...form, hasPowerOutlets: e.target.checked })} /> Enchufes disponibles</label>
                            <label><input type="checkbox" checked={form.isPetFriendly} onChange={(e) => setForm({ ...form, isPetFriendly: e.target.checked })} /> Pet friendly</label>
                            <label><input type="checkbox" checked={form.isDigitalNomadFriendly} onChange={(e) => setForm({ ...form, isDigitalNomadFriendly: e.target.checked })} /> Apto nómades digitales</label>
                        </div>
                    </div>
                </div>

                <label className="label">Categorías</label>
                <div className="tagSelectWrapper">
                    <div className="tagSelect">
                        {categories.slice(0, 6).map((cat) => (
                            <button type="button" key={cat.id} className={`tagOption ${form.categories.includes(cat.id) ? "selected" : ""}`} onClick={() => toggleCategory(cat.id)}>
                                {cat.name}
                            </button>
                        ))}
                        {categories.length > 6 && (
                            <button type="button" className="tagOption moreButton" onClick={() => setShowModal(true)}>
                                + más
                            </button>
                        )}
                    </div>
                </div>

                {showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <h2>Todas las categorías</h2>
                            <div className="modal-tags">
                                {categories.map((cat) => (
                                    <button key={cat.id} type="button" className={`tagOption ${form.categories.includes(cat.id) ? "selected" : ""}`} onClick={() => toggleCategory(cat.id)}>
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                            <button className="closeModal" onClick={() => setShowModal(false)}>Cerrar</button>
                        </div>
                    </div>
                )}

                <div className="formRow categoryRow">
                    <input type="text" className="input short" placeholder="Sugerir nueva categoría" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
                    <button type="button" onClick={handleAddNewCategory} className="suggestButton">Agregar</button>
                </div>

                {newCategories.length > 0 && (
                    <div className="tagList">
                        {newCategories.map((cat, index) => <span key={index} className="tag">{cat}</span>)}
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
            </form>
            <ToastContainer position="top-center" autoClose={3000} /> 
        </div>
    );
}