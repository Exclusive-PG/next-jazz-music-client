import { createTRPCRouter } from "~/server/api/trpc";

import { trackRouter } from "./routers/track";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  tracks: trackRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
