
import TruckList from "@/pages/truck/TruckList";
import TruckMap from "@/pages/truck/TruckMap";
import { Route, Routes } from "react-router-dom";

function TruckRouter() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<TruckMap />} />
        <Route path="/trucklist" element={<TruckList />} />
      </Routes>
    </div>
  );
}

export default TruckRouter;
