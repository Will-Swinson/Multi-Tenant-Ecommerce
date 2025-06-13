import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const reviewsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const product = await ctx.payload.findByID({
        collection: "products",
        depth: 2,
        id: input.productId,
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      const reviewData = await ctx.payload.find({
        collection: "reviews",
        limit: 1,
        where: {
          and: [
            {
              user: {
                equals: ctx.session.user.id,
              },
            },
            {
              product: {
                equals: input.productId,
              },
            },
          ],
        },
      });

      const review = reviewData.docs[0];

      if (!review) {
        return null;
      }
      return review;
    }),
  create: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        rating: z.number().min(1, { message: "Rating is required" }).max(5),
        description: z.string().min(1, { message: "Description is required" }),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const product = await ctx.payload.findByID({
        collection: "products",
        id: input.productId,
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      const existingReviewData = await ctx.payload.find({
        collection: "reviews",
        limit: 1,
        where: {
          and: [
            {
              user: {
                equals: ctx.session.user.id,
              },
            },
            {
              product: {
                equals: input.productId,
              },
            },
          ],
        },
      });

      if (existingReviewData.totalDocs > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You've already created a review for this product",
        });
      }

      const review = await ctx.payload.create({
        collection: "reviews",
        data: {
          user: ctx.session.user.id,
          product: input.productId,
          description: input.description,
          rating: input.rating,
        },
      });

      return review;
    }),
  update: protectedProcedure
    .input(
      z.object({
        reviewId: z.string(),
        rating: z.number().min(1, { message: "Rating is required" }).max(5),
        description: z.string().min(1, { message: "Description is required" }),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const existingReview = await ctx.payload.findByID({
        depth: 0,
        collection: "reviews",
        id: input.reviewId,
      });

      if (!existingReview) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Review not found",
        });
      }

      if (existingReview.user !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not allowed to update this review",
        });
      }

      const updatedReview = await ctx.payload.update({
        collection: "reviews",
        id: input.reviewId,
        data: {
          description: input.description,
          rating: input.rating,
        },
      });

      return updatedReview;
    }),
});
