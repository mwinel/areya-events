## @amari/events

An npm library or package containing ***NATS Streaming Server events middlewares*** abstracted from the **[amari-dmts](https://github.com/Amari618/amari-dmts)** repository to enhance **modularity** and **reusability** across different services and the client.

### Installation

The package can be installed from the npm registry using this command;

```
npm install @amariug/events
```

***The above command will install the latest version of the package.***

To install a particular version of this package, use this command;

```
npm install @amariug/events@<package version>

for example

npm install @amariug/events@1.0.0
```

Alternatively, to update your currently installed version to the latest version, use this command;

```
npm update @amariug/events
```

### Creating a NATS Wrapper

```
import nats, { Stan } from "node-nats-streaming";

// Singleton method.
class NatsWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error("Cannot access NATS client before connecting.");
    }

    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise((resolve, reject) => {
      this.client.on("connect", () => {
        console.log("Connected to NATS");
        resolve();
      });
      this.client.on("error", (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();

```

### Usage of the NATS Wrapper

```
import { natsWrapper } from "./nats-wrapper";

const PORT = process.env.PORT || 3000;

const start = async () => {
  ...
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined.");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined.");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined.");
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL,
    );

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed.");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    ...

  } catch (err) {
    // Throw error for debugging purposes.
    // Dig deep to what exact error is being thrown.
    throw new Error(err);
  }

  app.listen(PORT, () => {
    console.log("\nOrders Service Listening on port %d.", PORT);
  });
};

start();
```

### Sample Order Created event

```
import { Publisher, Subjects, OrderCreatedEvent } from "@amariug/events";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}

```

### Usage of sample Order Created event

```
...
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";

...

const router = express.Router();

router.post(
  ORDERS_API_URL,
  currentUser,
  requireAuth,
  validateRequest,

  async (req: Request, res: Response) => {
    // Todo
    // Retrun meaningful responses.

    const { customerName, emailAddress } = req.body;

    const orderID = randomBytes(4).toString("hex");

    const order = Order.build({
      orderId: orderID,
      customerName,
      emailAddress,
    });

    await order.save();

    await new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      orderId: order.orderId,
      customerName: order.customerName,
      emailAddress: order.emailAddress,
    });

    res.status(201).send(order);
  },
);

export { router as createOrderRouter };
```

### License

[Apache License 2.0](https://github.com/Amari618/amari-events/blob/main/LICENSE)
