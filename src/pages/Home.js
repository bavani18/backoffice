import { useEffect, useState } from "react";
import "./Home.css";
import { BASE_URL } from "../config/api";

function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
   fetch(`${BASE_URL}/api/dashboard`)
      .then(res => res.json())
      .then(res => setData(res))
      .catch(err => console.log(err));
  }, []);

  if (!data) return <h2 className="home-loading">Loading...</h2>;

  return (
    <div className="home-dashboard">

      <h1 className="home-title">Dashboard</h1>

      <div className="home-cards">

        <div className="home-card">
          <h3>Kitchen</h3>
          <p>Total: {data.kitchen_total}</p>
          <p className="home-active">Active: {data.kitchen_active}</p>
          <p className="home-inactive">Inactive: {data.kitchen_inactive}</p>
        </div>

        <div className="home-card">
          <h3>Category</h3>
          <p>Total: {data.category_total}</p>
          <p className="home-active">Active: {data.category_active}</p>
          <p className="home-inactive">Inactive: {data.category_inactive}</p>
        </div>

        <div className="home-card">
          <h3>Dish Group</h3>
          <p>Total: {data.dishgroup_total}</p>
          <p className="home-active">Active: {data.dishgroup_active}</p>
          <p className="home-inactive">Inactive: {data.dishgroup_inactive}</p>
        </div>

        <div className="home-card">
          <h3>Dish</h3>
          <p>Total: {data.dish_total}</p>
          <p className="home-active">Active: {data.dish_active}</p>
          <p className="home-inactive">Inactive: {data.dish_inactive}</p>
        </div>

      </div>

    </div>
  );
}

export default Home;