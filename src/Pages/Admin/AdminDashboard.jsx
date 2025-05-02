import React from "react";
import { Link } from "react-router-dom";
import "./Admin.css";

export default function AdminDashboard() {
  return (
    <div className="admin-page">
      <div className="admin-container">
        <h2>Admin Dashboard</h2>
        <div className="admin-stats">
          <div className="stat-card">
            <h3>Total Books</h3>
            <p className="stat-number">243</p>
          </div>
          <div className="stat-card">
            <h3>Users</h3>
            <p className="stat-number">1,204</p>
          </div>
          <div className="stat-card">
            <h3>Orders</h3>
            <p className="stat-number">56</p>
          </div>
        </div>

        <h3>Quick Actions</h3>
        <div className="admin-actions">
          <Link to="/admin/books" className="admin-action-btn">
            Manage Books
          </Link>
          <Link to="/admin/categories" className="admin-action-btn">
            Manage Categories
          </Link>
          <Link to="/admin/users" className="admin-action-btn">
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}
