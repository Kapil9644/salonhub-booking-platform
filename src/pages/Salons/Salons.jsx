import Container from "../../layouts/Container/Container";
import PageHeader from "../../components/Salons/PageHeader/PageHeader";
import Filters from "../../components/Salons/Filters/Filters";
import SortDropdown from "../../components/Salons/SortDropdown/SortDropdown";
import SalonGrid from "../../components/Salons/SalonGrid/SalonGrid";

export default function Salons() {
  return (
    <Container>
      <PageHeader />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <Filters />
        </div>

        <div className="lg:col-span-9">
          <SortDropdown />
          <SalonGrid />
        </div>
      </div>
    </Container>
  );
}