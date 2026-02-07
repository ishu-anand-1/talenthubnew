import { Link } from "react-router-dom";
import { Play, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

/* ===================== LOCAL ASSETS ===================== */
import danceImg from "../../assets/dance.jpg";
import singingImg from "../../assets/singing.jpg";
import instrumentImg from "../../assets/instrument.jpg";
import introVideo from "../../assets/talenthub.mp4";

/* ===================== CONSTANTS ===================== */
const CATEGORIES = [
  { title: "Dance", image: danceImg },
  { title: "Singing", image: singingImg },
  { title: "Instrument", image: instrumentImg },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Home = () => {
  return (
    <main className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      
      {/* ================= HERO ================= */}
      <section className="pt-32 pb-24 text-center px-6">
        <motion.span
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="inline-block mb-5 px-4 py-1 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-600"
        >
          #1 Platform for Creative Talents
        </motion.span>

        <motion.h1
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="text-5xl md:text-6xl font-extrabold leading-tight mb-6"
        >
          Learn. Showcase.
          <br />
          <span className="text-indigo-600">Get Hired.</span>
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 mb-10"
        >
          Connect with recruiters, learn from top creators, and showcase your
          talent to the world.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="flex justify-center gap-4 flex-wrap"
        >
          <Link
            to="/learn"
            className="flex items-center gap-2 px-7 py-3 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition hover:scale-105"
          >
            Start Learning <Play size={16} />
          </Link>

          <Link
            to="/upload"
            className="px-7 py-3 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition hover:scale-105"
          >
            Upload Talent
          </Link>
        </motion.div>

        {/* INTRO VIDEO */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mt-16 max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl bg-black"
        >
          <video src={introVideo} controls className="w-full" />
        </motion.div>
      </section>

      {/* ================= EXPLORE CATEGORIES ================= */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold">Explore Categories</h2>
            <p className="text-gray-500">
              Find your niche and start your journey.
            </p>
          </div>

          <Link
            to="/talent"
            className="flex items-center gap-1 text-indigo-600 font-semibold hover:underline"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <Link
                to={`/category/${cat.title.toLowerCase()}`}
                className="group relative h-72 rounded-3xl overflow-hidden block"
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />

                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />

                <h3 className="absolute bottom-6 left-6 text-2xl font-bold text-white">
                  {cat.title}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-28 bg-gray-50 dark:bg-gray-900">
        <h2 className="text-center text-3xl font-bold mb-16">
          How TalentHub Works
        </h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 px-6 text-center">
          {[
            {
              step: "01",
              title: "Create Profile",
              desc: "Build your portfolio and showcase your talent.",
            },
            {
              step: "02",
              title: "Upload Talent",
              desc: "Share performances and grow your audience.",
            },
            {
              step: "03",
              title: "Get Hired",
              desc: "Recruiters discover you through TalentHub.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-indigo-600 text-5xl font-bold mb-4">
                {item.step}
              </div>
              <h3 className="font-semibold text-xl mb-2">
                {item.title}
              </h3>
              <p className="text-gray-500">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24 bg-indigo-600 text-white text-center px-6">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-4xl font-bold mb-4"
        >
          Join TalentHub Today
        </motion.h2>

        <p className="max-w-xl mx-auto mb-8 text-white/90">
          Upload your talent, connect with recruiters, and grow your creative
          career.
        </p>

        <Link
          to="/register"
          className="inline-block px-8 py-3 bg-white text-indigo-600 rounded-full font-semibold hover:scale-105 transition"
        >
          Get Started
        </Link>
      </section>
    </main>
  );
};

export default Home;
