const { calculateRmr, getChart, getBMI } = require("../modules/rmr.js");
const {
  pushDataToDatabase,
  getProperty,
  checkIfExist,
} = require("../../database/usersAuth");
const { getConnectedUser, getUserId } = require("./users");

const getRmr = async (req, res) => {
  console.log(await checkIfExist({ user_id: getUserId() }, "userInfo"));
  if (!getConnectedUser()) {
    res.redirect("/users/login");
    return;
  }
  if (!(await checkIfExist({ user_id: getUserId() }, "userInfo"))) {
    console.log("FORM TRUE");
    res.render("../views/rmr.ejs", { form: true });
    return;
  }
  const rmr = (
    await getProperty("RMR", { user_id: getUserId() }, "userInfo")
  )[0].RMR;
  const bmi = (
    await getProperty("BMI", { user_id: getUserId() }, "userInfo")
  )[0].BMI;
  res.render("../views/rmr.ejs", { rmr, bmi, form: false });
};

const postRmr = async (req, res) => {
  if (!(await checkIfExist({ user_id: getUserId() }, "userInfo"))) {
    const rmr = calculateRmr(req.body);
    const bmi = getBMI(req.body);
    const userInfo = {
      ...req.body,
      RMR: rmr,
      user_id: getUserId(),
      BMI: Number(bmi),
    };
    pushDataToDatabase(userInfo, "userInfo");
    res.render("../views/rmr.ejs", { rmr, bmi, form: false });
    return;
  }
};

module.exports = { getRmr, postRmr };
