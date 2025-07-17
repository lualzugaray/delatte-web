import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../styles/myCafe.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function MyCafe() {
  const [cafe, setCafe] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [coverPreview, setCoverPreview] = useState("");
  const [coverUploading, setCoverUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reportingReview, setReportingReview] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const [galleryUploading, setGalleryUploading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") ?? "{}");

  useEffect(() => {
    if (!token || user.role !== "manager") {
      navigate("/login");
    } else {
      fetchCafe();
      fetchCategories();
    }
  }, [token]);

  useEffect(() => {
    if (cafe?._id) fetchReviews();
  }, [cafe]);

  const fetchCafe = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/managers/me/cafe`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const scheduleArray = Object.entries(data.schedule || {}).map(
        ([day, { open, close, isClosed }]) => ({ day, open, close, isClosed })
      );
      const initialCats = Array.isArray(data.categories) ? data.categories : [];
      setCafe(data);
      setFormData({
        schedule: scheduleArray,
        categories: initialCats,
        name: data.name,
        address: data.address,
        description: data.description,
        coverImage: data.coverImage,
        gallery: data.gallery || []
      });
      setCoverPreview(data.coverImage || "");
    } catch (error) {
      toast.error("Error al cargar la cafetería");
    }
  };


  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/categories?type=structural&isActive=true`
      );
      setCategories(data);
    } catch {
      console.error("Error al obtener categorías");
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/managers/me/reviews`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews(data);
    } catch {
      console.error("Error al cargar reseñas");
    }
  };

  const handleEdit = () => setIsEditing(true);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setFormData((prev) => ({ ...prev, categories: selected }));
  };

  const handleCoverFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      );
      const res = await axios.post(
        import.meta.env.VITE_CLOUDINARY_URL,
        form
      );
      const url = res.data.secure_url;
      setCoverPreview(url);
      setFormData((prev) => ({ ...prev, coverImage: url }));
    } catch {
      toast.error("Error al subir la portada a Cloudinary");
    } finally {
      setCoverUploading(false);
    }
  };

  const handleGalleryFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setGalleryUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      );
      const res = await axios.post(
        import.meta.env.VITE_CLOUDINARY_URL,
        form
      );
      const url = res.data.secure_url;
      setFormData((prev) => ({
        ...prev,
        gallery: [...(prev.gallery || []), url],
      }));
    } catch {
      toast.error("Error al subir imagen a Cloudinary");
    } finally {
      setGalleryUploading(false);
    }
  };

  const handleGalleryRemove = (img) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((i) => i !== img),
    }));
  };

  const toggleCategory = (id) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(id)
        ? prev.categories.filter(c => c !== id)
        : [...prev.categories, id]
    }));
  };

  const handleSave = async () => {
    try {
      const scheduleObj = (formData.schedule || []).reduce((acc, { day, open, close, isClosed }) => {
        acc[day] = { open, close, isClosed: !!(open || close) };
        return acc;
      }, {});

      const payload = {
        name: formData.name,
        address: formData.address,
        description: formData.description,
        coverImage: coverPreview,
        gallery: formData.gallery,
        schedule: scheduleObj,
        categories: formData.categories
      };

      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/managers/me/cafe`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const scheduleArray = Object.entries(data.cafe.schedule || {}).map(
        ([day, { open, close, isClosed }]) => ({ day, open, close, isClosed })
      );
      const savedCats = Array.isArray(data.cafe.categories)
        ? data.cafe.categories
        : [];
      setCafe(data.cafe);
      setFormData(prev => ({
        ...prev,
        schedule: scheduleArray,
        categories: savedCats,
      }));
      setIsEditing(false);
      toast.success("Cafetería actualizada correctamente ✅");
    } catch (error) {
      toast.error("Error al guardar los cambios ❌");
    }
  };
  const openReport = (review) => {
    setReportingReview(review);
    setReportReason("");
  };

  const submitReport = async () => {
    if (!reportReason.trim()) return toast.error("Ingresa un motivo");
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/managers/me/reviews/${reportingReview._id}/report`,
        { reason: reportReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Denuncia enviada");
      setReportingReview(null);
    } catch {
      toast.error("Error al enviar denuncia");
    }
  };
  if (!cafe) return null;

  const scheduleArray = Array.isArray(formData.schedule) ? formData.schedule : [];
  const savedSchedule = Array.isArray(cafe.schedule) ? cafe.schedule : [];
  const displaySchedule = scheduleArray.length > 0 ? scheduleArray : savedSchedule;

  return (
    <>
      <Navbar />
      <div className="mycafe-container">
        <div className="mycafe-header">
          {isEditing ? (
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          ) : (
            <h1>{cafe.name}</h1>
          )}
          <button
            onClick={isEditing ? handleSave : handleEdit}
            className="btn btn-primary"
          >
            {isEditing ? "Guardar" : "Editar"}
          </button>
        </div>

        <div className="mycafe-content">
          <h3>Dirección</h3>
          {isEditing ? (
            <input
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
            />
          ) : (
            <p>{cafe.address}</p>
          )}

          <h3>Descripción</h3>
          {isEditing ? (
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
            />
          ) : (
            <p>{cafe.description}</p>
          )}

          <h3>Portada</h3>
          {isEditing ? (
            <div className="cover-edit">
              {coverPreview && (
                <img
                  src={coverPreview}
                  alt="Portada preview"
                  className="cover-edit__img"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverFileChange}
                disabled={coverUploading}
              />
            </div>
          ) : (
            <img
              src={cafe.coverImage}
              alt="Portada"
              className="cover-image"
            />
          )}

          <h3>Galería</h3>
          {isEditing && (
            <div className="gallery-input">
              <input
                type="file"
                accept="image/*"
                onChange={handleGalleryFileChange}
                disabled={galleryUploading}
              />
            </div>
          )}
          <div className="gallery">
            {(formData.gallery || []).map((img, idx) => (
              <div key={idx} className="gallery-item">
                <img src={img} alt="Galería" />
                {isEditing && (
                  <button
                    onClick={() => handleGalleryRemove(img)}
                    className="btn btn-secondary btn-small"
                  >
                    ❌
                  </button>
                )}
              </div>
            ))}
          </div>


          <h3>Categorías</h3>
          {isEditing ? (
            <div className="tagSelectWrapper">
              <div className="tagSelect">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`tagOption ${formData.categories.includes(cat.id) ? 'selected' : ''}`}
                    onClick={() => toggleCategory(cat.id)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="cafe-categories">
              {formData.categories.map(id => {
                const cat = categories.find(c => c.id === id);
                return <span key={id} className="tag">{cat?.name || id}</span>;
              })}
            </div>
          )}

          <h3>Horarios</h3>
          {isEditing ? (
            <div className="schedule-grid">
              {displaySchedule.map(({ day, open, close }, i) => (
                <div key={day} className="schedule-row">
                  <label>{day.charAt(0).toUpperCase() + day.slice(1)}</label>
                  <input type="time" value={open}
                    onChange={e => {
                      const val = e.target.value;
                      setFormData(prev => {
                        const sc = [...prev.schedule];
                        sc[i] = { ...sc[i], open: val };
                        return { ...prev, schedule: sc };
                      });
                    }}
                  />
                  <input type="time" value={close}
                    onChange={e => {
                      const val = e.target.value;
                      setFormData(prev => {
                        const sc = [...prev.schedule];
                        sc[i] = { ...sc[i], close: val };
                        return { ...prev, schedule: sc };
                      });
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <ul>
              {displaySchedule.map(({ day, open, close }) => (
                <li key={day}>
                  {day.charAt(0).toUpperCase() + day.slice(1)}: {open || '–'} – {close || '–'}
                </li>
              ))}
            </ul>
          )}

          <h3>Reseñas</h3>
          {reviews.length === 0 ? (
            <p>No hay reseñas aún.</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev._id} className="review-item">
                <p>
                  <strong>{rev.userName || "Usuario"}</strong> (
                  {new Date(rev.createdAt).toLocaleDateString()}):
                </p>
                <p>⭐ {rev.rating}</p>
                <p>{rev.comment}</p>
                <button
                  onClick={() => openReport(rev)}
                  className="btn btn-primary btn-small"
                >
                  Denunciar
                </button>
              </div>
            ))
          )}

          {reportingReview && (
            <div className="report-modal">
              <div className="report-content">
                <h4>
                  Denunciar reseña de {reportingReview.userName || "Usuario"}
                </h4>
                <textarea
                  rows={4}
                  placeholder="Motivo de la denuncia"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                />
                <div className="report-buttons">
                  <button
                    onClick={submitReport}
                    className="btn btn-primary"
                  >
                    Enviar denuncia
                  </button>
                  <button
                    onClick={() => setReportingReview(null)}
                    className="btn btn-secondary"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}
