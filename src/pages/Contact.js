import { useState, useEffect } from "react";
import axios from "axios";
import "./Contact.css";

function Contact() {
  const [entries, setEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    kitchen_code: "",
    kitchen_name: "",
    active: "Yes",
  });

  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchKitchen();
  }, []);

  const fetchKitchen = async () => {
    try {
      const res = await axios.get("http://localhost:3000/kitchen");
      const data = res.data.map((item) => ({
        id: item.KitchenTypeId,
        kitchen_code: item.KitchenTypeCode,
        kitchen_name: item.KitchenTypeName,
        active: item.isActive ? "Yes" : "No",
      }));
      setEntries(data);
    } catch (err) {
      alert("Failed to load kitchen data");
    }
  };

  const fetchNextCode = async () => {
    try {
      const res = await axios.get("http://localhost:3000/kitchen/nextcode");
      setForm({
        kitchen_code: res.data.NextNumber,
        kitchen_name: "",
        active: "Yes",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const openNewModal = () => {
    fetchNextCode();
    setEditingId(null);
    setShowModal(true);
  };

  const handleEdit = (entry) => {
    setForm(entry);
    setEditingId(entry.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this kitchen?")) return;

    try {
      await axios.delete(`http://localhost:3000/kitchen/${id}`);
      fetchKitchen();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.kitchen_code || !form.kitchen_name) {
      alert("Enter kitchen code and name");
      return;
    }

    try {
      const payload = {
        BusinessUnitId: "11111111-1111-1111-1111-111111111111",
        KitchenTypeCode: parseInt(form.kitchen_code),
        KitchenTypeName: form.kitchen_name,
        isActive: form.active === "Yes" ? 1 : 0,
        CreatedBy: "22222222-2222-2222-2222-222222222222",
      };

      if (editingId) {
        await axios.put(`http://localhost:3000/kitchen/${editingId}`, payload);
      } else {
        await axios.post("http://localhost:3000/kitchen", payload);
      }

      setForm({
        kitchen_code: "",
        kitchen_name: "",
        active: "Yes",
      });

      setShowModal(false);
      fetchKitchen();
    } catch (err) {
      alert("Save failed");
    }
  };

  return (
    <div className="kitchen_container">
      <h1 className="kitchen_title">Kitchen</h1>

      <div className="kitchen_header">
        <button className="kitchen_new_btn" onClick={openNewModal}>
          New
        </button>
      </div>

      {showModal && (
        <div className="kitchen_modal">
          <div className="kitchen_modal_box">
            <h2>{editingId ? "Edit Kitchen" : "New Kitchen"}</h2>

            <form onSubmit={handleSubmit}>
            <div className="kitchen_form_grid">

  <div className="kitchen_field">
    <label>Kitchen Code</label>
    <input
      type="number"
      name="kitchen_code"
      value={form.kitchen_code}
      onChange={handleChange}
    />
  </div>

  <div className="kitchen_field">
    <label>Kitchen Name</label>
    <input
      type="text"
      name="kitchen_name"
      value={form.kitchen_name}
      onChange={handleChange}
    />
  </div>

  <div className="kitchen_field">
    <label>Active</label>
    <select
      name="active"
      value={form.active}
      onChange={handleChange}
    >
      <option value="Yes">Yes</option>
      <option value="No">No</option>
    </select>
  </div>

</div>

              <div className="kitchen_modal_footer">
                <button type="submit" className="kitchen_save_btn">
                  {editingId ? "Update" : "Save"}
                </button>

                <button
                  type="button"
                  className="kitchen_cancel_btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table className="kitchen_table">
        <thead>
          <tr>
            {/* <th>S.No</th> */}
            <th>Kitchen Code</th>
            <th>Kitchen Name</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {entries.map((row, index) => (
            <tr key={row.id}>
              {/* <td>{index + 1}</td> */}
              <td>{row.kitchen_code}</td>
              <td>{row.kitchen_name}</td>
              <td>{row.active}</td>
              <td>
                <button onClick={() => handleEdit(row)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Contact;