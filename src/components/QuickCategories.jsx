import { useNavigate } from "react-router-dom";
import "../styles/quickCategories.css";

const STATIC_CATEGORIES = [
    {
      name: "Café de especialidad",
      image: "/cafe-especialidad.png",
    },
    {
      name: "Espacio tranquilo",
      image: "/tranquilo.png",
    },
    {
      name: "Espacio para trabajar",
      image: "/work.png",
    },
    {
      name: "Pet-friendly",
      image: "/pet-friendly.png",
    },
  ];
  

export default function QuickCategories({ categories = STATIC_CATEGORIES }) {
    const navigate = useNavigate();

    const handleClick = (name) => {
        localStorage.removeItem("delatteFilters"); 
        navigate(`/explore?q=${encodeURIComponent(name)}`);
      };
      
    return (
        <div className="quick-categories">
            <h3>categorías rápidas</h3>
            <div className="categories-list">
                {categories.map((cat) => (
                    <div
                        key={cat.name}
                        className="category-card"
                        onClick={() => handleClick(cat.name)}
                    >
                        <div className="category-image-wrapper">
                            <img src={cat.image} alt={cat.name} className="category-image" />
                        </div>
                        <p>{cat.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}