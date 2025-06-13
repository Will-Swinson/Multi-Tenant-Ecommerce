import { getPayload } from "payload";
import config from "@payload-config";
import { stripe } from "./lib/stripe";
const categories = [
  { name: "All", slug: "all" },

  {
    name: "Photography",
    color: "#E91E63",
    slug: "photography",
    subcategories: [
      { name: "Portrait", slug: "portrait" },
      { name: "Landscape", slug: "landscape" },
      { name: "Editing", slug: "editing" },
      { name: "Lighting", slug: "lighting" },
    ],
  },
  {
    name: "Music",
    color: "#9C27B0",
    slug: "music",
    subcategories: [
      { name: "Instruments", slug: "instruments" },
      { name: "Music Theory", slug: "music-theory" },
      { name: "Production", slug: "production" },
      { name: "Songwriting", slug: "songwriting" },
    ],
  },
  {
    name: "Drawing & Painting",
    color: "#3F51B5",
    slug: "drawing-painting",
    subcategories: [
      { name: "Sketching", slug: "sketching" },
      { name: "Watercolor", slug: "watercolor" },
      { name: "Oil Painting", slug: "oil-painting" },
      { name: "Digital Art", slug: "digital-art" },
    ],
  },
  {
    name: "Design",
    color: "#00BCD4",
    slug: "design",
    subcategories: [
      { name: "Graphic Design", slug: "graphic-design" },
      { name: "UI/UX", slug: "ui-ux" },
      { name: "Product Design", slug: "product-design" },
      { name: "Typography", slug: "typography" },
    ],
  },
  {
    name: "Fitness & Health",
    color: "#4CAF50",
    slug: "fitness-health",
    subcategories: [
      { name: "Exercise", slug: "exercise" },
      { name: "Nutrition", slug: "nutrition" },
      { name: "Wellness", slug: "wellness" },
      { name: "Mental Health", slug: "mental-health" },
    ],
  },
  {
    name: "Self Improvement",
    color: "#FFC107",
    slug: "self-improvement",
    subcategories: [
      { name: "Productivity", slug: "productivity" },
      { name: "Confidence", slug: "confidence" },
      { name: "Mindfulness", slug: "mindfulness" },
      { name: "Goal Setting", slug: "goal-setting" },
    ],
  },
  {
    name: "Education",
    color: "#FF9800",
    slug: "education",
    subcategories: [
      { name: "STEM", slug: "stem" },
      { name: "Languages", slug: "languages" },
      { name: "History", slug: "history" },
      { name: "Test Prep", slug: "test-prep" },
    ],
  },
  {
    name: "Other",
    color: "#795548",
    slug: "other",
    subcategories: [
      { name: "Uncategorized", slug: "uncategorized" },
      { name: "Experimental", slug: "experimental" },
      { name: "Miscellaneous", slug: "miscellaneous" },
    ],
  },
  {
    name: "Writing & Publishing",
    color: "#607D8B",
    slug: "writing-publishing",
    subcategories: [
      { name: "Creative Writing", slug: "creative-writing" },
      { name: "Copywriting", slug: "copywriting" },
      { name: "Publishing", slug: "publishing" },
      { name: "Blogging", slug: "blogging" },
    ],
  },
  {
    name: "Software Development",
    color: "#2196F3",
    slug: "software-development",
    subcategories: [
      { name: "Web Development", slug: "web-development" },
      { name: "Mobile Apps", slug: "mobile-apps" },
      { name: "Game Development", slug: "game-development" },
      { name: "DevOps", slug: "devops" },
    ],
  },
];

const seed = async () => {
  const payload = await getPayload({ config });

  const adminStripeAccount = await stripe.accounts.create({});

  const adminTenant = await payload.create({
    collection: "tenants",
    data: {
      name: "admin",
      slug: "admin",
      stripeAccountId: adminStripeAccount.id,
    },
  });

  await payload.create({
    collection: "users",
    data: {
      email: "demo@email.com",
      password: "123",
      roles: ["super-admin"],
      username: "admin",
      tenants: [
        {
          tenant: adminTenant.id,
        },
      ],
    },
  });

  for (const category of categories) {
    const parentCategory = await payload.create({
      collection: "categories",
      data: {
        name: category.name,
        slug: category.slug,
        color: category.color,
        parent: null,
      },
    });

    for (const subCategory of category.subcategories || []) {
      await payload.create({
        collection: "categories",
        data: {
          name: subCategory.name,
          slug: subCategory.slug,
          parent: parentCategory.id,
        },
      });
    }
  }
};

await seed();

process.exit(0);
