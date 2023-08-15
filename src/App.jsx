import { Route, Routes } from "react-router-dom"
import Medicine from "./pages/Medicine"
import MedHome from "./pages/MedHome"

function App() {

  return (
    <Routes>
      <Route index element={<Medicine />} />
      <Route path="/medhome" element={<MedHome />} />
    </Routes>
  )
}

export default App
