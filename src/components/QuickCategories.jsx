import { useNavigate } from "react-router-dom";
import "../styles/quickCategories.css";

const STATIC_CATEGORIES = [
  {
    name: "café de especialidad",
    image: "/cafe-especialidad.png",
  },
  {
    name: "tranquilo",
    image: "/tranquilo.png",
  },
  {
    name: "para trabajar",
    image: "/work.png",
  },
  {
    name: "pet friendly",
    image: "/pet-friendly.png",
  },
];

export default function QuickCategories({ categories = STATIC_CATEGORIES }) {
    const navigate = useNavigate();
  
    const handleClick = (name) => {
      navigate(`/explorar?category=${encodeURIComponent(name)}`);
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