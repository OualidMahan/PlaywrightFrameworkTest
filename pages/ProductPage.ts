import type { Locator } from "@playwright/test";
import { CartPage } from "./CartPage";
import { BasePage } from "@automation/framework";

export class ProductPage extends BasePage {
  private readonly productNameDiv: Locator = this.page.getByTestId(
    "inventory-item-name",
  );
  private readonly productPriceDiv: Locator = this.page.getByTestId(
    "inventory-item-price",
  );
  private readonly addToCartBtn: Locator = this.page.getByRole("button", {
    name: "Add to cart",
  });
  readonly badge: Locator = this.page.getByTestId("shopping-cart-badge");
  readonly removeBtn: Locator = this.page.getByRole("button", {
    name: "Remove",
  });
  readonly cartLink: Locator = this.page.getByTestId("shopping-cart-link");

  async addToCart(): Promise<void> {
    await this.addToCartBtn.click();
  }

  async openCart(): Promise<CartPage> {
    await this.cartLink.click();
    await this.page.waitForURL("**/cart.html");
    return new CartPage(this.page);
  }

  getProductName(): Locator {
    return this.productNameDiv;
  }

  getProductPrice(): Locator {
    return this.productPriceDiv;
  }
}
