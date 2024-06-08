import { CurrentPackageT } from "@/types";

/**
 * Calculates the courier price for each package based on the remaining weight.
 * Assigns the calculated courier prices to each package object.
 *
 * @param {Array} packages An array of package objects, each containing total weight of products
 * @returns {void}
 */
function calculateCourierPrices(packages: CurrentPackageT[]) {
  const courierPrices: number[] = [];
  let totalWeight = 0;

  /**
   * Load total shipping charge of each package into the courierPrices []
   * @example [5, 10, 15]
   */
  packages.forEach((pkg) => {
    totalWeight += pkg.totalWeight;
    let courierPrice = 0;
    if (totalWeight <= 200) {
      courierPrice = 5;
    } else if (totalWeight <= 500) {
      courierPrice = 10;
    } else if (totalWeight <= 1000) {
      courierPrice = 15;
    } else {
      courierPrice = 20;
    }
    courierPrices.push(courierPrice);
  });

  // Populate the totalCourierCharge into the final package
  packages.forEach((pkg, index) => {
    pkg.totalCourierCharge = courierPrices[index];
  });
}

export { calculateCourierPrices };
