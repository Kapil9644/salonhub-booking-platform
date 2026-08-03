export default function AboutSection({ about }) {
  return (
    <section className="mt-12 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">About Salon</h2>

      <p className="mt-4 leading-8 text-gray-600">{about}</p>
    </section>
  );
}
