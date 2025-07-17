import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import "../styles/profile.css";
import FavoriteCafesCarousel from "../components/FavoriteCafesCarousel";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Profile() {
  const [user, setUser] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    socialLinks: {
      instagram: "",
      twitter: "",
      facebook: "",
      tiktok: "",
      website: ""
    }
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const normalizeUrl = (url) =>
    url && !/^https?:\/\//i.test(url) ? `https://${url}` : url;

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      axios
        .get(`${import.meta.env.VITE_API_URL}/clients/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser(res.data);
          setFormData({
            firstName: res.data.firstName,
            lastName: res.data.lastName,
            bio: res.data.bio || "",
            socialLinks: res.data.socialLinks || {}
          });
        })
        .catch((err) => console.error(err));
    }
  }, [token, navigate]);

  useEffect(() => {
    if (token) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/clients/me/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setFavorites(res.data);
        })
        .catch((err) => console.error(err));
    }
  }, [token]);

  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    const updatedFormData = {
      ...formData,
      socialLinks: Object.fromEntries(
        Object.entries(formData.socialLinks).map(([key, value]) => [
          key,
          normalizeUrl(value),
        ])
      ),
    };

    axios
      .put(`${import.meta.env.VITE_API_URL}/clients/me`, updatedFormData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        return axios.get(`${import.meta.env.VITE_API_URL}/clients/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((res) => {
        setUser(res.data);
        setFormData({
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          bio: res.data.bio || "",
          socialLinks: res.data.socialLinks || {},
        });
        setIsEditing(false);
        toast.success("Perfil actualizado correctamente ✅");
      })
      .catch((err) => {
        toast.error("Hubo un error al actualizar el perfil ❌");
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("socialLinks.")) {
      const field = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        socialLinks: {
          ...prevData.socialLinks,
          [field]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleFavoriteToggle = async (cafeId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/clients/me/favorites/${cafeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Café eliminado de favoritos");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/clients/me/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(res.data);
    } catch (err) {
      toast.error("No se pudo eliminar de favoritos");
    }
  };


  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          {isEditing ? (
            <div>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
              />
            </div>
          ) : (
            <h1>{(user.firstName || "") + " " + (user.lastName || "")}</h1>
          )}
          <button className="edit-btn" onClick={isEditing ? handleSave : handleEdit}>
            {isEditing ? "Guardar" : "Editar"}
          </button>
        </div>

        <div className="profile-content">
          <div className="profile-bio">
            <h3>Biografía</h3>
            {!isEditing ? (
              <p>{user.bio || "Aún no has añadido una biografía."}</p>
            ) : (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Escribe algo sobre ti..."
              />
            )}
          </div>

          <div className="profile-social-links">
            <h3>Redes Sociales</h3>

            {!isEditing && (!user.socialLinks || Object.keys(user.socialLinks).length === 0) ? (
              <p>Aún no has añadido ninguna red social.</p>
            ) : (
              !isEditing && (
                <div className="social-tags">
                  {Object.entries(user.socialLinks || {}).map(([platform, link]) =>
                    link ? (
                      <div className="social-tag" key={platform}>
                        <a href={normalizeUrl(link)} target="_blank" rel="noopener noreferrer">
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </a>
                      </div>
                    ) : null
                  )}
                </div>
              )
            )}

            {isEditing && (
              <div>
                <input
                  type="url"
                  name="socialLinks.instagram"
                  value={formData.socialLinks.instagram || ""}
                  onChange={handleChange}
                  placeholder="Instagram URL"
                />
                <input
                  type="url"
                  name="socialLinks.twitter"
                  value={formData.socialLinks.twitter || ""}
                  onChange={handleChange}
                  placeholder="Twitter URL"
                />
                <input
                  type="url"
                  name="socialLinks.facebook"
                  value={formData.socialLinks.facebook || ""}
                  onChange={handleChange}
                  placeholder="Facebook URL"
                />
                <input
                  type="url"
                  name="socialLinks.tiktok"
                  value={formData.socialLinks.tiktok || ""}
                  onChange={handleChange}
                  placeholder="TikTok URL"
                />
                <input
                  type="url"
                  name="socialLinks.website"
                  value={formData.socialLinks.website || ""}
                  onChange={handleChange}
                  placeholder="Website URL"
                />
              </div>
            )}
          </div>
        </div>


        <div className="profile-favorites">
          <h3>Mis Favoritos</h3>
          {favorites.length > 0 ? (
            <FavoriteCafesCarousel cafes={favorites} favorites={favorites} handleFavoriteToggle={handleFavoriteToggle} />
          ) : (
            <p>Aún no tienes cafeterías en tus favoritos.</p>
          )}
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}
