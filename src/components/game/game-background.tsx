export default function GameBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-5"></div>
    </div>
  );
}
