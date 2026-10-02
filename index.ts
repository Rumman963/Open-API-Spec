import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";

const app = new OpenAPIHono();

const SignUpInput = z
  .object({
    username: z.string().min(3).max(20),
    password: z.string().min(6),
  })
  .openapi("Sign up input schema");

const SignUpOutput = z
  .object({
    message: z.string(),
  })
  .openapi("Sign up output schema");

const Signuproute = createRoute({
  method: "post",
  path: "/signup",
  request: {
    body: {
      content: {
        "application/json": {
          schema: SignUpInput,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SignUpOutput,
        },
      },
      description: "Sign up route",
    },
  },
});

app.openapi(Signuproute, (c) => {
  const { username, password } = c.req.valid("json");
  return c.json({
    message: "User created successfully",
  });
});

app.doc("/docs", {
  openapi: "3.0.0",
  info: {
    title: "My API",
    version: "1.0.0",
  },
});


//swagger Ui docs
app.get("/ui", swaggerUI({ url: "/docs" }));

export default app;