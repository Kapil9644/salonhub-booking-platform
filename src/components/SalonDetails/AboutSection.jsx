export default function AboutSection({ about }) {
  const hasAbout = about?.trim();

  return (
    <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:mt-12 sm:rounded-3xl sm:p-8">
      <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
        About Salon
      </h2>

      {hasAbout ? (
        <p className="mt-4 whitespace-pre-line leading-7 text-gray-600 sm:leading-8">
          {about}
        </p>
      ) : (
        <p className="mt-4 text-gray-500">
          This salon has not added an introduction yet.
        </p>
      )}
    </section>
  );
}
