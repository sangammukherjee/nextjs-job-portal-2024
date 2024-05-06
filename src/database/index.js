const { default: mongoose } = require("mongoose");

const connectToDB = async () => {
  const connectionURL =
    "mongodb+srv://sangammukherjee2022:sangam2024@cluster0.nvranpn.mongodb.net/";

  mongoose
    .connect(connectionURL)
    .then(() => console.log("jon board database connection is successfull"))
    .catch((error) => console.log(error));
};

export default connectToDB;
