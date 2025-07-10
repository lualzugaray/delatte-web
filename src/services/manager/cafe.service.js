export const createCafeService = async (formData, token) => {
    console.log("🌐 API URL:", import.meta.env.VITE_API_URL);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/managers/me/cafe`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
    });

    if (!res.ok) {
        const errorData = await res.json();
        console.log("📦 FormData enviado:", formData);
        throw new Error(errorData.message || "Error al registrar la cafetería");
    }

    return res.json();
};