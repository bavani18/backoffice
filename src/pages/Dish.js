import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./Dish.css";

import { BASE_URL } from "../config/api";


 function Dish() {
 
  const emptyDish = {
    DishId: "",
    DishCode: "",
    Name: "",
    ShortName: "",
    Description: "",
    DishGroupId: "",
    CurrentCost: "",
    SordCode: "",
    UnitCost: "",
    QuantityOnHand: "",
    NameInOtherLanguage: "",
    BrandId: "",
    MobileTab: "",
    AvailableTimeFrom: "",
    AvailableTimeTo: "",
    isMultiPrice: false,
    isOpenitem: false,
    IsShowinKiosk: false,
    IsActive: false,
    iskitchenPrint: false,
    isDiscountAllowed: false,
    IsTaxAllowed: false,
    IsStockDish: false,
    isFOC: false,
    isServiceCharge: false,
    isFavourite: false,
    KitchenType: "General",
    SubkitchenType: "",
  };
 
  const fetchDish = async () => {
  try{
  setLoading(true);  // 🔥 START LOADER
  const res = await axios.get(`${BASE_URL}/dish`);
 
  setEntries(res.data);
  
  }catch(err){
  
  console.error("DishGroup load error:",err);
  
  }finally {
    setLoading(false);  // 🔥 STOP LOADER
  }
  };

  // ✅ PAGE LOAD
 useEffect(()=>{
  fetchDish();

  axios.get(`${BASE_URL}/modifier`)
    .then(res => setdishModifiers(res.data));

  axios.get(`${BASE_URL}/kitchen`)
    .then(res => setdishKitchens(res.data));

     axios.get(`${BASE_URL}/dishgroup`)
  .then(res => {
    console.log("DISH GROUP DATA 👉", res.data); // ✅ CHECK HERE
    setDishGroups(res.data);
  })
  .catch(err => console.error("DishGroup error:", err));

 },[]);

  const [entries,setEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("customize");
  const [dish, setDish] = useState(emptyDish);
  const [dishes, setDishes] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [categoryImage, setCategoryImage] = useState(null);
  const [buttonColor, setButtonColor] = useState("#2e7d32");
  const [textColor, setTextColor] = useState("#fff");
  const [displayName, setDisplayName] = useState(true);
  const [existingImage, setExistingImage] = useState(null);
  const [dishGroups, setDishGroups] = useState([]);

  const [dishmodifier, setdishModifiers] = useState([]);
  const [dishkitchens, setdishKitchens] = useState([]);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [selecteddishModifiers, setSelecteddishModifiers] = useState([]);
  const [selecteddishKitchens, setSelecteddishKitchens] = useState([]);
 
  const colorPickerRef = useRef(null);
  const textColorPickerRef = useRef(null);

  const [filters, setFilters] = useState({});
  const [activeFilter, setActiveFilter] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
  const { name, value, type, checked } = e.target;
 
    setDish({
      ...dish,
      [name]: type === "checkbox" ? checked : value
    });
  };
 
  const handleImageUpload = (e) => {
  const file = e.target.files[0];
 
    if (file) {
      const url = URL.createObjectURL(file);
      setCategoryImage(file);   
    }
  };
 
  const clearImage = () => {
    setCategoryImage(null);
    
  };
 
  /* ❌ Apply All disabled */
  const applyAll = () => {};
 
  const handleSave = async () => {
  try {
     setLoading(true);
      console.log("SAVE CLICKED");

      console.log("KITCHEN SEND 👉", selecteddishKitchens);

    // 🔥 create FormData
    const formData = new FormData();

    // 🔥 append all fields
    Object.keys(dish).forEach((key) => {
  if (dish[key] !== null && dish[key] !== "") {
    formData.append(key, dish[key]);
  }
});

    // 🔥 number fix
    formData.set("CurrentCost", Number(dish.CurrentCost) || 0);
    formData.set("UnitCost", Number(dish.UnitCost) || 0);
    formData.set("QuantityOnHand", Number(dish.QuantityOnHand) || 0);
    formData.set("SordCode", Number(dish.SordCode) || 0);
    formData.append("KitchenType", "General");       
    formData.append("SubkitchenType", ""); 
    
     const selectedKitchens = selecteddishKitchens.map(code => {
  const k = dishkitchens.find(x => Number(x.KitchenTypeCode) === code);

  return {
    KitchenTypeCode: code,
    KitchenTypeName: k?.KitchenTypeName || ""
  };
});

formData.set(
  "KitchenTypes",
  JSON.stringify(selectedKitchens)
);

      formData.append(
      "Modifiers",
      JSON.stringify(selecteddishModifiers || [])
    );

    // 🔥 image file
    if (categoryImage) {
      formData.append("image", categoryImage);
    }

    console.log("FORM DATA READY ✅");
   if (editIndex !== null && dish.DishId) {
  await axios.put(
    `${BASE_URL}/dish/${dish.DishId}`,
    formData,   // ✅ IMPORTANT
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  alert("Updated ✅");

} else {
  await axios.post(
    `${BASE_URL}/dish`,
    formData,   // ✅ IMPORTANT
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  alert("Inserted ✅");
}

    fetchDish();            // 🔥 reload table
    setShowModal(false);
    setDish(emptyDish);
    setEditIndex(null);

  } catch (err) {
    console.log("SAVE ERROR ❌", err.response?.data || err.message);
  }finally {
    setLoading(false);  // 🔥 ADD THIS
  }
};
 
  const handleCancel = () => {
    setShowModal(false);
    setEditIndex(null);
  };
 
  const openNewDish = () => {
    setDish(emptyDish);
    setSelecteddishKitchens([]);   // 🔥 ADD THIS
    setSelecteddishModifiers([]);  // 🔥 ADD THIS
    setEditIndex(null);
    setShowModal(true);
  };

  
      const getGroupName = (id) => {
      const group = dishGroups.find(g => g.DishGroupId === id);
       return group ? group.DishGroupName : id; 
    };
 
const handleEdit = async (data) => {

  setDish(data);

  const kRes = await axios.get(`${BASE_URL}/dishkitchen/${data.DishId}`);
  const kIds = kRes.data.map(x => Number(x.KitchenTypeCode));

  const mRes = await axios.get(`${BASE_URL}/dishmodifier/${data.DishId}`);
  const mIds = mRes.data.map(x => String(x.ModifierId));

  setSelecteddishKitchens(kIds);
  setSelecteddishModifiers(mIds);

  setShowModal(true);
};

const filteredData = entries.filter((row) => {
  return Object.keys(filters).every((key) => {
    if (!filters[key]) return true;

    let value = row[key];

    // ✅ GROUP NAME FIX
if (key === "DishGroupId") {
  value = getGroupName(row.DishGroupId);
}

    // ✅ NULL FIX
    if (value === null || value === undefined) {
      value = "";
    }

    // ✅ BOOLEAN → YES/NO FIX (ALL FIELDS)
    if (typeof value === "boolean") {
      value = value ? "yes" : "no";
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
 
  return (
    <div className="dish-page1">

    <div className="dish-header">
  <h1>Dish Master</h1>

  <div className="dish-header-right">
    
    <button className="dish-new-btn1" onClick={openNewDish}>
      New
    </button>

    <select
      value={rowsPerPage}
      onChange={(e) => {
        const value = e.target.value === "ALL" ? "ALL" : Number(e.target.value);
        setRowsPerPage(value);
        setCurrentPage(1);
      }}
      className="rows-dropdown"
    >
      <option value={10}>10</option>
      <option value={20}>20</option>
      <option value={30}>30</option>
      <option value={50}>50</option>
      <option value="ALL">All</option>
    </select>

  </div>
</div>
      
 
      <div className="dish-report-section1">
        <table className="dish-report-table1">
 
          <thead>
            <tr>
            <th onClick={() => setActiveFilter("DishCode")}>
              Dish Code
              
               {activeFilter === "DishCode" && (
                <input
                  onClick={(e) => e.stopPropagation()}
                  type="text"
                  value={filters.DishCode || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, DishCode: e.target.value })
                  }
                />
              )}
            </th>
             <th onClick={() => setActiveFilter("Name")}>
              Name
              
               {activeFilter === "Name" && (
                <input
                  onClick={(e) => e.stopPropagation()}
                  type="text"
                  value={filters.Name || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, Name: e.target.value })
                  }
                />
              )}
            </th>
               <th onClick={() => setActiveFilter("ShortName")}>
              Short Name
              
               {activeFilter === "ShortName" && (
                <input
                  onClick={(e) => e.stopPropagation()}
                  type="text"
                  value={filters.ShortName || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, ShortName: e.target.value })
                  }
                />
              )}
            </th>
            {/* Description */}
            <th onClick={() => setActiveFilter("Description")}>
              Description
              {activeFilter === "Description" && (
                <input
                  onClick={(e) => e.stopPropagation()}
                  value={filters.Description || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, Description: e.target.value })
                  }
                />
              )}
            </th>

            {/* Group */}
            <th onClick={() => setActiveFilter("DishGroupId")}>
              Group
              {activeFilter === "DishGroupId" && (
                <input
                  onClick={(e) => e.stopPropagation()}
                  value={filters.DishGroupId || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, DishGroupId: e.target.value })
                  }
                />
              )}
            </th>

            {/* Price */}
            <th onClick={() => setActiveFilter("CurrentCost")}>
              Price
              {activeFilter === "CurrentCost" && (
                <input
                  onClick={(e) => e.stopPropagation()}
                  value={filters.CurrentCost || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, CurrentCost: e.target.value })
                  }
                />
              )}
            </th>

            {/* Sort Code */}
            <th onClick={() => setActiveFilter("SordCode")}>
              Sort Code
              {activeFilter === "SordCode" && (
                <input
                  onClick={(e) => e.stopPropagation()}
                  value={filters.SordCode || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, SordCode: e.target.value })
                  }
                />
              )}
            </th>

            {/* Unit Cost */}
            <th onClick={() => setActiveFilter("UnitCost")}>
              Unit Cost
              {activeFilter === "UnitCost" && (
                <input
                  onClick={(e) => e.stopPropagation()}
                  value={filters.UnitCost || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, UnitCost: e.target.value })
                  }
                />
              )}
            </th>

            {/* Qty */}
            <th onClick={() => setActiveFilter("QuantityOnHand")}>
              Qty
              {activeFilter === "QuantityOnHand" && (
                <input
                  onClick={(e) => e.stopPropagation()}
                  value={filters.QuantityOnHand || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, QuantityOnHand: e.target.value })
                  }
                />
              )}
            </th>

            {/* Active */}
            <th onClick={() => setActiveFilter("IsActive")}>
              Active
              {activeFilter === "IsActive" && (
                <input
                  placeholder="yes / no"
                  onClick={(e) => e.stopPropagation()}
                  value={filters.IsActive || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, IsActive: e.target.value })
                  }
                />
              )}
            </th>

            {/* Kitchen */}
            <th onClick={() => setActiveFilter("iskitchenPrint")}>
              Kitchen
              {activeFilter === "iskitchenPrint" && (
                <input
                  placeholder="yes / no"
                  onClick={(e) => e.stopPropagation()}
                  value={filters.iskitchenPrint || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, iskitchenPrint: e.target.value })
                  }
                />
              )}
            </th>

            {/* Discount */}
            <th onClick={() => setActiveFilter("isDiscountAllowed")}>
              Discount
              {activeFilter === "isDiscountAllowed" && (
                <input
                  placeholder="yes / no"
                  onClick={(e) => e.stopPropagation()}
                  value={filters.isDiscountAllowed || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, isDiscountAllowed: e.target.value })
                  }
                />
              )}
            </th>

            {/* Tax */}
            <th onClick={() => setActiveFilter("IsTaxAllowed")}>
              Tax
              {activeFilter === "IsTaxAllowed" && (
                <input
                  placeholder="yes / no"
                  onClick={(e) => e.stopPropagation()}
                  value={filters.IsTaxAllowed || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, IsTaxAllowed: e.target.value })
                  }
                />
              )}
            </th>

            {/* Stock */}
            <th onClick={() => setActiveFilter("IsStockDish")}>
              Stock
              {activeFilter === "IsStockDish" && (
                <input
                  placeholder="yes / no"
                  onClick={(e) => e.stopPropagation()}
                  value={filters.IsStockDish || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, IsStockDish: e.target.value })
                  }
                />
              )}
            </th>

            {/* FOC */}
            <th onClick={() => setActiveFilter("isFOC")}>
              FOC
              {activeFilter === "isFOC" && (
                <input
                  placeholder="yes / no"
                  onClick={(e) => e.stopPropagation()}
                  value={filters.isFOC || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, isFOC: e.target.value })
                  }
                />
              )}
            </th>

            {/* Service */}
            <th onClick={() => setActiveFilter("isServiceCharge")}>
              Service
              {activeFilter === "isServiceCharge" && (
                <input
                  placeholder="yes / no"
                  onClick={(e) => e.stopPropagation()}
                  value={filters.isServiceCharge || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, isServiceCharge: e.target.value })
                  }
                />
              )}
            </th>

            {/* Favourite */}
            <th onClick={() => setActiveFilter("isFavourite")}>
              Favourite
              {activeFilter === "isFavourite" && (
                <input
                  placeholder="yes / no"
                  onClick={(e) => e.stopPropagation()}
                  value={filters.isFavourite || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, isFavourite: e.target.value })
                  }
                />
              )}
            </th>

          </tr>
          </thead>
 
          <tbody>

            {loading ? (
              <tr>
                <td colSpan="17">
                  <div className="spinner"></div>
                </td>
              </tr>

            ) : entries.length === 0 ? (

              <tr>
                <td colSpan="17">No Data Found</td>
              </tr>

            ) : (

              paginatedData.map((d, i) => (
                <tr
                  key={i}
                  onClick={() => handleEdit(d)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{d.DishCode}</td>
                  <td>{d.Name}</td>
                  <td>{d.ShortName}</td>
                  <td>{d.Description}</td>
                 <td>{getGroupName(d.DishGroupId)}</td>
                  <td>{d.CurrentCost}</td>
                  <td>{d.SordCode}</td>
                  <td>{d.UnitCost}</td>
                  <td>{d.QuantityOnHand}</td>
                  <td>{d.IsActive ? "Yes" : "No"}</td>
                  <td>{d.iskitchenPrint ? "Yes" : "No"}</td>
                  <td>{d.isDiscountAllowed ? "Yes" : "No"}</td>
                  <td>{d.IsTaxAllowed ? "Yes" : "No"}</td>
                  <td>{d.IsStockDish ? "Yes" : "No"}</td>
                  <td>{d.isFOC ? "Yes" : "No"}</td>
                  <td>{d.isServiceCharge ? "Yes" : "No"}</td>
                  <td>{d.isFavourite ? "Yes" : "No"}</td>
                </tr>
              ))
            )}
          </tbody>
 
        </table>
      </div>
 
      {showModal && (
        <div className="dish-modal-overlay">
 
          <div className="dish-modal-box1">

            <div className="dish-modal-header1">

  <h2>Dish</h2>

  <div className="dish-header-buttons">
    <button className="dish-save-btn1" onClick={handleSave}>
      Save
    </button>

    <button className="dish-cancel-btn2" onClick={handleCancel}>
      Cancel
    </button>
  </div>

</div>
 
            <div className="dish-layout1">
 
              {/* LEFT SIDE */}
              <div className="dish-left1">
 
                <div className="dish-form-row1">
                  <label>DishCode</label>
                  <input name="DishCode" value={dish.DishCode} onChange={handleChange} />
                </div>
 
                <div className="dish-form-row1">
                  <label>Name</label>
                  <input name="Name" value={dish.Name} onChange={handleChange} />
                </div>
 
                <div className="dish-form-row1">
                  <label>ShortName</label>
                  <input name="ShortName" value={dish.ShortName} onChange={handleChange} />
                </div>
 
                <div className="dish-form-row1">
                  <label>Description</label>
                  <textarea name="Description" value={dish.Description} onChange={handleChange} />
                </div>
 
                <div className="dish-form-row1">
                  <label>Dish Group</label>
                 <select
                    name="DishGroupId"
                    value={dish.DishGroupId}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Dish Group --</option>

                    {dishGroups.map((g) => (
                      <option key={g.DishGroupId} value={g.DishGroupId}>
                        {g.DishGroupName}
                      </option>
                    ))}
                  </select>
                </div>
 
                {/* PRICE ROW */}
                <div className="dish-row-31">
 
                  <div>
                    <label>CurrentCost</label>
                    <input name="CurrentCost" value={dish.CurrentCost} onChange={handleChange} />
                  </div>
 
                  <div>
                    <label>SordCode</label>
                    <input name="SordCode" value={dish.SordCode} onChange={handleChange} />
                  </div>
 
                  <div>
                    <label>UnitCost</label>
                    <input name="UnitCost" value={dish.UnitCost} onChange={handleChange} />
                  </div>
 
                </div>
 
                {/* SECOND ROW */}
                <div className="dish-row-31">
 
                  <div>
                    <label>QuantityOnHand</label>
                    <input name="QuantityOnHand" value={dish.QuantityOnHand} onChange={handleChange} />
                  </div>
 
                  <div>
                    <label>NameInOtherLanguage</label>
                    <input name="NameInOtherLanguage" value={dish.NameInOtherLanguage} onChange={handleChange} />
                  </div>
 
                  <div className="dish-active-box1">
                    <label>
                      <input type="checkbox" name="IsActive" checked={dish.IsActive} onChange={handleChange} />
                      Active
                    </label>
                  </div>
 
                </div>
 
                {/* CHECKBOX GRID */}
                <div className="dish-check-grid1">
                  <label><input type="checkbox" name="iskitchenPrint" checked={dish.iskitchenPrint} onChange={handleChange} /> iskitchenPrint</label>
                  <label><input type="checkbox" name="isDiscountAllowed" checked={dish.isDiscountAllowed} onChange={handleChange} /> isDiscountAllowed</label>
                  <label><input type="checkbox" name="IsTaxAllowed" checked={dish.IsTaxAllowed} onChange={handleChange} /> IsTaxAllowed</label>
                  <label><input type="checkbox" name="IsStockDish" checked={dish.IsStockDish} onChange={handleChange} /> IsStockDish</label>
                  <label><input type="checkbox" name="isFOC" checked={dish.isFOC} onChange={handleChange} /> isFOC</label>
                  <label><input type="checkbox" name="isServiceCharge" checked={dish.isServiceCharge} onChange={handleChange} /> isServiceCharge</label>
                  <label><input type="checkbox" name="isFavourite" checked={dish.isFavourite} onChange={handleChange} /> isFavourite</label>
                  <label><input type="checkbox" name="isMultiPrice" checked={dish.isMultiPrice} onChange={handleChange} /> isMultiPrice</label>
                  <label><input type="checkbox" name="isOpenitem" checked={dish.isOpenitem} onChange={handleChange} /> isOpenitem</label>
                </div>
 
              </div>
 
              {/* RIGHT SIDE */}
              <div className="dish-right1">
 
                <div className="dish-tabs">
                  <button className={activeTab === "customize" ? "active-tab" : ""} onClick={() => setActiveTab("customize")}>Category</button>
                  <button className={activeTab === "modifier" ? "active-tab" : ""} onClick={() => setActiveTab("modifier")}>Modifier</button>
                  <button className={activeTab === "kitchen" ? "active-tab" : ""} onClick={() => setActiveTab("kitchen")}>Kitchen</button>
                </div>
 
                {activeTab === "customize" && (
                  <div className="dish-customize-layout">
 
                    <div className="dish-customize-col1">
                      <h4>Category Image</h4>
 
                      <div className="dish-image-box1">
                        {categoryImage ? (
                             <img
                             src={URL.createObjectURL(categoryImage)}
                                 style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                  />
                                ) : existingImage ? (
                                 <img
                                    src={existingImage}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                              ) : null}
                      </div>
 
                      <div className="dish-img-btns1">
                        <label className="dish-blue-btn1">
                          Scan
                          <input type="file" hidden onChange={handleImageUpload} />
                        </label>
 
                        <button className="dish-blue-btn1" onClick={clearImage}>Clear</button>
                      </div>
                    </div>
 
                    <div className="dish-customize-col1">
                      <h4>Preview</h4>
 
                      <div
                        className="dish-preview-box1"
                        style={{
                          backgroundColor: buttonColor,
                          color: textColor,
                          position: "relative",
                          overflow: "hidden"
                        }}
                      >
                        {categoryImage ? (
                       <>
                     <img
                       src={URL.createObjectURL(categoryImage)}
                       style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                     {displayName && (
                    <div className="dish-preview-text1">
                    {dish.Name || "DRINKS"}
                   </div>
                )}
                </>
             ) : existingImage ? (
            <>
          <img
        src={existingImage}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    {displayName && (
      <div className="dish-preview-text1">
        {dish.Name || "DRINKS"}
      </div>
    )}
  </>
) : (
  <div className="dish-preview-text1">
    {dish.Name || "DRINKS"}
  </div>
)}
                      </div>
 
                      <label className="dish-display-check1">
                        <input type="checkbox" checked={displayName} onChange={(e) => setDisplayName(e.target.checked)} />
                        Display Name
                      </label>
 
                      <button className="dish-apply-btn1" onClick={applyAll}>Apply All</button>
                    </div>
 
                    <div className="dish-customize-col1">
                      <h4>Button Color</h4>
 
                      <div className="dish-button-preview1">
                        {dish.Name || "DRINKS"}
                      </div>
 
                      <div className="dish-color-btns1">
                        <button className="dish-blue-btn1" onClick={() => colorPickerRef.current.click()}>Color</button>
 
                        <input
                          type="color"
                          ref={colorPickerRef}
                          style={{ display: "none" }}
                          value={buttonColor}
                          onChange={(e) => setButtonColor(e.target.value)}
                        />
 
                        <button className="dish-blue-btn1" onClick={() => textColorPickerRef.current.click()}>Text Color</button>
 
                        <input
                          type="color"
                          ref={textColorPickerRef}
                          style={{ display: "none" }}
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                        />
                      </div>
 
                    </div>
 
                  </div>
                )}

               {/* MODIFIER TAB */}
        {activeTab === "modifier" && (
          <div>

            <input
              type="text"
              placeholder="Search Modifier..."
              className="dish-modifier-search"
            />

            <div className="dish-modifier-container">
            {dishmodifier.map((mod) => (
          <label key={mod.ModifierId} className="dish-modifier-item">

            <input
            type="checkbox"
            checked={selecteddishModifiers.includes(String(mod.ModifierId))}
            onChange={(e) => {
              const value = String(mod.ModifierId);

              if (e.target.checked) {
                setSelecteddishModifiers((prev) =>
                  prev.includes(value) ? prev : [...prev, value]
                );
              } else {
                setSelecteddishModifiers((prev) =>
                  prev.filter((id) => id !== value)
                );
              }
            }}
          />

            {mod.ModifierName}

          </label>
        ))}
    </div>

  </div>
)}

{/* KITCHEN TAB */}
{activeTab === "kitchen" && (
  <div className="dish-kitchen-container">

   {dishkitchens.map((k) => (
  <label key={k.KitchenTypeCode}>
    <input
      type="checkbox"
      checked={selecteddishKitchens.includes(Number(k.KitchenTypeCode))}
      onChange={(e) => {
        const value = Number(k.KitchenTypeCode);

        if (e.target.checked) {
          setSelecteddishKitchens((prev) =>
            prev.includes(value) ? prev : [...prev, value]
          );
        } else {
          setSelecteddishKitchens((prev) =>
            prev.filter((id) => id !== value)
          );
        }
      }}
    />
    {k.KitchenTypeName}
  </label>
))}

  </div>
)}
 
              </div>
 
            </div>
        </div>
 
        </div>
      )}

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
 
export default Dish;
 