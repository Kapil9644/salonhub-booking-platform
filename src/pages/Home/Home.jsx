import Navbar from "../../components/Navbar/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <div className="h-screen flex items-center justify-center">
        <h1 className="text-5xl font-bold">
          Welcome to SalonHub
        </h1>
      </div>
    </>
  );
}