import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import { DEFAULT_PAGE_LIMIT } from "@/constants";

export const tenantsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_PAGE_LIMIT),
        category: z.string().nullable().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
        tags: z.array(z.string()).nullable().optional(),
      }),
    )
    .query(async () => {
      return { hello: "world" };
    }),
});
