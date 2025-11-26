import { useEffect, useState } from "react";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { getTresureSelector } from "../../../api";
import { addToast } from "@heroui/react";
import { NavLink } from "react-router-dom";
import SkeletonCard from "../../../components/Skeleton";

export function SelectAdminTresure() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const fetchDataAsync = async () => {
      setLoading(true);
      try {
        const response = await getTresureSelector("admin");
        setData(response.data.data);
      } catch (err) {
        addToast({
          title: "حدث خطأ",
          description: `عملية برمجية رقم: ${err.message}`,
          color: "danger",
        });
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDataAsync();
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
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          direction: "rtl",
        }}
      >
        {loading
          ? Array.from({ length: 2 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))
          : filteredData.map((data) => (
              <NavLink key={data.id} to={`/tresure/admin/${data.id}`}>
                <div
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
        {!loading && filteredData.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            لا توجد نتائج مطابقة للبحث.
          </p>
        )}
      </div>
    </div>
  );
}

export function SelectCustomerTresure() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const fetchDataAsync = async () => {
      setLoading(true);
      try {
        const response = await getTresureSelector("customer");
        setData(response.data.data);
      } catch (err) {
        addToast({
          title: "حدث خطأ",
          description: `عملية برمجية رقم: ${err.message}`,
          color: "danger",
        });
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDataAsync();
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
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          direction: "rtl",
        }}
      >
        {loading
          ? Array.from({ length: 2 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))
          : filteredData.map((data) => (
              <NavLink key={data.id} to={`/tresure/customer/${data.id}`}>
                <div
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
        {!loading && filteredData.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            لا توجد نتائج مطابقة للبحث.
          </p>
        )}
      </div>
    </div>
  );
}

export function SelectEmployeeTresure() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const fetchDataAsync = async () => {
      setLoading(true);
      try {
        const response = await getTresureSelector("employee");
        setData(response.data.data);
      } catch (err) {
        addToast({
          title: "حدث خطأ",
          description: `عملية برمجية رقم: ${err.message}`,
          color: "danger",
        });
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDataAsync();
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
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          direction: "rtl",
        }}
      >
        {loading
          ? Array.from({ length: 2 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))
          : filteredData.map((data) => (
              <NavLink key={data.id} to={`/tresure/employee/${data.id}`}>
                <div
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
        {!loading && filteredData.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            لا توجد نتائج مطابقة للبحث.
          </p>
        )}
      </div>
    </div>
  );
}

export function SelectWorkshopTresure() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const fetchDataAsync = async () => {
      setLoading(true);
      try {
        const response = await getTresureSelector("workshop");
        setData(response.data.data);
      } catch (err) {
        addToast({
          title: "حدث خطأ",
          description: `عملية برمجية رقم: ${err.message}`,
          color: "danger",
        });
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDataAsync();
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
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          direction: "rtl",
        }}
      >
        {loading
          ? Array.from({ length: 2 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))
          : filteredData.map((data) => (
              <NavLink key={data.id} to={`/tresure/workshop/${data.id}`}>
                <div
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
        {!loading && filteredData.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            لا توجد نتائج مطابقة للبحث.
          </p>
        )}
      </div>
    </div>
  );
}

export function SelectOfficeTresure() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const fetchDataAsync = async () => {
      setLoading(true);
      try {
        const response = await getTresureSelector("office");
        setData(response.data.data);
      } catch (err) {
        addToast({
          title: "حدث خطأ",
          description: `عملية برمجية رقم: ${err.message}`,
          color: "danger",
        });
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDataAsync();
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
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          direction: "rtl",
        }}
      >
        {loading
          ? Array.from({ length: 2 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))
          : filteredData.map((data) => (
              <NavLink key={data.id} to={`/tresure/office/${data.id}`}>
                <div
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
        {!loading && filteredData.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            لا توجد نتائج مطابقة للبحث.
          </p>
        )}
      </div>
    </div>
  );
}
