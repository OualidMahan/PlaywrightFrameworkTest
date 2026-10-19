import { ProductPage } from "./ProductPage";
import { BasePage } from "@automation/framework";
import type { Locator } from "@playwright/test";

export class InventoryPage extends BasePage {
  readonly inventoryItems: Locator = this.page.getByTestId("inventory-item");

  // Construire un locator est synchrone
  getProductByName(name: string): Locator {
    return this.inventoryItems.filter({
      has: this.page.getByTestId("inventory-item-name").getByText(name, { exact: true }),
    });
  }

  async getPriceByProduct(product: Locator): Promise<string | null> {
    return product.getByTestId("inventory-item-price").textContent();
  }

  async openProduct(
    product: Locator,
    name: string,
  ): Promise<ProductPage> {
    await product.getByText(name, { exact: true }).click();
    await this.page.waitForURL("**/inventory-item.html?id=*");

    return new ProductPage(this.page);
  }
}
