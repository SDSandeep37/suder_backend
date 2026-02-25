import express from "express";
import { getUserById, createUser, updateUser, deleteUser,getAllUsers } from "../controllers/userController.js";

const router = express.Router();
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
export default router;