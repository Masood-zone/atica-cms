"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const user_service_1 = require("../../services/user-service");
const catch_async_1 = require("../../utils/catch-async");
exports.userController = {
    getAll: (0, catch_async_1.catchAsync)(async (req, res) => {
        const users = await user_service_1.userService.getAllUsers();
        res.json(users);
    }),
    getById: (0, catch_async_1.catchAsync)(async (req, res) => {
        const id = Number.parseInt(req.params.id);
        const user = await user_service_1.userService.getUserById(id);
        res.json(user);
    }),
    update: (0, catch_async_1.catchAsync)(async (req, res) => {
        const id = Number.parseInt(req.params.id);
        const updatedUser = await user_service_1.userService.updateUser(id, req.body);
        const { password } = updatedUser, userWithoutPassword = __rest(updatedUser, ["password"]);
        return res.json(userWithoutPassword);
    }),
    delete: (0, catch_async_1.catchAsync)(async (req, res) => {
        const id = Number.parseInt(req.params.id);
        await user_service_1.userService.deleteUser(id);
        res.status(204).send();
    }),
};
//# sourceMappingURL=user-controller.js.map