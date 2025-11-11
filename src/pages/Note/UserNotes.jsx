import React, { useEffect, useState } from "react";
import { getNotes } from "../../api";
import {
  Card,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import {
  AddNoteModal,
  DeleteNoteModal,
  UpdateNoteModal,
} from "../../components/Modals/NoteModal";
import { FaEllipsisVertical } from "react-icons/fa6";

function UserNotes({ id }) {
  const [notes, setNotes] = useState();
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    // Using axios
    getNotes(id)
      .then((response) => {
        setNotes(response.data.notes); // axios puts data in response.data
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

  // Fetch data initially
  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading notes...</div>;
  }
  return (
    <div className="p-3">
      <AddNoteModal userid={id} onSaveSuccess={fetchData} />

      <ol className="ls-dec grid grid-cols-1 p-5  gap-5">
        {notes &&
          notes.map((note) => (
            <li key={note.id} className="border rounded-xl bg-slate-200">
              <div className="grid grid-cols-2">
                <h3 className="text-lg">{note.title}</h3>
                <div className="mr-auto p-3 flex gap-3">
                  <span
                    className={`font-semibold mx-3 ${
                      note.is_active === 1 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {" "}
                    {note.is_active === 1 ? "مُنجز" : "غير مُنجز"}
                  </span>
                </div>
              </div>

              {/* <DeleteNoteModal id={note.id} /> */}
              <Divider />
              <p>{note.description}</p>
              {/* <p>
                <strong>Status:</strong>{" "}
                <span style={{ color: note.is_active ? "green" : "red" }}>
                  {note.active ? "Active" : "Inactive"}
                </span>
              </p> */}
              <Divider />
              <UpdateNoteModal id={note.id} onSaveSuccess={fetchData} />
              <DeleteNoteModal id={note.id} onSaveSuccess={fetchData} />
            </li>
          ))}
      </ol>
    </div>
  );
}

export default UserNotes;
