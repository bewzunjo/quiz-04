import { checkToken } from "../../backendLibs/checkToken";
import { readUsersDB, writeUsersDB } from "../../backendLibs/dbLib";

export default function withdrawRoute(req, res) {
  if (req.method === "PUT") {
    const user = checkToken(req);
    if (!user || user.isAdmin)
      return res
        .status(403)
        .json({ ok: false, message: "You do not have permission to withdraw" });

    const amount = req.body.amount;
    //validate body
    if (typeof amount !== "number")
      return res.status(400).json({ ok: false, message: "Invalid amount" });

    //check if amount < 1
    if (amount < 0)
      return res
        .status(400)
        .json({ ok: false, message: "Amount must be greater than 0" });

    //find and update money in DB (if user has enough money)

    const users = readUsersDB();
    const userIdx = users.findIndex((x) => x.username === user.username);
    if (users[userIdx].money < amount)
      return res
        .status(400)
        .json({ ok: false, message: "You do not has enough money" });
    //please ignore the grammatical error

    users[userIdx].money -= amount;
    writeUsersDB(users);

    //return response
    return res.json({ ok: true, money: users[userIdx].money });
  } else {
    return res.status(400).json({ ok: false, message: "Invalid HTTP Method" });
  }
}