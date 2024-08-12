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

app.post("/register", async (c) => {
  try {
    const body = await c.req.json();
    // console.log(body);
    const bcryptHash = await Bun.password.hash(body.password, {
      algorithm: "bcrypt",
      cost: 4, 
    });

    const user = await prisma.user.create({
      data: {
        email: body.email,
        hashedPassword: bcryptHash,
        name: body.name,
      },
    });
    console.log(user);
    return c.json({ message: `${user.email} created successfully` });
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
        exp: Math.floor(Date.now() / 1000) + 60 * 720, // Token expires in 720 minutes
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
  try {
    const payload = c.get("jwtPayload");
    if (!payload) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }
    const body = await c.req.json();
    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        image: body.image,
        sellerId: payload.sub,
      },
    });
    console.log(product);
    return c.json({ data: product });
  } catch (error) {
    console.log(error);
  }
});


// app.post("/protected/products", async (c) => {
//   const payload = c.get("jwtPayload");
//   if (!payload) {
//     throw new HTTPException(401, { message: "Unauthorized" });
//   }
//   const requestData = await c.req.json();
//   if (!Array.isArray(requestData)) {
//     throw new HTTPException(404, { message: "Not Found" });
//   }
//   const createdProducts: any[] = [];
//   for (const product of requestData) {
//     const createdProduct = await prisma.product.create({
//       data: {
//         name: product.name,
//         description: product.description,
//         image: product.image,
//         sellerId: payload.sub,
//       },
//     });
//     createdProducts.push(createdProduct);
//   }
//   return c.json({ data: createdProducts });
// });

// app.post("/protected/products", async (c) => {
//   try {
//     const payload = c.get("jwtPayload");
//     if (!payload) {
//       throw new HTTPException(401, { message: "Unauthorized" });
//     }
//     const requestData = await c.req.json();
//     if (!Array.isArray(requestData)) {
//       throw new HTTPException(404, { message: "Not Found" });
//     }
//     const body = await c.req.json();
//     const product = await prisma.product.createMany({
//       data: {
//         id: body.id,
//         name: body.name,
//         description: body.description,
//         image: body.image,
//         sellerId: payload.sub,
//       },
//     });
//     console.log(product);
//     return c.json({ data: product });
//   } catch (error) {
//     console.log(error);
//   }
// });


app.get("/product/:id", async (c) => {
  const { id } = c.req.param();
  const product = await prisma.product.findUnique({
    where: { id },
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
  });
  return c.json({ data: products });
});

app.put("/protected/product/:id", async (c) => {
  const payload = c.get("jwtPayload");
  console.log(payload);
  if (!payload) {
    console.log("Unauthorized");
    throw new HTTPException(401, { message: "Unauthorized" });
  }
  const { id } = c.req.param();
  const body = await c.req.json();

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    throw new HTTPException(404, { message: "Product not found" });
  }
  if (payload.sub === product.sellerId) {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        image: body.image,
      },
    });
    return c.json({ data: updatedProduct });
  } else if (payload.sub !== product.sellerId) {
    throw new HTTPException(403, { message: "Forbidden" });
  }
});

app.delete("/protected/product/:id", async (c) => {
  const payload = c.get("jwtPayload");
  if (!payload) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }
  const { id } = c.req.param();

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    throw new HTTPException(404, { message: "Product not found" });
  }
  if (payload.sub === product.sellerId) {
    const deletedProduct = await prisma.product.delete({ where: { id } });
    return c.json({ data: deletedProduct });
  } else if (payload.sub != product.sellerId) {
    throw new HTTPException(403, { message: "Forbidden" });
  }
});

// app.post("/protected/auction", async (c) => {
//   const payload = c.get("jwtPayload");
//   if (!payload) {
//     throw new HTTPException(401, { message: "Unauthorized" });
//   }
//   const body = await c.req.json();
//   const auctionRoom = await prisma.auctionRoom.create({
//     data: {
//       name: body.name,
//       itemDescription: body.ItemDescription,
//       products: { connect: { id: body.product } },
//       sellerId: payload.sub,
//     },
//   });
//   return c.json({ data: auctionRoom });
// });

