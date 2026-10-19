import { test, expect } from "../fixtures/test";

test.beforeEach(async ({ loginPage }) => {
  await loginPage.openUrl();
  await loginPage.login(process.env.TEST_USERNAME!, process.env.TEST_PASSWORD!);
});

test("Vérifier le produit et la persistance du panier après actualisation", async ({ inventoryPage }) => {
  const productName = "Sauce Labs Backpack";

  // 1. Repérer un seul produit par son nom
  const product = inventoryPage.getProductByName(productName);

  await expect(product).toHaveCount(1);
  await expect(product).toBeVisible();

  // 2. Mémoriser son prix dans le catalogue
  const price = await inventoryPage.getPriceByProduct(product);

  if (price === null || price.trim() === "") {
    throw new Error("Le prix du produit est absent");
  }

  // 3. Ouvrir la fiche et vérifier son nom et son prix
  const productPage = await inventoryPage.openProduct(
    product,
    productName,
  );

  await expect(productPage.getProductName()).toHaveText(productName);
  await expect(productPage.getProductPrice()).toHaveText(price);

  // 4. ajouter le produit au panier et vérifier que le badge affiche 1
  await productPage.addToCart();
  await expect(productPage.badge).toHaveText("1");

  // 5. Actualiser la page et vérifier que le badge affiche toujours 1 et que le bouton Remove est visible.
  await productPage.reload();
  await expect(productPage.badge).toHaveText("1");
  await expect(productPage.removeBtn).toBeVisible();

  // 6. Ouvrir le panier et vérifier qu’il contient un seul produit, avec le bon nom et le même prix.
  const cartPage = await productPage.openCart();
  await expect(cartPage.cartItems).toHaveCount(1);
  await expect(cartPage.itemName).toHaveText(productName);
  await expect(cartPage.itemPrice).toHaveText(price);

  // 7. Retirer le produit et vérifier que le panier est vide et que le badge a disparu.
  await cartPage.removeProduct(productName);
  await expect(cartPage.cartItems).toHaveCount(0);
  await expect(cartPage.badge).not.toBeVisible();
});
