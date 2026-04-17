import React, { useState } from "react";
import "./StockEntryPage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function StockEntryPage() {

  const navigate = useNavigate();

   const { tranNo } = useParams();
   
  const [rows, setRows] = useState([]);

  const [header, setHeader] = useState({
    tranNo: "P00000001",
    vendorCode: "",
    vendorName: "",
    gstType: "",
    tranDate: "2026-04-15",
    tranType: "PURORD"
  });

  const [entry, setEntry] = useState({
    itemCode: "",
    desc: "",
    qty: "",
    price: "",
    total: ""
  });

  // HANDLE INPUT
  const handleChange = (field, value) => {
    const updated = { ...entry, [field]: value };

    const qty = Number(updated.qty || 0);
    const price = Number(updated.price || 0);
    updated.total = qty * price;

    setEntry(updated);
  };

  // ADD ROW
  const addRow = () => {
    if (!entry.itemCode || !entry.qty || !entry.price) return;

    setRows([...rows, entry]);

    setEntry({
      itemCode: "",
      desc: "",
      qty: "",
      price: "",
      total: ""
    });
  };

  // SAVE (API CALL)
  const handleSave = async () => {

    if (!header.vendorCode) {
      alert("Vendor required");
      return;
    }

    if (rows.length === 0) {
      alert("No Items Added");
      return;
    }

    const payload = {
      header: header,
      details: rows
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/stock/save",
        payload
      );

      alert("Saved Successfully ✅");
      setRows([]);

    } catch (err) {
      console.error(err);
      alert("Save Failed ❌");
    }
  };

  const handleExit = () => {
  navigate("/StockPage");
};

  return (
    <div className="trans-container">

      <h2 className="trans-title">Stock Transaction</h2>

      {/* HEADER */}
      <div className="trans-header-box">

        <div className="trans-header-row">
          <label>Tran No</label>
          <input value={header.tranNo} readOnly className="trans-box" />
          <button className="trans-small-btn">...</button>

          <label>Vendor Code</label>
          <input
            className="trans-box"
            onChange={(e) =>
              setHeader({ ...header, vendorCode: e.target.value })
            }
          />
          <button className="trans-small-btn">...</button>
          <input
            className="trans-box trans-long"
            onChange={(e) =>
              setHeader({ ...header, vendorName: e.target.value })
            }
          />

          <label>GST TYPE</label>
          <input
            className="trans-box trans-small"
            onChange={(e) =>
              setHeader({ ...header, gstType: e.target.value })
            }
          />
        </div>

        <div className="trans-header-row">
          <label>TranDate</label>
          <input value="15" className="trans-small" />
          <span>-</span>
          <input value="04" className="trans-small" />
          <span>-</span>
          <input value="2026" className="trans-small" />
        </div>

        <div className="trans-header-row">
          <label>Tran Type</label>
          <input value={header.tranType} readOnly className="trans-box" />
        </div>

      </div>

      {/* TOOLBAR */}
      <div className="trans-toolbar">
        <button className="trans-add-top-btn" onClick={addRow}>+ Add</button>
        <button className="trans-save-top-btn" onClick={handleSave}>Save</button>

        <button className="trans-exit-btn" onClick={handleExit}>
        Exit
        </button>
      </div>

      {/* TABLE */}
      <div className="trans-grid-box">
        <table className="trans-table">

          <thead>
            <tr>
              <th>ItemCode</th>
              <th>Description</th>
              <th>Gst Type</th>
              <th>Uom</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Disc%</th>
              <th>Disc$</th>
              <th>Foc</th>
              <th>NetPrice</th>
              <th>Total</th>
              <th>Tax</th>
              <th>Gst Amt</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            <tr className="trans-entry-row">
              <td><input value={entry.itemCode} onChange={(e)=>handleChange("itemCode",e.target.value)} /></td>
              <td><input value={entry.desc} onChange={(e)=>handleChange("desc",e.target.value)} /></td>
              <td>Zero</td>
              <td>Nos</td>
              <td><input value={entry.qty} onChange={(e)=>handleChange("qty",e.target.value)} /></td>
              <td><input value={entry.price} onChange={(e)=>handleChange("price",e.target.value)} /></td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>{entry.total}</td>
              <td>0</td>
              <td>0</td>
              <td>
                <button className="trans-small-add" onClick={addRow}>+</button>
              </td>
            </tr>

            {rows.length === 0 ? (
              <tr>
                <td colSpan="14" align="center">No Data Added</td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr key={i}>
                  <td>{row.itemCode}</td>
                  <td>{row.desc}</td>
                  <td>Zero</td>
                  <td>Nos</td>
                  <td>{row.qty}</td>
                  <td>{row.price}</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>{row.total}</td>
                  <td>0</td>
                  <td>0</td>
                  <td></td>
                </tr>
              ))
            )}

          </tbody>

        </table>
      </div>

    </div>
  );
}