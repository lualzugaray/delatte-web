import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/cafeMap.css";

const containerStyle = {
    width: "100%",
    height: "260px",
    borderRadius: "6px",
    marginTop: "32px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
};

const center = {
    lat: -34.9011,
    lng: -56.1645,
};
const libraries = ["places"];
export default function CafeMap({ cafes = [] }) {
    const [selectedCafe, setSelectedCafe] = useState(null);
    const navigate = useNavigate();

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
        libraries,
    });

    if (loadError) {
        return <p className="error-text">❌ Error cargando el mapa de Google</p>;
    }

    if (!isLoaded) {
        return <p className="loading-text">🗺️ Cargando mapa...</p>;
    }

    return (
        <div className="cafe-map-container">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={13}
                onClick={() => setSelectedCafe(null)}
            >
                {Array.isArray(cafes) &&
                    cafes.map((cafe) => (
                        <Marker
                            key={cafe._id}
                            position={{
                                lat: cafe.location?.lat || center.lat,
                                lng: cafe.location?.lng || center.lng,
                            }}
                            onClick={() => setSelectedCafe(cafe)}
                        />
                    ))}

                {selectedCafe && (
                    <InfoWindow
                        position={{
                            lat: selectedCafe.location?.lat || center.lat,
                            lng: selectedCafe.location?.lng || center.lng,
                        }}
                        onCloseClick={() => setSelectedCafe(null)}
                    >
                        <div style={{ maxWidth: "200px" }}>
                            <h4 style={{ margin: "0 0 6px", fontSize: "1rem" }}>{selectedCafe.name}</h4>
                            <p style={{ margin: 0, fontSize: "0.85rem", color: "#444" }}>
                                {selectedCafe.address || "Dirección no disponible"}
                            </p>
                            <p style={{ margin: "6px 0", fontSize: "0.9rem", color: "#b47940" }}>
                                {"★".repeat(Math.round(selectedCafe.averageRating || 0))}
                                {"☆".repeat(5 - Math.round(selectedCafe.averageRating || 0))}
                            </p>
                            <button
                                onClick={() => navigate(`/cafeteria/${selectedCafe._id}`)}
                                style={{
                                    padding: "6px 10px",
                                    fontSize: "0.8rem",
                                    backgroundColor: "#3d1f0f",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                }}
                            >
                                Ver más
                            </button>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>

            {cafes.length === 0 && (
                <p className="no-cafes-text">Aún no hay cafeterías registradas para mostrar en el mapa 🗺️</p>
            )}
        </div>
    );
}
