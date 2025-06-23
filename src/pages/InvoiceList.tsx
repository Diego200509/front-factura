import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const LOTES_REPORTE = [100, 1000, 4000, 10000, 20000, 60000, 100000, 1000000];

interface BenchmarkResult {
  size: number;
  duration: number; 
}

interface SingleOrderResult {
  index: number;
  duration: number;
}

export default function BenchmarkDashboard() {
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [orders, setOrders] = useState<SingleOrderResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [liveAvg, setLiveAvg] = useState(0);

  const runBenchmarks = async () => {
    setLoading(true);
    setResults([]);
    setOrders([]);
    setStarted(true);
    setLiveAvg(0);

    const liveDurations: number[] = [];

    for (let i = 1; i <= 15; i++) {
      const start = performance.now();
      await fetch(`/api/benchmark/order?index=${i}`);
      const end = performance.now();
      const duration = end - start;
      liveDurations.push(duration);
      setOrders((prev) => [...prev, { index: i, duration }]);
      setLiveAvg(liveDurations.reduce((a, b) => a + b, 0) / liveDurations.length);
    }

    for (const size of LOTES_REPORTE) {
      const start = performance.now();
      await fetch(`/api/benchmark/report?size=${size}`);
      const end = performance.now();
      const duration = end - start;
      liveDurations.push(duration);
      setResults((prev) => [...prev, { size, duration }]);
      setLiveAvg(liveDurations.reduce((a, b) => a + b, 0) / liveDurations.length);
    }

    setLoading(false);
  };

  const percent = Math.min(liveAvg / 1000, 1);
  const angle = percent * 180;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        🚀 Benchmarks de Facturas
      </h1>

      {!started && (
        <div className="flex justify-center">
          <button
            onClick={runBenchmarks}
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
          >
            Iniciar benchmark
          </button>
        </div>
      )}

      {loading && (
        <p className="text-center text-gray-400 mt-4">⏳ Ejecutando benchmark...</p>
      )}

      {(orders.length > 0 || results.length > 0) && (
        <div className="flex flex-col gap-12 mt-10 max-w-7xl mx-auto">
          {/* Órdenes individuales */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              🔍 Órdenes individuales (Duración en ms)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={orders}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="index" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="duration" fill="#4f46e5" name="Duración (ms)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Reportes maestro/detalle */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              📊 Reporte Maestro/Detalle (Duración por tamaño)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={results}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="size" tickFormatter={(v) => v.toLocaleString()} />
                <YAxis />
                <Tooltip formatter={(value: number) => `${value.toFixed(2)} ms`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="duration"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="Duración (ms)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Velocímetro promedio */}
          <div className="flex justify-center mt-4">
            <div className="w-full max-w-[300px]">
              <svg viewBox="0 0 200 120" width="100%" height="100%">
                <defs>
                  <linearGradient id="gaugeGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#00eaff" />
                    <stop offset="100%" stopColor="#001f3f" />
                  </linearGradient>
                </defs>
                <path
                  d="M10,110 A90,90 0 0,1 190,110"
                  fill="none"
                  stroke="url(#gaugeGradient)"
                  strokeWidth="20"
                />
                <line
                  x1="100"
                  y1="110"
                  x2={100 + 60 * Math.cos((Math.PI * (180 - angle)) / 180)}
                  y2={110 - 60 * Math.sin((Math.PI * (180 - angle)) / 180)}
                  stroke={
                    liveAvg < 500 ? "#10b981" : liveAvg < 1000 ? "#facc15" : "#ef4444"
                  }
                  strokeWidth="4"
                />
                <circle cx="100" cy="110" r="4" fill="#fff" />
                <text x="100" y="105" fontSize="18" fill="#fff" textAnchor="middle">
                  {liveAvg.toFixed(2)} ms
                </text>
                <text
                  x="95"
                  y="80"
                  fontSize="12"
                  fill={
                    liveAvg < 500 ? "#10b981" : liveAvg < 1000 ? "#facc15" : "#ef4444"
                  }
                  textAnchor="middle"
                >
                  {liveAvg < 500
                    ? "⚡ Rápido"
                    : liveAvg < 1000
                    ? "⚠️ Medio"
                    : "🔥 Lento"}
                </text>
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}