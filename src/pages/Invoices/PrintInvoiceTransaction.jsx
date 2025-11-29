import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import logoBlack from "../../assets/images/logoblack.png";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getInnerTransactiondata, getOuterTransactiondata } from "../../api";
import { useNavigate } from "react-router-dom";

function PrintInvoiceTransaction() {
  const contentRef = useRef();
  const navigate = useNavigate();
  const { type, transactionId } = useParams();
  const [note, setNote] = useState("");

  const [transaction, setTransaction] = useState(null);

  const handlePrint = useReactToPrint({
    contentRef: contentRef,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        let response;
        if (type === "innerTransaction") {
          response = await getInnerTransactiondata(transactionId);
          setTransaction(response.data.InnerTransaction);
        } else if (type === "outerTransaction") {
          response = await getOuterTransactiondata(transactionId);
          setTransaction(response.data.OuterTransaction);
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, [type, transactionId]);

  if (!transaction) return <div>جاري تحميل الفاتورة...</div>;

  return (
    <div className="min-h-screen direction-rtl">
      <div className="flex justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          رجوع
        </button>

        <button
          onClick={handlePrint}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          طباعة
        </button>
      </div>

      <div
        ref={contentRef}
        className="
          bg-white mx-auto w-[800px] p-10 rounded-xl shadow-lg

        "
      >
        <div className="text-center mb-6">
          <img src={logoBlack} alt="Logo" className="w-20 mx-auto" />
          <h2 className="text-2xl font-bold mt-3">شركة نوح</h2>
        </div>

        <h2 className="text-center text-2xl mb-8 border-b-2 border-black pb-3 font-semibold">
          فاتورة معاملة رقم
          {type === "innerTransaction"
            ? ` inner#${transaction.id}`
            : ` outer#${transaction.id}`}
        </h2>

        <table className="w-full text-lg border-collapse">
          <tbody>
            <tr className="border-b">
              <td className="py-3 font-semibold">اسم المعاملة:</td>
              <td className="py-3">{transaction.name}</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 font-semibold">القيمة:</td>
              <td className="py-3">{transaction.amount}</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 font-semibold">التاريخ:</td>
              <td className="py-3">{transaction.indate}</td>
            </tr>
            {/* <tr className="border-b">
              <td className="py-3 font-semibold">ملاحظات:</td>
              <td className="py-3">{transaction.desc}</td>
            </tr> */}

            <tr className="border-b">
              <td className="py-3 font-semibold"> ملاحظات:</td>
              <td className="py-3">
                <input
                  className="w-full border-none outline-none p-2 rounded"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-12 text-left">
          <p className="text-lg">التوقيع: _____________________</p>
        </div>
      </div>
    </div>
  );
}

export default PrintInvoiceTransaction;
