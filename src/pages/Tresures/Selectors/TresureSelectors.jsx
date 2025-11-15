export function AddAdminModal({ onSaveSuccess }) {}

import { useEffect, useState } from "react";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { getTresureSelector } from "../../../api";
import { addToast } from "@heroui/react";
import { NavLink } from "react-router-dom";

export function SelectAdminTresure() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const filteredData = data.filter((item) => {
    const lowerSearch = search.toLowerCase();

    // Check if name includes search term
    const nameMatch = item.name.toLowerCase().includes(lowerSearch);

    return nameMatch;
  });

  const fetchData = () => {
    // Using axios
    getTresureSelector("admin")
      .then((response) => {
        setData(response.data.data); // axios puts data in response.data
        setLoading(false);
      })
      .catch((err) => {
        addToast({
          title: "حدث خطاً",
          description: `عملية برمجية رقم : ${err.message}`,
          color: "danger",
        });
        setLoading(false);
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <p>{error}</p>;

  // Fetch data initially
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className=" mx-auto mt-10 p-4 bg-white rounded shadow">
      {/* Search */}
      <input
        type="text"
        className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring"
        placeholder="البحث عن طريق الاسم"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          direction: "rtl",
        }}
      >
        {filteredData.map((data) => (
          <NavLink to={`/tresure/admin/${data.id}`}>
            <div
              key={data.id}
              style={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                padding: "20px",
                width: "200px",
                textAlign: "center",
                fontSize: "18px",
                color: "#333",
              }}
              className="flex flex-col"
            >
              <FaMoneyCheckAlt className="m-auto" />
              {data.name}
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export function SelectCustomerTresure() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const filteredData = data.filter((item) => {
    const lowerSearch = search.toLowerCase();

    // Check if name includes search term
    const nameMatch = item.name.toLowerCase().includes(lowerSearch);

    return nameMatch;
  });

  const fetchData = () => {
    // Using axios
    getTresureSelector("customer")
      .then((response) => {
        setData(response.data.data); // axios puts data in response.data
        setLoading(false);
      })
      .catch((err) => {
        addToast({
          title: "حدث خطاً",
          description: `عملية برمجية رقم : ${err.message}`,
          color: "danger",
        });
        setLoading(false);
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <p>{error}</p>;

  // Fetch data initially
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className=" mx-auto mt-10 p-4 bg-white rounded shadow">
      {/* Search */}
      <input
        type="text"
        className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring"
        placeholder="البحث عن طريق الاسم"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          direction: "rtl",
        }}
      >
        {filteredData.map((data) => (
          <div
            key={data.id}
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              padding: "20px",
              width: "200px",
              textAlign: "center",
              fontSize: "18px",
              color: "#333",
            }}
            className="flex flex-col"
          >
            <FaMoneyCheckAlt className="m-auto" />
            {data.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SelectEmployeeTresure() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const filteredData = data.filter((item) => {
    const lowerSearch = search.toLowerCase();

    // Check if name includes search term
    const nameMatch = item.name.toLowerCase().includes(lowerSearch);

    return nameMatch;
  });

  const fetchData = () => {
    // Using axios
    getTresureSelector("employee")
      .then((response) => {
        setData(response.data.data); // axios puts data in response.data
        setLoading(false);
      })
      .catch((err) => {
        addToast({
          title: "حدث خطاً",
          description: `عملية برمجية رقم : ${err.message}`,
          color: "danger",
        });
        setLoading(false);
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <p>{error}</p>;

  // Fetch data initially
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className=" mx-auto mt-10 p-4 bg-white rounded shadow">
      {/* Search */}
      <input
        type="text"
        className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring"
        placeholder="البحث عن طريق الاسم"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          direction: "rtl",
        }}
      >
        {filteredData.map((data) => (
          <div
            key={data.id}
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              padding: "20px",
              width: "200px",
              textAlign: "center",
              fontSize: "18px",
              color: "#333",
            }}
            className="flex flex-col"
          >
            <FaMoneyCheckAlt className="m-auto" />
            {data.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SelectWorkshopTresure() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const filteredData = data.filter((item) => {
    const lowerSearch = search.toLowerCase();

    // Check if name includes search term
    const nameMatch = item.name.toLowerCase().includes(lowerSearch);

    return nameMatch;
  });

  const fetchData = () => {
    // Using axios
    getTresureSelector("workshop")
      .then((response) => {
        setData(response.data.data); // axios puts data in response.data
        setLoading(false);
      })
      .catch((err) => {
        addToast({
          title: "حدث خطاً",
          description: `عملية برمجية رقم : ${err.message}`,
          color: "danger",
        });
        setLoading(false);
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <p>{error}</p>;

  // Fetch data initially
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className=" mx-auto mt-10 p-4 bg-white rounded shadow">
      {/* Search */}
      <input
        type="text"
        className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring"
        placeholder="البحث عن طريق الاسم"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          direction: "rtl",
        }}
      >
        {filteredData.map((data) => (
          <div
            key={data.id}
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              padding: "20px",
              width: "200px",
              textAlign: "center",
              fontSize: "18px",
              color: "#333",
            }}
            className="flex flex-col"
          >
            <FaMoneyCheckAlt className="m-auto" />
            {data.name}
          </div>
        ))}
      </div>
    </div>
  );
}
