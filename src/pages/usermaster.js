import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./usermaster.css";
import axios from "axios";

export default function UserMaster() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const emptyForm = {
    UserCode: "",
    UserName: "",
    UserPassword: "",
    UserGroupid: "",
    FirstName: "",
    LastName: "",
    FullName: "",
    NickName: "",
    IdentificationNo: "",
    CardNumber: "",
    isWaiter: false,
    IsDisabled: false
  };

  const [form, setForm] = useState(emptyForm);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const saveUser = async () => {
    if (!form.UserCode || !form.UserName) {
      alert("User Code and User Name required");
      return;
    }

    try {
      await axios.post("http://localhost:3000/usermaster", form);
      alert("User saved");
      setForm(emptyForm);
      setShowModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="user_container">
      <h2 className="user_title">User Master</h2>

      <div className="user_header">
        <button
          className="user_add_btn"
          onClick={() => setShowModal(true)}
        >
          New
        </button>
      </div>

      <table className="user_table">
        <thead>
          <tr>
            <th>UserId</th>
            <th>UserCode</th>
            <th>UserName</th>
            <th>UserGroupid</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5">No Users Added</td>
            </tr>
          ) : (
            users.map((user, index) => (
              <tr key={user.UserId}>
                <td>{user.UserId}</td>
                <td>{user.UserCode}</td>
                <td>{user.UserName}</td>
                <td>{user.UserGroupid}</td>
                <td>
                  <button
                    onClick={() => {
                      setForm(user);
                      setEditIndex(index);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </button>

                  <button>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="user_modal">
          <div className="user_modal_box">

            <h3>
              {editIndex !== null ? "Edit User" : "Add User"}
            </h3>

            <div className="user_form_grid">

              <input name="UserCode" placeholder="User Code" value={form.UserCode} onChange={handleChange} />
              <input name="UserName" placeholder="User Name" value={form.UserName} onChange={handleChange} />
              <input type="password" name="UserPassword" placeholder="Password" value={form.UserPassword} onChange={handleChange} />
              <input name="UserGroupid" placeholder="User Group Id" value={form.UserGroupid} onChange={handleChange} />

              <input name="FirstName" placeholder="First Name" value={form.FirstName} onChange={handleChange} />
              <input name="LastName" placeholder="Last Name" value={form.LastName} onChange={handleChange} />
              <input name="FullName" placeholder="Full Name" value={form.FullName} onChange={handleChange} />

              <input name="NickName" placeholder="Nick Name" value={form.NickName} onChange={handleChange} />
              <input name="IdentificationNo" placeholder="Identification No" value={form.IdentificationNo} onChange={handleChange} />
              <input name="CardNumber" placeholder="Card Number" value={form.CardNumber} onChange={handleChange} />

            </div>

            <div className="user_checkbox_row">
              <label>
                <input type="checkbox" name="isWaiter" checked={form.isWaiter} onChange={handleChange} />
                Waiter
              </label>

              <label>
                <input type="checkbox" name="IsDisabled" checked={form.IsDisabled} onChange={handleChange} />
                Disabled
              </label>
            </div>

          <div className="user_modal_footer">
  <button className="user_save_btn" onClick={saveUser}>
    {editIndex !== null ? "Update" : "Save"}
  </button>

  <button
    className="user_close_btn"
    onClick={() => setShowModal(false)}
  >
    Close
  </button>
</div>

          </div>
        </div>
      )}
    </div>
  );
}