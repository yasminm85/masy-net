import { Calendar, FileText, Briefcase } from "lucide-react";

const TimelineHistory = () => {
  const data = [
    {
      role: "Tech Lead",
      date: "1 Januari 2025 - Sekarang",
      duration: "7 bulan",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta dicta consequatur ad non fugit eius asperiores totam veritatis modi minima quos corrupti.",
      status: "Sedang Berjalan",
      statusColor: "bg-green-500/20 text-green-300",
    },
    {
      role: "Senior Frontend Developer",
      date: "1 Juli 2023 - 31 Desember 2024",
      duration: "1 tahun 5 bulan",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta dicta consequatur ad non fugit eius asperiores totam veritatis modi minima quos corrupti.",
      status: "Selesai",
      statusColor: "bg-gray-500/20 text-gray-300",
    },
  ];

  return (
    <div className="min-h-screen bg-richBlack text-whiteSmoke px-4 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Judul */}
        <h1 className="text-3xl font-bold mb-2">Timeline History Position</h1>
        <p className="text-coolGray mb-8">
          Riwayat perjalanan karir dan posisi kerja
        </p>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 w-1 h-full bg-gradient-to-b from-electricPurple/40 to-neonCyan/40 rounded-full"></div>

          {/* Timeline */}
          <div className="space-y-8">
            {data.map((item, index) => (
              <div key={index} className="flex items-start relative">
                <div className="relative z-10 w-12 h-12 bg-gradient-to-br from-electricPurple/50 to-neonCyan/50 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10 shadow-lg">
                  <Briefcase size={20} />
                </div>

                {/* card */}
                <div className="ml-6 flex-1">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-lg hover:shadow-electricPurple/20 transition">
                    <h3 className="text-xl font-semibold">{item.role}</h3>

                    {/* tanggal & durasi */}
                    <div className="flex items-center flex-wrap gap-4 text-silverGray mt-2">
                      <span className="flex items-center gap-2">
                        <Calendar size={16} /> {item.date}
                      </span>
                      <span className="px-3 py-1 text-sm bg-neonCyan/10 text-neonCyan rounded-full">
                        {item.duration}
                      </span>
                    </div>

                    {/* desc */}
                    <div className="flex items-start gap-2 text-coolGray mt-3">
                      <FileText size={16} className="mt-1 flex-shrink-0" />
                      <p>{item.description}</p>
                    </div>

                    {/* status */}
                    <div className="mt-4">
                      <span
                        className={`px-3 py-1 text-sm rounded-full ${item.statusColor}`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineHistory;
