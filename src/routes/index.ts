import express from "express";
import { AccountController } from "../controllers/AccountController";

const router = express.Router();

const accountController = new AccountController();

router.post("/account/create", (req, res) => accountController.createAccount(req,res));
router.post("/account/login", (req, res) => accountController.login(req,res));
router.get("/account", (req, res) => accountController.getAccount(req,res));
router.post("/account/deposit", (req, res) => accountController.deposit(req,res));
router.post("/account/withdraw", (req, res) => accountController.withdraw(req,res));
router.post("/account/transfer", (req, res) => accountController.transfer(req,res));

export default router;
