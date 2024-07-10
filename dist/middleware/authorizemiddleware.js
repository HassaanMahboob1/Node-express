"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.SECRET_KEY = void 0;
exports.SECRET_KEY = "abcd";
const authorize = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.roles)) {
            return res.status(403).json({
                message: "Forbidden. You do not have access to this resource.",
            });
        }
        next();
    };
};
exports.authorize = authorize;
