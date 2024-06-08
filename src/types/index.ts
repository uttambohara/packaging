import { Products } from "@/db";

export interface CurrentPackageT {
  /**
     *  All the selected items within the package limit
    * @property {Array<Object>} items - An array of objects representing the selected products 
      * within the package limit. Each object should have the following properties:
      *   - `id`: (number) Unique identifier for the product.
      *   - `name`: (string) Name of the product.
      *   - `price`: (number) Price of the product.
      *   - `weight`: (number) Weight of the product.
     * @default []
     * @example [{ id: 1, name: "Product 1", price: 100, weight: 200 },
    { id: 2, name: "Product 2", price: 50, weight: 150 }]
  
     */
  items: Products;
  /**
   * Total accumlated weight of the products in the package
   * @default 0
   *  @example totalWeight=200
   */
  totalWeight: number;
  /**
   * Total accumlated price of the products in the package
   * @default 0
   * @example totalPrice= 400
   */
  totalPrice: number;
  /**
   * Total accumlated courier charge
   * @default 0
   * @example totalCourierCharge= 400
   */
  totalCourierCharge?: number;
}
