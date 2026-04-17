import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./DishGroup.css";

import { BASE_URL } from "../config/api";

function DishGroup() {

const [entries,setEntries] = useState([]);
const [showModal,setShowModal] = useState(false);
const [activeTab,setActiveTab] = useState("category");
const [filters, setFilters] = useState({});
const [activeFilter, setActiveFilter] = useState(null);

const [rowsPerPage, setRowsPerPage] = useState(10);
const [currentPage, setCurrentPage] = useState(1);

const [categoryList, setCategoryList] = useState([]);
const [showCategoryModal, setShowCategoryModal] = useState(false);

const [image,setImage] = useState(null);
const [displayName,setDisplayName] = useState(true);

const [bgColor,setBgColor] = useState("#2e7d32");
const [textColor,setTextColor] = useState("#ffffff");

const [modifiers,setModifiers] = useState([]);
const [selectedModifiers,setSelectedModifiers] = useState([]);

const [kitchens,setKitchens] = useState([]);
const [selectedKitchens,setSelectedKitchens] = useState([]);
const [loading, setLoading] = useState(false);

const fileInputRef = useRef(null);
const bgColorRef = useRef(null);
const textColorRef = useRef(null);
const [editingIndex,setEditingIndex] = useState(null);

const [form,setForm] = useState({
DishGroupId:"",
DishGroupCode:"",
DishGroupName:"",
ShortName:"",
SortCode:"",
KitchenSortCode:"",
CategoryId:"",
NameInOtherLanguage:"",
ShowModifierTabOrder:"No",
isActive:"No",
isDiscountAllowed:"No",
isTaxAllowed:"No",
isKitchenprint:"No",
isServiceCharge:"No",
isMemberSalesAllowed:"No"
});


// ✅ API GET
const fetchDishGroup = async () => {
try{
 setLoading(true); 
const res = await axios.get(`${BASE_URL}/dishgroup`);

setEntries(res.data);

}catch(err){

console.error("DishGroup load error:",err);

}finally {
    setLoading(false);  // 🔥 STOP
  }
};

// ✅ PAGE LOAD
useEffect(()=>{
fetchDishGroup();

// 🔥 Modifier list
axios.get(`${BASE_URL}/modifier`)
.then(res => setModifiers(res.data));

// 🔥 Kitchen list
axios.get(`${BASE_URL}/kitchen`)
.then(res => setKitchens(res.data));

axios.get(`${BASE_URL}/category`)
.then(res => setCategoryList(res.data));

},[filters]);
const handleChange=(e)=>{
const {name,type,checked,value}=e.target;

setForm({
...form,
[name]: type==="checkbox" ? (checked?"Yes":"No") : value
});
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.DishGroupCode || !form.DishGroupName) {
    alert("Please fill Dish Group Code and Dish Group Name");
    return;
  }

  try {
       setLoading(true); 
    const formData = new FormData();

    formData.append("DishGroupId", form.DishGroupId);
    formData.append("DishGroupCode", form.DishGroupCode);
    formData.append("DishGroupName", form.DishGroupName);
    formData.append("ShortName", form.ShortName);
    formData.append("SortCode", form.SortCode || 0);
    formData.append("KitchenSortCode", form.KitchenSortCode || 0);
    formData.append("CategoryId", form.CategoryId || "");
    formData.append("NameInOtherLanguage", form.NameInOtherLanguage);

   formData.append("isActive", form.isActive === "Yes" ? 1 : 0);
   formData.append("isDiscountAllowed", form.isDiscountAllowed === "Yes" ? 1 : 0);
   formData.append("isTaxAllowed", form.isTaxAllowed === "Yes" ? 1 : 0);
   formData.append("isKitchenPrint", form.isKitchenprint === "Yes" ? 1 : 0);
   formData.append("isServiceCharge", form.isServiceCharge === "Yes" ? 1 : 0);
   formData.append("isMemberSalesAllowed", form.isMemberSalesAllowed === "Yes" ? 1 : 0);

    formData.append("BackColor", bgColor);
    formData.append("ForeColor", textColor);

    // 🔥 IMAGE
    if (image && typeof image !== "string") {
      formData.append("image", image);
    }

    // 🔥 ARRAY
    formData.append("Modifiers", JSON.stringify(selectedModifiers));
    formData.append("KitchenTypes", JSON.stringify(
      kitchens.filter(k => selectedKitchens.includes(k.KitchenTypeCode))
    ));

    // 🔥 FINAL API CALL
    await axios.post(`${BASE_URL}/dishgroup`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    alert("Saved!");

    fetchDishGroup();
    setShowModal(false);

  } catch (err) {
    console.log(err);
    alert("Error");
  }finally {
    setLoading(false);  // 🔥 STOP LOADER
  }
};

  const handleEdit = (row) => {
  // const row = entries[index];

  setForm({
    DishGroupId: row.DishGroupId || "",  // ✅ MUST
    DishGroupCode: row.DishGroupCode || "",
    DishGroupName: row.DishGroupName || "",
    ShortName: row.ShortName || "",
    SortCode: row.SortCode || "",
    KitchenSortCode: row.KitchenSortCode || "",
    CategoryId: row.CategoryId || "",
    NameInOtherLanguage: row.NameInOtherLanguage || "",
   isActive: row.isActive == 1 || row.isActive === true ? "Yes" : "No",
   isDiscountAllowed: row.isDiscountAllowed == 1 || row.isDiscountAllowed === true ? "Yes" : "No",
   isTaxAllowed: row.isTaxAllowed == 1 || row.isTaxAllowed === true ? "Yes" : "No",
   isKitchenprint: row.isKitchenPrint == 1 || row.isKitchenPrint === true ? "Yes" : "No",
   isServiceCharge: row.isServiceCharge == 1 || row.isServiceCharge === true ? "Yes" : "No",
   isMemberSalesAllowed: row.isMemberSalesAllowed == 1 || row.isMemberSalesAllowed === true ? "Yes" : "No",
   ShowModifierTabOrder: row.ShowModifierTabOrder == 1 || row.ShowModifierTabOrder === true ? "Yes" : "No",
  });

 setImage(null); // clear first

if (row.ImageData) {
  setImage(row.ImageData);
}

  setBgColor(row.BackColor || "#2e7d32");
  setTextColor(row.ForeColor || "#ffffff");

  // 🔥 modifier selected load
      axios.get(`${BASE_URL}/dishgroupmodifier/${row.DishGroupId}`)
      .then(res => {
        setSelectedModifiers(res.data.map(x => x.ModifierId));
      });

      // 🔥 kitchen selected load
      axios.get(`${BASE_URL}/dishgroupkitchen/${row.DishGroupId}`)
      .then(res => {
        setSelectedKitchens(
        res.data.map(x => Number(x.KitchenTypeCode))
      );
      });

        // setEditingIndex(index);
        setEditingIndex(null);
        setShowModal(true);
      };

      const filteredData = entries.filter((row) => {
        return Object.keys(filters).every((key) => {
          if (!filters[key]) return true;

         let value = row[key] !== undefined && row[key] !== null ? row[key].toString() : "";

          // 🔥 FIX FOR YES/NO
          if (key === "isActive") {
            value = row.isActive ? "yes" : "no";
          }

          return String(value)
            .toLowerCase()
            .includes(filters[key].toLowerCase());
        });
      });

      const totalRows = filteredData.length;

      const totalPages =
        rowsPerPage === "ALL"
          ? 1
          : Math.ceil(totalRows / rowsPerPage);

      const startIndex =
        rowsPerPage === "ALL"
          ? 0
          : (currentPage - 1) * rowsPerPage;

      const endIndex =
        rowsPerPage === "ALL"
          ? totalRows
          : startIndex + rowsPerPage;

      const paginatedData =
        rowsPerPage === "ALL"
          ? filteredData
          : filteredData.slice(startIndex, endIndex);

          const showingFrom = totalRows === 0 ? 0 : startIndex + 1;

  const showingTo =
  rowsPerPage === "ALL"
    ? totalRows
    : Math.min(startIndex + rowsPerPage, totalRows);

      return(

      <div className="dg-page">

      <div className="dg-header">

  <h1 className="dg-title">Dish Group</h1>

  <div className="dg-header-right">

    <button
      className="dg-new-btn"
     onClick={async () => {

  try {
    const res = await axios.get(`${BASE_URL}/dishgroup/nextcode`);

    setForm({
      DishGroupId:"",
      DishGroupCode: res.data.code, // 🔥 AUTO NUMBER
      DishGroupName:"",
      ShortName:"",
      SortCode:"",
      KitchenSortCode:"",
      CategoryId:"",
      NameInOtherLanguage:"",
      ShowModifierTabOrder:"No",
      isActive:"No",
      isDiscountAllowed:"No",
      isTaxAllowed:"No",
      isKitchenprint:"No",
      isServiceCharge:"No",
      isMemberSalesAllowed:"No"
    });

    setEditingIndex(null);
    setShowModal(true);

  } catch (err) {
    console.log("CODE LOAD ERROR", err);
  }

}}
    >
      New
    </button>

    <select
      className="dg-dropdown"
      value={rowsPerPage}
      onChange={(e) => {
        const value = e.target.value;
        setRowsPerPage(value === "ALL" ? "ALL" : Number(value));
        setCurrentPage(1);
      }}
    >
      <option value={10}>10</option>
      <option value={20}>20</option>
      <option value={30}>30</option>
      <option value={40}>40</option>
      <option value={50}>50</option>
      <option value="ALL">ALL</option>
    </select>

  </div>

</div>

      {showCategoryModal && (
        <div className="popup">
          <div className="popup-box">

            <h2>Select Category</h2>

            {categoryList.map(c => (
              <div
                key={c.CategoryId}
                className="popup-item"
                onClick={() => {
                  setForm({
                    ...form,
                    CategoryId: c.CategoryId
                  });
                  setShowCategoryModal(false);
                }}
              >
                {c.CategoryName}
              </div>
            ))}

            <button onClick={() => setShowCategoryModal(false)}>
              Close
            </button>

          </div>
        </div>
      )}

      {showModal && (

      <div className="dg-modal-overlay">


      <div className="dg-modal">

      <h2>Add Dish Group</h2>

      <form onSubmit={handleSubmit}>

      <div className="dg-layout">

      {/* LEFT PANEL */}

      <div className="dg-left">

      <div className="dg-input-grid">

      <div className="dg-field">
      <label>Dish Group Code</label>
      <input
        type="text"
        name="DishGroupCode"
        value={form.DishGroupCode}
        disabled
      />
      </div>

      <div className="dg-field">
      <label>Dish Group Name</label>
      <input
      type="text"
      name="DishGroupName"
      value={form.DishGroupName}
      onChange={handleChange}
      />
      </div>

      <div className="dg-field">
      <label>Short Name</label>
      <input
      type="text"
      name="ShortName"
      value={form.ShortName}
      onChange={handleChange}
      />
      </div>

      <div className="dg-field">
      <label>Sort Code</label>
      <input
      type="number"
      name="SortCode"
      placeholder="Sort Code"
      value={form.SortCode}
      onChange={handleChange}
      />
      </div>

      <div className="dg-field">
      <label>Kitchen Sort Code</label>
      <input
      type="number"
      name="KitchenSortCode"
      placeholder="Kitchen Sort Code"
      value={form.KitchenSortCode}
      onChange={handleChange}
      />
      </div>

      <div className="dg-category-row">
      <div className="dg-field">
      <label>Category</label>
      <input
      type="text"
      name="CategoryId"
      placeholder="Category"
      value={
          categoryList.find(c => c.CategoryId === form.CategoryId)?.CategoryName || ""
        }
        readOnly
      />
      </div>

      <button
      type="button"
      onClick={async () => {
        const res = await axios.get(`${BASE_URL}/category`);
        setCategoryList(res.data);
        setShowCategoryModal(true);
      }}
      >
      ...
      </button>

</div>

<div className="dg-category-row">
<div className="dg-field"></div>
<label>Other Language</label>
<input
type="text"
name="NameInOtherLanguage"
placeholder="Other Language"
value={form.NameInOtherLanguage}
onChange={handleChange}
/>
</div>

</div>

<div className="dg-checkbox-grid">

<label>
<input
type="checkbox"
name="isActive"
checked={form.isActive==="Yes"}
onChange={handleChange}
/>
Active
</label>

<label>
<input
type="checkbox"
name="isDiscountAllowed"
checked={form.isDiscountAllowed==="Yes"}
onChange={handleChange}
/>
Discount Allowed
</label>

<label>
<input
type="checkbox"
name="isTaxAllowed"
checked={form.isTaxAllowed==="Yes"}
onChange={handleChange}
/>
Tax Allowed
</label>

<label>
<input
type="checkbox"
name="isKitchenprint"
checked={form.isKitchenprint==="Yes"}
onChange={handleChange}
/>
Kitchen Print
</label>

<label>
<input
type="checkbox"
name="isServiceCharge"
checked={form.isServiceCharge==="Yes"}
onChange={handleChange}
/>
Service Charge Allowed
</label>

<label>
<input
type="checkbox"
name="isMemberSalesAllowed"
checked={form.isMemberSalesAllowed==="Yes"}
onChange={handleChange}
/>
Member Sales Allowed
</label>

<label>

<input
type="checkbox"
name="ShowModifierTabOrder"
checked={form.ShowModifierTabOrder==="Yes"}
onChange={handleChange}
/>

Show Modifier Tab Order

</label>

</div>

</div>

{/* RIGHT PANEL */}

<div className="dg-right">

<div className="dg-tab-header">

<div
className={activeTab==="category"?"dg-tab dg-active":"dg-tab"}
onClick={()=>setActiveTab("category")}
>
Customize
</div>

<div
className={activeTab==="modifier"?"dg-tab dg-active":"dg-tab"}
onClick={()=>setActiveTab("modifier")}
>
Modifier
</div>

<div
className={activeTab==="kitchen"?"dg-tab dg-active":"dg-tab"}
onClick={()=>setActiveTab("kitchen")}
>
Kitchen Setup
</div>

</div>

{activeTab==="category" && (

<div className="dg-top-row">

<div className="dg-image">

<h4>Dish Group Image</h4>

<div className="dg-image-box">
  {image && (
    <img
      src={
        typeof image === "string"
          ? image
          : URL.createObjectURL(image)
      }
      alt="preview"
    />
  )}
</div>

<div className="dg-image-btn">

<button
type="button"
onClick={()=>fileInputRef.current.click()}
>
SCAN
</button>

<button
type="button"
onClick={()=>setImage(null)}
>
Clear
</button>

</div>

<input
  type="file"
  accept="image/*"
  ref={fileInputRef}
  style={{display:"none"}}
  onChange={(e) => {
  const file = e.target.files[0];
  if (!file) return;

  setImage(file); // ✅
}}
/>

</div>

<div className="dg-preview">

<h4>Preview</h4>

<div className="dg-preview-box">

  {/* 🔥 IMAGE */}
 {image && (
  <img
    src={
      typeof image === "string"
        ? image
        : URL.createObjectURL(image)
    }
    alt="preview"
    className="dg-preview-img"
  />
)}

  {/* 🔥 TEXT */}
  {displayName && (
    <div
      className="dg-preview-text"
      style={{ background: bgColor, color: textColor }}
    >
      {form.DishGroupName || "SOUP"}
    </div>
  )}

</div>

<label>

<input
type="checkbox"
checked={displayName}
onChange={(e)=>setDisplayName(e.target.checked)}
/>

Display Name

</label>

<button className="dg-apply">
Apply To All
</button>

</div>

<div className="dg-button-color">

<h4>Button Color</h4>

<div
className="dg-button-preview"
style={{background:bgColor,color:textColor}}
>
{form.DishGroupName || "SOUP"}
</div>

<div className="dg-color-btn">

<button
type="button"
onClick={()=>bgColorRef.current.showPicker()}
>
Color
</button>

<button
type="button"
onClick={()=>textColorRef.current.showPicker()}
>
Text Color
</button>

<input
type="color"
ref={bgColorRef}
value={bgColor}
onChange={(e)=>setBgColor(e.target.value)}
className="dg-hidden"
/>

<input
type="color"
ref={textColorRef}
value={textColor}
onChange={(e)=>setTextColor(e.target.value)}
className="dg-hidden"
/>

</div>

</div>

</div>

)}

{activeTab==="modifier" && (

<div className="modifier-grid">

{modifiers.map((m)=>(
<label key={m.ModifierId}>
<input
type="checkbox"
checked={selectedModifiers.includes(m.ModifierId)}
onChange={(e)=>{

if(e.target.checked){
         setSelectedModifiers([...selectedModifiers,m.ModifierId]);
   }else{
     setSelectedModifiers(selectedModifiers.filter(id=>id!==m.ModifierId));
  }

   }}
/>
{m.ModifierName}
</label>
))}

</div>

)}

{activeTab==="kitchen" && (

<div className="kitchen-container">

{kitchens.map((k)=>(

<label key={k.KitchenTypeCode} className="kitchen-list1">

<input
type="checkbox"
checked={selectedKitchens.includes(k.KitchenTypeCode)}
onChange={(e)=>{

if(!form.DishGroupId){
alert("Save DishGroup first");
return;
}

if(e.target.checked){
setSelectedKitchens([...selectedKitchens,k.KitchenTypeCode]);
}else{
setSelectedKitchens(selectedKitchens.filter(id=>id!==k.KitchenTypeCode));
}

}}
/>

<span>{k.KitchenTypeName}</span>

</label>

))}

</div>

)}

</div>

</div>

<div className="dg-modal-buttons">

<button type="submit" className="dg-save">
Save
</button>

<button
type="button"
className="dg-cancel"
onClick={()=>setShowModal(false)}
>
Cancel
</button>

</div>

</form>

{showCategoryModal && (
  <div className="popup">
    <div className="popup-box">

      <h3>Select Category</h3>

      {categoryList.map(c => (
        <div
          key={c.CategoryId}
          onClick={() => {
            setForm({
              ...form,
              CategoryId: c.CategoryId,
              CategoryName: c.CategoryName
            });
            setShowCategoryModal(false);
          }}
          style={{ cursor: "pointer", padding: "5px" }}
        >
          {c.CategoryName}
        </div>
      ))}

      <button onClick={() => setShowCategoryModal(false)}>Close</button>

    </div>
  </div>
)}
</div>

</div>

)}

<div className="dg-table-wrapper">

<table className="dg-table">

<thead>
<tr>
<th>S.No</th>
<th onClick={() => setActiveFilter("DishGroupCode")}>
  DishGroupCode
  {activeFilter === "DishGroupCode" && (
    <input
      onClick={(e)=>e.stopPropagation()}
      type="text"
      value={filters.DishGroupCode || ""}
      onChange={(e)=>{
       setFilters({...filters, DishGroupCode: e.target.value});
      setCurrentPage(1); // ✅ add this
   }}
    />
  )}
</th>
<th onClick={() => setActiveFilter("DishGroupName")}>
  DishGroupName
  {activeFilter === "DishGroupName" && (
    <input
      onClick={(e)=>e.stopPropagation()}
      type="text"
      value={filters.DishGroupName || ""}
      onChange={(e)=>
        setFilters({...filters, DishGroupName: e.target.value})
      }
    />
  )}
</th>
<th onClick={() => setActiveFilter("isActive")}>
  Active
  {activeFilter === "isActive" && (
    <input
      onClick={(e)=>e.stopPropagation()}
      type="text"
      placeholder="Yes/No"
      value={filters.isActive || ""}
      onChange={(e)=>
        setFilters({...filters, isActive: e.target.value})
      }
    />
  )}
</th>
<th>KitchenPrint</th>
<th>Discount</th>
<th>SortCode</th>
<th>KitchenSortCode</th>
</tr>
</thead>

<tbody>

{loading ? (
  <tr>
    <td colSpan="8">
      <div className="spinner"></div>
    </td>
  </tr>

) : entries.length === 0 ? (

  <tr>
    <td colSpan="8">No Data Found</td>
  </tr>

) : (paginatedData.map((row,index)=>(//(entries.map((row,index)=>(

<tr key={index} onClick={() => handleEdit(row)} style={{cursor:"pointer"}}>

<td>{index+1}</td>
<td>{row.DishGroupCode}</td>
<td>{row.DishGroupName}</td>

<td>{row.isActive ? "Yes" : "No"}</td>
<td>{row.isKitchenPrint ? "Yes" : "No"}</td>
<td>{row.isDiscountAllowed ? "Yes" : "No"}</td>

<td>{row.SortCode}</td>
<td>{row.KitchenSortCode}</td>

</tr>

)))}

</tbody>

</table>

</div>

<div style={{ marginTop: "10px", display: "flex", gap: "10px", alignItems: "center" }}>

  <button
    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
    disabled={currentPage === 1}
  >
    Prev
  </button>

  <span>
    page {showingFrom}–{showingTo} of {totalRows}
  </span>

  <button
    onClick={() =>
      setCurrentPage((p) => Math.min(p + 1, totalPages))
    }
    disabled={currentPage === totalPages}
  >
    Next
  </button>

</div>

</div>

);

}

export default DishGroup;