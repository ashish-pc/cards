import { Route, Routes } from "react-router-dom"
import Medicine from "./pages/Medicine"

function App() {

  return (
    <Routes>
      <Route index element={<Medicine />} />
    </Routes>
  )
}

export default App
