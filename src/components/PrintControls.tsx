"use client";

export default function PrintControls() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="print:hidden mb-6 flex gap-4">
      <button
        type="button"
        onClick={handlePrint}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        Распечатать профиль (А4)
      </button>
    </div>
  );
}
