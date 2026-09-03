import { WHY_COMPARE } from "@/lib/constants/why.constants";

function Tick({ ok }: { ok: boolean }) {
  return ok ? (
    <svg viewBox="0 0 24 24" className="mx-auto h-5 w-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="mx-auto h-5 w-5 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

export function CompareTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-left">
            <th className="px-4 py-3 font-semibold text-gray-700">What matters</th>
            <th className="px-4 py-3 text-center font-bold text-orange-600">Matoshree Cabs</th>
            <th className="px-4 py-3 text-center font-medium text-gray-500">Others</th>
          </tr>
        </thead>
        <tbody>
          {WHY_COMPARE.map((row, i) => (
            <tr key={row.point} className={i % 2 ? "bg-orange-50/30" : "bg-white"}>
              <td className="px-4 py-3 text-gray-800">{row.point}</td>
              <td className="px-4 py-3"><Tick ok={row.matoshreecabs} /></td>
              <td className="px-4 py-3"><Tick ok={row.others} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}