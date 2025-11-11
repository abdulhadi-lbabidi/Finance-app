import React, { useEffect, useState } from "react";
import { getAdmins } from "../../api";

export default function AdminList() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Using axios
    getAdmins()
      .then((response) => {
        setAdmins(response.data.admin); // axios puts data in response.data
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error fetching admins");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading admins...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold txt-black mb-4">Admin List</h1>
      <ul className="space-y-2">
        {admins.map((admin) => (
          <li key={admin.id} className="border p-2 rounded shadow">
            <p>
              <strong>Name:</strong> {admin.name}
            </p>
            <p>
              <strong>Phone:</strong> {admin.phone}
            </p>
            <p>
              <strong>Level:</strong> {admin.admin_level}
            </p>
            <p>
              <strong>Department:</strong> {admin.department}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
