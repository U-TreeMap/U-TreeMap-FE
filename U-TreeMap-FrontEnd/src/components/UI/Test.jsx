export default function Test() {
  return (
    <div className="w-64 h-64 overflow-y-auto border scrollbar scrollbar-thin scrollbar-thumb-red-500 scrollbar-track-gray-100">
      {Array.from({ length: 100 }).map((_, i) => (
        <div key={i}>아이템 {i}</div>
      ))}
    </div>
  );
}
