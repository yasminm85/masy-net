import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const features = [
  {
    title: "Stores Employee Data",
    desc: "You can stores employee data securely.",
  },
  {
    title: "Timeline History Position",
    desc: "Track your employee position.",
  },
  {
    title: "Digital Contract",
    desc: "Create your digital contract with digital signatures.",
  },
];

const FeatureCarousel = () => {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % features.length);
  const prev = () => setIndex((prev) => (prev - 1 + features.length) % features.length);

  return (
    <div className="overflow-hidden relative">
        <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
        >
        {features.map((feat, i) => (
            <div
              key={i}
              className="min-w-full px-10 py-6 flex justify-center"
            >
              <div className="
                w-full max-w-4xl 
                bg-dimGray/10 backdrop-blur-sm 
                rounded-xl 
                h-[250px] 
                px-6 py-4 
                flex flex-col justify-center items-center 
                shadow-lg shadow-black/30 
                border border-white/20
                transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl
              ">
                <h3 className="text-xl font-bold mb-2 text-silverGray">
                  {feat.title}
                </h3>
                <p className="text-coolGray/70 text-center">
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
        <button onClick={prev} className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full">
          <ChevronLeft size={20} />
        </button>
        <button onClick={next} className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full">
          <ChevronRight size={20} />
        </button>
    </div>
  );
};

export default FeatureCarousel;
