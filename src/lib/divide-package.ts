import { Products, products } from "@/db";
import { CurrentPackageT } from "@/types";
import { calculateCourierPrices } from "./courier-charge";

/**
 * Divide selected products into packages based on weight constraints.
 * @param {Array} selectedProducts Array of products ordered by a user on the frontend
 * @returns {Array} An array of packages, each containing a subset of selected products
 *
 * @example
 * const selectedProducts = [
 *   { name: 'Product 1', price: 100, weight: 100 },
 *   { name: 'Product 2', price: 50, weight: 100 },
 *   { name: 'Product 3', price: 80, weight: 150 },
 *   { name: 'Product 4', price: 120, weight: 25 },
 * ];
 *
 * const packages = divideIntoPackages(selectedProducts);
 * Result:
 *  [
 * { items: [{ name: 'Product 1', price: 100, weight: 100 }, { name: 'Product 2', price: 50, weight: 100 },], totalWeight: 200, totalPrice: 150, courierPrice: 5 },
 * { items: [{ name: 'Product 3', price: 80, weight: 150 }, { name: 'Product 4', price: 120, weight: 25 }}], totalWeight: 430, totalPrice: 175, courierPrice: 10 }
 * ]
 */
function divideIntoPackage(selectedProducts: Products) {
  // Array to store the created packages
  const finalPackages: CurrentPackageT[] = [];

  // Temporary array to hold items for the current package
  let currentPackage: CurrentPackageT = {
    items: [],
    totalWeight: 0,
    totalPrice: 0,
  };

  /**
   1) Sort products by weight in descending order to prioritize heavier products for packaging first.
   * This helps balance package weights effectively, also minimize shipping charges.
   *
   * If multiple products exceed the 200g weight limit:
   * 1) The first product exceeding the limit becomes the first package.
   * 2) Subsequent products exceeding the limit are placed in separate packages.
   *
   * @example
   * Before sorting:
   * [
   *   { id: 2, name: "Product 2", price: 50, weight: 150 }
   *   { id: 3, name: "Product 3", price: 80, weight: 80 },
   *   { id: 4, name: "Product 4", price: 120, weight: 100 },
   * ]
   * After sorting:
   * [
   *   { id: 4, name: "Product 4", price: 120, weight: 150 }, // Shipping charge: $5
   *   { id: 3, name: "Product 3", price: 80, weight: 180 }, // Shipping charge: $10
   * ]
   */
  selectedProducts.sort((a, b) => b.weight - a.weight);

  selectedProducts.forEach((product) => {
    //
    if (product.price > 200) {
      console.error(
        "The total cost of all products within a single package cannot exceed $250 for international customs purposes"
      );
      return;
    }

    // Check if a selected product exists in our db
    const isValidProductId = products.find((p) => p.id === product.id);

    // Handle error if product not found
    if (!isValidProductId || !isValidProductId.id) {
      console.error(`Product with ID ${product.id} not found`);
      return;
    }

    // Check if adding this product exceeds package weight limit
    if (currentPackage.totalPrice + product.price > 250) {
      finalPackages.push(currentPackage);
      currentPackage = { items: [], totalWeight: 0, totalPrice: 0 };
    }

    /**
     * // Add product to the current package
     *
     * Case: product exceeds package weight limit | currentPackage.totalPrice + product.price > 250
     * Once all products have been iterated through, there might still be products left in the current package (because the weight limit wasn't exceeded for the last few products). To ensure no products are left out, the code checks if there are any items in the current package:
     * even if the weight limit is exceeded, the product is temporarily added to the current package which is the cleared one
     *  */

    currentPackage.items.push(product);
    currentPackage.totalWeight += product.weight;
    currentPackage.totalPrice += product.price;
  });

  // Add the last package
  if (currentPackage.items.length > 0) {
    finalPackages.push(currentPackage);
  }

  // Calculate courier price for each package
  calculateCourierPrices(finalPackages);

  return finalPackages;
}

export { divideIntoPackage };
