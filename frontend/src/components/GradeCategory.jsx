import { useState } from "react";
import api from "../api/axios";

const GradeCategory = ({
  categoryKey,
  categoryName,
  weight,
  maxGrades,
  grades = [],
  studentId,
  assignmentId,
  trimester,
  onGradeUpdate,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newGrade, setNewGrade] = useState({
    score: "",
    description: "",
  });

  // Calculate category average
  const calculateAverage = () => {
    if (grades.length === 0) return null;
    const sum = grades.reduce((acc, g) => acc + g.score, 0);
    return (sum / grades.length).toFixed(1);
  };

  const handleAddGrade = async () => {
    // Check if score is empty
    if (!newGrade.score || newGrade.score.trim() === "") {
      alert("Por favor ingresa una calificación");
      return;
    }

    const scoreValue = parseFloat(newGrade.score);

    // Check if it's a valid number
    if (isNaN(scoreValue)) {
      alert("Por favor ingresa un número válido");
      return;
    }

    // Check if it's in range
    if (scoreValue < 0 || scoreValue > 10) {
      alert("La calificación debe estar entre 0 y 10");
      return;
    }

    try {
      await api.post("/grades", {
        student: studentId,
        assignment: assignmentId,
        trimester,
        category: categoryKey,
        score: scoreValue,
        description: newGrade.description,
      });

      setNewGrade({ score: "", description: "" });
      setIsAdding(false);
      onGradeUpdate();
    } catch (error) {
      console.error("Error adding grade:", error);
      alert(error.response?.data?.message || "Error al agregar calificación");
    }
  };

  const handleUpdateGrade = async (gradeId, newScore) => {
    if (!newScore || newScore.trim() === "") {
      alert("Por favor ingresa una calificación");
      return;
    }

    const scoreValue = parseFloat(newScore);

    if (isNaN(scoreValue)) {
      alert("Por favor ingresa un número válido");
      return;
    }

    if (scoreValue < 0 || scoreValue > 10) {
      alert("La calificación debe estar entre 0 y 10");
      return;
    }

    try {
      await api.put(`/grades/${gradeId}`, {
        score: scoreValue,
      });
      onGradeUpdate();
    } catch (error) {
      console.error("Error updating grade:", error);
      alert(
        error.response?.data?.message || "Error al actualizar calificación",
      );
    }
  };

  const handleDeleteGrade = async (gradeId) => {
    if (!confirm("¿Estás seguro de eliminar esta calificación?")) return;

    try {
      await api.delete(`/grades/${gradeId}`);
      onGradeUpdate();
    } catch (error) {
      console.error("Error deleting grade:", error);
    }
  };

  const average = calculateAverage();
  const canAddMore =
    categoryKey === "evaluacion_final"
      ? grades.length < 1
      : grades.length < maxGrades;

  return (
    <div className="grade-category">
      <div
        className="category-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="category-info">
          <span className="category-icon">{isExpanded ? "▼" : "▶"}</span>
          <span className="category-name">{categoryName}</span>
          <span className="category-weight">({weight}%)</span>
        </div>
        <div className="category-average">
          {average !== null ? (
            <>
              Promedio: <strong>{average}</strong>
            </>
          ) : (
            <span className="text-gray-400">Sin calificaciones</span>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="category-content">
          <div className="grades-list">
            {grades.map((grade, index) => (
              <div key={grade._id} className="grade-item">
                <span className="grade-label">
                  {grade.description || `${categoryName} ${index + 1}`}
                </span>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  className="grade-input-small"
                  value={grade.score}
                  onChange={(e) => handleUpdateGrade(grade._id, e.target.value)}
                />
                <button
                  onClick={() => handleDeleteGrade(grade._id)}
                  className="btn-delete-small"
                  title="Eliminar"
                >
                  ✕
                </button>
              </div>
            ))}

            {isAdding && (
              <div className="grade-item-new">
                <input
                  type="text"
                  placeholder="Descripción (opcional)"
                  className="description-input"
                  value={newGrade.description}
                  onChange={(e) =>
                    setNewGrade({ ...newGrade, description: e.target.value })
                  }
                />
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  placeholder="0-10"
                  className="grade-input-small"
                  value={newGrade.score}
                  onChange={(e) =>
                    setNewGrade({ ...newGrade, score: e.target.value })
                  }
                  autoFocus
                />
                <button onClick={handleAddGrade} className="btn-save-small">
                  ✓
                </button>
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setNewGrade({ score: "", description: "" });
                  }}
                  className="btn-cancel-small"
                >
                  ✕
                </button>
              </div>
            )}

            {!isAdding && canAddMore && (
              <button
                onClick={() => setIsAdding(true)}
                className="btn-add-grade"
              >
                + Agregar Calificación
              </button>
            )}

            {!canAddMore && categoryKey !== "evaluacion_final" && (
              <p className="text-sm text-gray-500 mt-2">
                Máximo de {maxGrades} calificaciones alcanzado
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GradeCategory;
