import { Hono } from "hono";
import { cors } from "hono/cors";
import { PrismaClient, Prisma } from "@prisma/client";
import { HTTPException } from "hono/http-exception";
import { decode, sign, verify } from "hono/jwt";
import { jwt } from "hono/jwt";
import type { JwtVariables } from "hono/jwt";

type Variables = JwtVariables;

const app = new Hono<{ Variables: Variables }>();

const prisma = new PrismaClient();

app.use("/*", cors());

app.use(
  "/protected/*",
  jwt({
    secret: "mySecretKey",
  })
);

// app.get("/protected/account/balance", async (c) => {
//   const payload = c.get('jwtPayload')
//   if (!payload) {
//     throw new HTTPException(401, { message: "Unauthorized" });
//   }
//   const user = await prisma.user.findUnique({
//     where: { id: payload.sub },
//     select: { Account: { select: { balance: true, id: true } } },
//   });

//   return c.json({ data: user });
// });

// app.get("/:userId/account/balance", async (c) => {
//   // get user account balance from url params
//   const { userId } = c.req.param();

//   // create a new user
//   const user = await prisma.user.findUnique({
//     where: { id: userId },
//     select: { Account: { select: { balance: true, id: true } } },
//   });
//   return c.json({ data: user });
// });

app.post("/register", async (c) => {
  try {
    const body = await c.req.json();

    const bcryptHash = await Bun.password.hash(body.password, {
      algorithm: "bcrypt",
      cost: 4, // number between 4-31
    });

    const user = await prisma.user.create({
      data: {
        email: body.email,
        hashedPassword: bcryptHash,
        name: body.name,
        phoneNumber: body.phoneNumber,
      },
    });

    return c.json({ message: `${user.email} created successfully}` });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === "P2002") {
        console.log(
          "There is a unique constraint violation, a new user cannot be created with this email"
        );
        return c.json({ message: "Email already exists" });
      }
    }
  }
});

app.post("/login", async (c) => {
  try {
    const body = await c.req.json();
    const user = await prisma.user.findUnique({
      where: { email: body.email },
      select: { id: true, hashedPassword: true },
    });

    if (!user) {
      return c.json({ message: "User not found" });
    }

    const match = await Bun.password.verify(
      body.password,
      user.hashedPassword,
      "bcrypt"
    );
    if (match) {
      const payload = {
        sub: user.id,
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // Token expires in 60 minutes
      };
      const secret = "mySecretKey";
      const token = await sign(payload, secret);
      return c.json({ message: "Login successful", token: token });
    } else {
      throw new HTTPException(401, { message: "Invalid credentials" });
    }
  } catch (error) {
    throw new HTTPException(401, { message: "Invalid credentials" });
  }
});

app.post("/protected/product", async (c) => {
  const payload = c.get("jwtPayload");
  if (!payload) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }
  const body = await c.req.json();
  const product = await prisma.product.create({
    data: {
      name: body.name,
      description: body.description,
      startPrice: body.startPrice,
      minSellingPrice: body.minSellingPrice,
      minIncrementBid: body.minIncrementBid,
      image: body.image,
      sellerId: body.sellerId || payload.sub,
      seller: { connect: { id: body.sellerId } }
    }
  });
  return c.json({ data: product });
});

app.get("/product/:id", async (c) => {
  const { id } = c.req.param();
  const product = await prisma.product.findUnique({
    where: { id },
    include: { seller: true },
  });
  return c.json({ data: product });
});

app.get("/protected/products", async (c) => {
  const payload = c.get("jwtPayload");
  if (!payload) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }
  const products = await prisma.product.findMany({
    where: { sellerId: payload.sub },
    include: { seller: true },
  });
  return c.json({ data: products});
}); 

app.put("/product/:id", async (c) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const product = await prisma.product.update({
    where: { id },
    data: {
      name: body.name,
      description: body.description,
      startPrice: body.startPrice,
      minSellingPrice: body.minSellingPrice,
      image: body.image,
      sellerId: body.sellerId,
    },
  });
app.delete("/product/:id", async (c) => {
  const { id } = c.req.param();
  const product = await prisma.product.delete({
    where: { id },
  });
  return c.json({ data: product });
});



app.post("/auction", async (c) => {
  const body = await c.req.json();
  const auctionRoom = await prisma.auctionRoom.create({
    data: {
      id: body.id,
      name: body.name,
      description: body.description,
      products: {
        create: [
          {
            id: body.products.id,
            name: body.products.name,
            description: body.products.description,
            startPrice: 0,
            minSellingPrice: 0,
            minIncrementBid: 0,
            startDate: new Date(),
            endDate: new Date(),
            extendTime: 0,
            image: "",
            sellerId: body.products.sellerId
          },
        ],
      },
    },
  });
});

app.get("/auction/:id", async (c) => {
  const { id } = c.req.param();
  const auctionRoom = await prisma.auctionRoom.findUnique({
    where: { id },
    include: { products: true },
  });
  return c.json({ data: auctionRoom });
});
});

export default app;