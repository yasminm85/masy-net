import React from "react";
import { Card, CardContent } from "../components/card.jsx";
import { User, Users, Clock, Briefcase } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", total: 10 },
  { month: "Feb", total: 12 },
  { month: "Mar", total: 15 },
  { month: "Apr", total: 18 },
  { month: "May", total: 21 },
  { month: "Jun", total: 25 },
];

export default function DashboardAnalytics() {
  return (
    <div className="min-h-screen p-6 md:p-10 bg-richBlack">
      {/* header */}
      <h1 className="text-3xl font-bold text-white mb-2">Dashboard Analitik Karyawan</h1>
      <p className="text-gray-300 mb-8">Ringkasan data dan perkembangan karyawan</p>

      {/* card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <GlassCard icon={<Users className="text-blue-400" size={28} />} title="Total Karyawan" value="120" />
        <GlassCard icon={<User className="text-green-400" size={28} />} title="Karyawan Aktif" value="110" />
        <GlassCard icon={<Briefcase className="text-yellow-400" size={28} />} title="Karyawan Cuti" value="5" />
        <GlassCard icon={<Clock className="text-purple-400" size={28} />} title="Rata-rata Lama Bekerja" value="3.2 Thn" />
      </div>

      {/* chart */}
      <div className="rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">Pertumbuhan Karyawan</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="month" stroke="#bbb" />
            <YAxis stroke="#bbb" />
            <Tooltip contentStyle={{ backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(10px)", color: "#fff" }} />
            <Line type="monotone" dataKey="total" stroke="#4f9fff" strokeWidth={2} dot={{ fill: "#4f9fff", r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function GlassCard({ icon, title, value }) {
  return (
    <Card className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-lg hover:scale-105 transition-transform">
      <CardContent className="flex flex-col items-center text-center p-6">
        <div className="mb-3">{icon}</div>
        <p className="text-gray-300 text-sm">{title}</p>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
      </CardContent>
    </Card>
  );
}
