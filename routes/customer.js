const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const customerRoutes = (fastify, option, done) => {
  fastify.get("/", async (req, replay) => {
    try {
      const customer = await prisma.customer.findMany();
      replay.send({ customer: customer });
    } catch (error) {
      replay.send("error " + error.message);
    }
  });

  fastify.post("/", async (req, replay) => {
    try {
      const { name, email, balance } = req.body;
      if (!name || !email || !balance) {
        replay.send({
          success: false,
          msg: "Please fill the field",
        });
      } else {
        const customers = {
          name,
          email,
          balance,
        };

        const result = await prisma.customer.create({
          data: customers,
        });
        if (result) {
          replay.send({
            success: true,
            msg: "Customer create successfully",
          });
        } else {
          replay.send({
            success: false,
            msg: "Some problem",
          });
        }
      }
    } catch (error) {
      replay.send("error " + error.message);
    }
  });

  fastify.delete("/:id", async (req, replay) => {
    try {
      const id = req.params.id;
      const customer = await prisma.customer.delete({ 
        where: {id:Number(id) } });
      if (customer) {
        replay.send({
          success: true,
          customer: customer,
        });
      } else {
        replay.send({
          success: false,
          msg: "Some problem",
        });
      }
    } catch (error) {
      replay, send("error " + error.message);
    }
  });

  fastify.patch("/:id", async (req, replay) => {
    try {
      console.log("mi put", req.body);
      const idCustomer = req.params.id;
      const id = parseInt(idCustomer);
      const { name, email, balance } = req.body;

      if (!name || !email || !balance) {
        replay.send({
          success: false,
          msg: "Please fill the field",
        });
      } else {
        const customer = await prisma.customer.update({
          where: { id },
          data: {name,balance},
        });

        if (customer) {
          replay.send({
            success: true,
            msg: "Customer Update successfully",
          });
        } else {
          replay.send({
            success: false,
            msg: "Please fill the field",
          });
        }
      }
    } catch (error) {
      replay.send("error " + error.message);
    }
  });
  done();
};

module.exports = customerRoutes;
