export default function FooterColumn({
  title,
  children,
}) {
  return (
    <div>
      <h3 className="mb-5 text-xl font-bold text-white">
        {title}
      </h3>

      <div className="flex flex-col gap-3">
        {children}
      </div>
    </div>
  );
}