app.post("/protected/auction/create", async (c) => {
  try {
    const payload = c.get("jwtPayload");
    const body = await c.req.json();

    if (!payload) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }
    const auctionRoom = await prisma.auctionRoom.create({
      data: {
        name: body.name,
        itemName: body.itemName,
        itemDescription: body.itemDescription,
        itemStartingPrice: body.itemStartingPrice,
        itemMinSellingPrice: body.itemMinSellingPrice,
        itemMinIncrementBid: body.itemMinIncrementBid,
        startTime: body.startTime,
        endTime: body.endTime,
        owner: { connect: { id: payload.sub}},
        products: { connect: { id: body.productId } },
      },
    });
    console.log(auctionRoom);
    return c.json({ data: auctionRoom });
  } catch (error) {
    console.log(error);
  }
});

app.get("/auctions", async (c) => {
  const auctionRoom = await prisma.auctionRoom.findMany();
  return c.json({ data: auctionRoom });
});

// app.put("/protected/auction/:id", async (c) => {
//   const payload = c.get("jwtPayload");
//   if (!payload) {
//     throw new HTTPException(401, { message: "Unauthorized" });
//   }
//   const { id } = c.req.param();
//   const body = await c.req.json();

//   const auctionRoom = await prisma.auctionRoom.findUnique({ where: { id } });
//   if (!auctionRoom) {
//     throw new HTTPException(404, { message: "Auction Room not found" });
//   }
//   if (payload.sub === auctionRoom.userId) {
//     const updatedAuctionRoom = await prisma.auctionRoom.update({
//       where: { id },
//       data: {
//         name: body.name,
//         itemDescription: body.description,
//       },
//     });
//     return c.json({ data: updatedAuctionRoom });
//   } else {
//     throw new HTTPException(403, { message: "Forbidden" });
//   }
// });

app.put("/protected/auction/:id", async (c) => {
  const payload = c.get("jwtPayload");
  if (!payload) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  const { id } = c.req.param();
  const body = await c.req.json();

  try {
    // Fetch the auction room
    const auctionRoom = await prisma.auctionRoom.findUnique({
      where: { id },
    });

    if (!auctionRoom) {
      throw new HTTPException(404, { message: "Auction Room not found" });
    }

    // Check if the user is the owner of the auction room
    if (auctionRoom.userId !== payload.sub) {
      throw new HTTPException(403, {
        message: "Forbidden: You do not own this auction room",
      });
    }

    // Proceed to update the auction room
    const updatedAuctionRoom = await prisma.auctionRoom.update({
      where: { id },
      data: {
        name: body.name,
        itemName: body.itemName,
        itemDescription: body.itemDescription,
        itemStartingPrice: body.itemStartingPrice,
        itemMinSellingPrice: body.itemMinSellingPrice,
        itemMinIncrementBid: body.itemMinIncrementBid,
        startTime: body.startTime,
        endTime: body.endTime,
      },
    });

    return c.json({ data: updatedAuctionRoom });
  } catch (error) {
    console.error("Error updating auction room:", error);
    throw new HTTPException(500, { message: "Internal server error" });
  }
});

// app.delete("/protected/auction/:id", async (c) => {
//   const payload = c.get("jwtPayload");
//   if (!payload) {
//     throw new HTTPException(401, { message: "Unauthorized" });
//   }
//   const { id } = c.req.param();

//   const auctionRoom = await prisma.auctionRoom.findUnique({ where: { id } });
//   if (!auctionRoom) {
//     throw new HTTPException(404, { message: "Auction Room not found" });
//   }
//   if (payload.sub === auctionRoom.userId) {
//     const deletedAuctionRoom = await prisma.auctionRoom.delete({ where: { id } });
//     return c.json({ data: deletedAuctionRoom });
//   } else {
//     throw new HTTPException(403, { message: "Forbidden" });
//   }
// });

app.delete("/protected/auction/:id", async (c) => {
  const payload = c.get("jwtPayload");
  if (!payload) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  const { id } = c.req.param();

  try {
    // Fetch the auction room
    const auctionRoom = await prisma.auctionRoom.findUnique({
      where: { id },
    });

    if (!auctionRoom) {
      throw new HTTPException(404, { message: "Auction Room not found" });
    }

    // Checking if the user is the owner of the auction room
    if (auctionRoom.userId !== payload.sub) {
      throw new HTTPException(403, {
        message: "Forbidden: You do not own this auction room",
      });
    }

    // Proceed to delete the auction room
    const deletedAuctionRoom = await prisma.auctionRoom.delete({
      where: { id },
    });

    return c.json({ data: deletedAuctionRoom });
  } catch (error) {
    console.error("Error deleting auction room:", error);
    throw new HTTPException(500, { message: "Internal server error" });
  }
});

export default app;
