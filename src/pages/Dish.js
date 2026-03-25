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
  
  const res = await axios.get(`${BASE_URL}/dish`);
  
  setEntries(res.data);
  
  }catch(err){
  
  console.error("DishGroup load error:",err);
  
  }
  };

  // ✅ PAGE LOAD
useEffect(()=>{
  fetchDish();

  axios.get(`${BASE_URL}/modifier`)
    .then(res => setdishModifiers(res.data));

  axios.get(`${BASE_URL}/kitchen`)
    .then(res => setdishKitchens(res.data));

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

const [dishmodifier, setdishModifiers] = useState([]);
const [dishkitchens, setdishKitchens] = useState([]);

const [selecteddishModifiers, setSelecteddishModifiers] = useState([]);
const [selecteddishKitchens, setSelecteddishKitchens] = useState([]);
 
  const colorPickerRef = useRef(null);
  const textColorPickerRef = useRef(null);
 
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
    
      console.log("SAVE CLICKED");

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
  }
};
 
  const handleCancel = () => {
    setShowModal(false);
    setEditIndex(null);
  };
 
  const openNewDish = () => {
    setDish(emptyDish);
    setEditIndex(null);
    setShowModal(true);
  };
 
const handleEdit = (index) => {
   const row = entries[index];
  const data = entries[index];

  setDish(data);
  setEditIndex(index);

  // 🔥 IMPORTANT
  setExistingImage(data.ImageName || null);
  setCategoryImage(null); // reset new upload

    // 🔥 ADD THIS (MODIFIER GET)
  axios.get(`${BASE_URL}/dishmodifier/${data.DishId}`)
    .then(res => {
      const ids = res.data.map(x => x.ModifierId);
      setSelecteddishModifiers(ids);
    });

  // 🔥 ADD THIS (KITCHEN GET)
  axios.get(`${BASE_URL}/dishkitchen/${data.DishId}`)
    .then(res => {
      const kitchens = res.data.map(x => ({
        KitchenTypeCode: x.KitchenTypeCode
      }));
      setSelecteddishKitchens(kitchens);
    });


  setShowModal(true);
};
 
  return (
    <div className="dish-page1">
 
      <h1>Dish Master</h1>
 
      <button className="dish-new-btn1" onClick={openNewDish}>
        New
      </button>
 
      <div className="dish-report-section1">
        <table className="dish-report-table1">
 
          <thead>
            <tr>
              <th>Dish Code</th>
              <th>Name</th>
              <th>Short Name</th>
              <th>Description</th>
              <th>Group</th>
              <th>Price</th>
              <th>Sort Code</th>
              <th>Unit Cost</th>
              <th>Qty</th>
              <th>Active</th>
              <th>Kitchen</th>
              <th>Discount</th>
              <th>Tax</th>
              <th>Stock</th>
              <th>FOC</th>
              <th>Service</th>
              <th>Favourite</th>
            </tr>
          </thead>
 
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan="17">No Data</td>
              </tr>
            ) : (
          entries.map((d, i) => (
                <tr
                  key={i}
                  onClick={() => handleEdit(i)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{d.DishCode}</td>
                  <td>{d.Name}</td>
                  <td>{d.ShortName}</td>
                  <td>{d.Description}</td>
                  <td>{d.DishGroupId}</td>
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
                  <input name="DishGroupId" value={dish.DishGroupId} onChange={handleChange} />
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
                                    src={`${BASE_URL}/images/Dish/${existingImage}`}
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
        src={`${BASE_URL}/images/Dish/${existingImage}`}
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
            checked={selecteddishModifiers.includes(mod.ModifierId)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelecteddishModifiers([
                  ...selecteddishModifiers,
                  mod.ModifierId
                ]);
              } else {
                setSelecteddishModifiers(
                  selecteddishModifiers.filter(id => id !== mod.ModifierId)
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
      <label key={k.KitchenTypeCode} className="dish-kitchen-item">

        <input
          type="checkbox"
          checked={selecteddishKitchens.some(
            x => x.KitchenTypeCode === k.KitchenTypeCode
          )}
          onChange={(e) => {
            if (e.target.checked) {
              setSelecteddishKitchens([
                ...selecteddishKitchens,
                k
              ]);
            } else {
              setSelecteddishKitchens(
                selecteddishKitchens.filter(
                  x => x.KitchenTypeCode !== k.KitchenTypeCode
                )
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
 
    </div>
  );
}
 
export default Dish;
 