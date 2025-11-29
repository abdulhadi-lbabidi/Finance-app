import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import logoBlack from "../../assets/images/logoblack.png";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getTechPaysById } from "../../api";

function PrintTech() {
  const contentRef = useRef();
  const navigate = useNavigate();
  const { type, techId } = useParams();

  const [transaction, setTransaction] = useState(null);

  const handlePrint = useReactToPrint({
    contentRef: contentRef,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        let response;
        response = await getTechPaysById(techId);
        setTransaction(response.data.techPay);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, [type, techId]);

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
            bg-white mx-auto w-[800px] p-5 rounded-xl shadow-lg"
      >
        <div className="text-center mb-3">
          <img src={logoBlack} alt="Logo" className="w-20 mx-auto" />
          <h2 className="text-2xl font-bold mt-3">شركة نوح</h2>
        </div>

        <h2 className="text-center text-2xl mb-8 border-b-2 border-black pb-3 font-semibold">
          فاتورة معاملة رقم #{transaction.id}
        </h2>

        <table className="w-full text-lg border-collapse">
          <tbody>
            <tr className="border-b">
              <td className="py-3 font-semibold">اسم الموظف/العامل:</td>
              <td className="py-3">{transaction.name}</td>
            </tr>

            <tr className="border-b">
              <td className="py-3 font-semibold">الوصف:</td>
              <td className="py-3">{transaction.desc}</td>
            </tr>

            <tr className="border-b">
              <td className="py-3 font-semibold">عدد الأيام / الكمية:</td>
              <td className="py-3">{transaction.amount}</td>
            </tr>

            <tr className="border-b">
              <td className="py-3 font-semibold">السعر للوحدة:</td>
              <td className="py-3">{transaction.price}</td>
            </tr>

            <tr className="border-b">
              <td className="py-3 font-semibold">اسم الورشة:</td>
              <td className="py-3">{transaction.workshopname}</td>
            </tr>

            <tr className="border-b">
              <td className="py-3 font-semibold"> الحرفي:</td>
              <td className="py-3">{transaction.technicalteam?.name}</td>
            </tr>

            <tr className="border-b">
              <td className="py-3 font-semibold">نوع الخصم:</td>
              <td className="py-3">{transaction.discount_type}</td>
            </tr>

            <tr className="border-b">
              <td className="py-3 font-semibold">قيمة الخصم:</td>
              <td className="py-3">{transaction.discount_value}</td>
            </tr>

            <tr className="border-b">
              <td className="py-3 font-semibold">السعر النهائي:</td>
              <td className="py-3">{transaction.finalprice}</td>
            </tr>

            <tr className="border-b">
              <td className="py-3 font-semibold">التاريخ:</td>
              <td className="py-3">
                {new Date(transaction.created_at).toLocaleDateString("en")}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-5 text-left">
          <p className="text-lg">التوقيع: _____________________</p>
        </div>
      </div>
    </div>
  );
}

export default PrintTech;
