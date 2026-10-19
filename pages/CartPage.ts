import { BasePage } from "@automation/framework";

export class CartPage extends BasePage {
  readonly cartItems = this.page.getByTestId("inventory-item");
  readonly itemName = this.page.getByTestId("inventory-item-name");
  readonly itemPrice = this.page.getByTestId("inventory-item-price");
  readonly badge = this.page.getByTestId("shopping-cart-badge");

  async removeProduct(name: string): Promise<void> {
    const item = this.cartItems.filter({
      has: this.page.getByTestId("inventory-item-name").getByText(name, { exact: true }),
    });
    await item.getByRole("button", { name: "Remove", exact: true }).click();
  }
}
