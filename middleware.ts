import { authMiddleware, clerkClient, redirectToSignIn } from "@clerk/nextjs";

import { NextResponse } from "next/server";

// const { signOut } = useClerk();
// const router = useRouter();

export default authMiddleware({
  beforeAuth: (req) => {
    let hostURL;
    if (process.env.NODE_ENV === "production") {
      hostURL = `${
        req.nextUrl.protocol +
        "//" +
        req.nextUrl.hostname +
        req.nextUrl.pathname
      }`;
    } else {
      hostURL = req.url;
    }

    const reqHeaders = new Headers(req.headers);
    reqHeaders.set("x-url", hostURL);
    reqHeaders.set("x-pathname", req.nextUrl.pathname);

    return NextResponse.next({
      request: {
        headers: reqHeaders,
      },
    });
  },
  afterAuth: async (auth, req, evt) => {
    let hostURL;
    if (process.env.NODE_ENV === "production") {
      hostURL = `${
        req.nextUrl.protocol +
        "//" +
        req.nextUrl.hostname +
        req.nextUrl.pathname
      }`;
    } else {
      hostURL = req.url;
    }
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.next();
    }
    if (!auth.userId && !auth.isPublicRoute) {
      // Handle users who aren't authenticated
      return redirectToSignIn({ returnBackUrl: hostURL });
    }
    // If the user is logged in and trying to access a protected route, allow them to access route
    // if (auth.userId && !auth.isPublicRoute) {
    if (auth.userId) {
      const user = await clerkClient.users.getUser(auth.userId);
      const userData = user.privateMetadata;
      //   console.log(userData);

      if (userData.role === "Admin" || userData.role === "Staff") {
        // console.log("pass");
        return NextResponse.next();
      } else {
        const newURL = new URL("/unauthorized", hostURL);
        return NextResponse.rewrite(newURL);
      }
    }
  },
  publicRoutes: ["/", "/quote(.*)", "/quote-old(.*)"], // unprotected pages
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
