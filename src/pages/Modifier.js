import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import "./Modifier.css";
import { BASE_URL } from "../config/api";

function Modifier() {
const API = `${BASE_URL}`;
  const [showModal, setShowModal] = useState(false);
  const [modifierList, setModifierList] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const [modifier, setModifier] = useState({
    ModifierCode: "",
    ModifierName: "",
    ConflictId: "",
    isActive: true,
    SortCode: "",
    isPriceAffect: false,
    isOpenModifier: false,
  });
useEffect(() => {
  loadModifiers();
}, []);

const loadModifiers = async () => {
  try {
    const res = await axios.get(`${API}/modifiermaster`);
    setModifierList(res.data);
  } catch (err) {
    console.error("LOAD ERROR", err);
  }
};
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setModifier({
      ...modifier,
      [name]: type === "checkbox" ? checked : value,
    });
  };

 const handleSave = async () => {
  try {
    if (editIndex !== null) {
      await axios.put(`${API}/modifiermaster/${modifier.ModifierId}`, modifier);
    } else {
      await axios.post(`${API}/modifiermaster`, modifier);
    }

    loadModifiers();

    setShowModal(false);
    setEditIndex(null);

    setModifier({
      ModifierCode: "",
      ModifierName: "",
      ConflictId: "",
      isActive: true,
      SortCode: "",
      isPriceAffect: false,
      isOpenModifier: false,
    });

  } catch (err) {
    console.error("SAVE ERROR", err);
  }
};

const handleDelete = async (id) => {
  try {
    await axios.delete(`${API}/modifiermaster/${id}`);
    loadModifiers();
  } catch (err) {
    console.error("DELETE ERROR", err);
  }
};

  const handleEdit = (index) => {
  const item = modifierList[index];

  setModifier({
    ModifierId: item.ModifierId,
    ModifierCode: item.ModifierCode || "",
    ModifierName: item.ModifierName || "",
    ConflictId: item.ConflictId || "",
    isActive: item.isActive ?? true,
    SortCode: item.SortCode || "",
    isPriceAffect: item.isPriceAffect ?? false,
    isOpenModifier: item.isOpenModifier ?? false,
  });

  setEditIndex(index);
  setShowModal(true);
};

  return (
    <div className="modifier-container">

        <h1 className="modifier-title">Modifier</h1>

      <button className="new-btn" onClick={() => setShowModal(true)}>
        New
      </button>

      <table className="modifier-table">

        <thead>
          <tr>
            <th>ModifierCode</th>
            <th>ModifierName</th>
            <th>ConflictId</th>
            <th>isActive</th>
            <th>SortCode</th>
            <th>isPriceAffect</th>
            <th>isOpenModifier</th>
          </tr>
        </thead>

        <tbody>

          {modifierList.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No entries yet
              </td>
            </tr>
          ) : (

            modifierList.map((item, index) => (

             <tr key={index} style={{ cursor: "pointer" }}>

                  <td onClick={() => handleEdit(index)}>{item.ModifierCode}</td>
                  <td onClick={() => handleEdit(index)}>{item.ModifierName}</td>
                  <td onClick={() => handleEdit(index)}>{item.ConflictId}</td>
                  <td onClick={() => handleEdit(index)}>{item.isActive ? "Active" : "Inactive"}</td>
                  <td onClick={() => handleEdit(index)}>{item.SortCode}</td>
                  <td onClick={() => handleEdit(index)}>{item.isPriceAffect ? "Yes" : "No"}</td>
                  <td onClick={() => handleEdit(index)}>{item.isOpenModifier ? "Yes" : "No"}</td>
                    
                     <td>
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // 🔥 VERY IMPORTANT
                            handleDelete(item.ModifierId);
                          }}
                        >
                          Delete
                        </button>
                      </td>

                    </tr>

            ))

          )}

        </tbody>

      </table>


      {showModal && (

        <div className="modal-overlay-md">

          <div className="modal-box-md">

            <h2>{editIndex !== null ? "Edit Modifier" : "Add Modifier"}</h2>

            <div className="modifier-form">

              <div className="form-row">
                <label>Modifier Code</label>
                <input
                  name="ModifierCode"
                  value={modifier.ModifierCode}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">
                <label>Modifier Name</label>
                <input
                  name="ModifierName"
                  value={modifier.ModifierName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">
                <label>Conflict Id</label>
                <input
                  name="ConflictId"
                  value={modifier.ConflictId}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">
                <label>Active</label>
               <select
                name="isActive"
                 value={modifier.isActive}
                 onChange={(e) =>
              setModifier({
      ...modifier,
      isActive: e.target.value === "true",
    })
  }
>
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
              </div>

              <div className="form-row">
                <label>Sort Code</label>
                <input
                  type="number"
                  name="SortCode"
                  value={modifier.SortCode}
                  onChange={handleChange}
                />
              </div>


{/* Price Affect */}

<div className="checkbox-row">

<span className="label">Price Affect</span>

<input
  type="checkbox"
  name="isPriceAffect"
  checked={modifier.isPriceAffect}
  onChange={handleChange}
/>

</div>


{/* Open Modifier */}

<div className="checkbox-row">

<span className="label">Open Modifier</span>

<input
type="checkbox"
name="isOpenModifier"
checked={modifier.isOpenModifier}
onChange={handleChange}
/>

</div>


              <div className="modal-buttons-md">

                <button className="save-btn-md" onClick={handleSave}>
                  {editIndex !== null ? "Update" : "Save"}
                </button>

                <button
                  className="cancel-btn-md"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Modifier;