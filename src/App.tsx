
import { Routes, Route, Navigate } from "react-router-dom";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
