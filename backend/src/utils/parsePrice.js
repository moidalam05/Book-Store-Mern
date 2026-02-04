// utils/parsePrice.js
export const parsePrice = (body) => {
  let price;

  // Case 1: multipart/form-data → price as JSON string
  if (typeof body.price === "string") {
    price = JSON.parse(body.price);
  }

  // Case 2: application/json → price as object
  else if (typeof body.price === "object" && body.price !== null) {
    price = body.price;
  }

  // Case 3: price sent as separate fields
  else if (
    body.original !== undefined &&
    body.discounted !== undefined
  ) {
    price = {
      original: Number(body.original),
      discounted: Number(body.discounted),
    };
  } else {
    throw new Error("Invalid price format");
  }

  // Normalize numbers
  price.original = Number(price.original);
  price.discounted = Number(price.discounted);

  if (
    Number.isNaN(price.original) ||
    Number.isNaN(price.discounted)
  ) {
    throw new Error("Price must be a number");
  }

  if (price.original < 0 || price.discounted < 0) {
    throw new Error("Price cannot be negative");
  }

  if (price.discounted > price.original) {
    throw new Error("Discounted price cannot exceed original price");
  }

  return price;
};
