import slugify from "slugify";

export const createBookSlug = (title) => {
  return slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });
};

export const createCategorySlug = (name) => {
  return slugify(name, {
    lower: true,
    strict: true,
    trim: true,
  });
};
