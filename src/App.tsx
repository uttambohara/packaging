import { divideIntoPackage } from "./lib/divide-package";

export default function App() {
  //
  const data = divideIntoPackage([
    { id: 1, name: "Product 1", price: 100, weight: 200 },
    { id: 2, name: "Product 2", price: 200, weight: 150 },
    { id: 3, name: "Product 3", price: 50, weight: 150 },
  ]);

  console.log(data);
  return <div></div>;
}
