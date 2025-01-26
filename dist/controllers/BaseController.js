"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
class BaseController {
    handle(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.execute(req, res, next);
            }
            catch (error) {
                console.error(`[BaseController]: Uncaught controller error`);
                console.error(error);
                this.fail(res, 'An unexpected error occurred');
            }
        });
    }
    static jsonResponse(res, code, message) {
        return res.status(code).json({ message });
    }
    ok(res, dto) {
        if (dto) {
            return res.status(200).json(dto);
        }
        return res.sendStatus(200);
    }
    created(res) {
        return res.sendStatus(201);
    }
    clientError(res, message) {
        return BaseController.jsonResponse(res, 400, message || 'Unauthorized');
    }
    unauthorized(res, message) {
        return BaseController.jsonResponse(res, 401, message || 'Unauthorized');
    }
    forbidden(res, message) {
        return BaseController.jsonResponse(res, 403, message || 'Forbidden');
    }
    notFound(res, message) {
        return BaseController.jsonResponse(res, 404, message || 'Not found');
    }
    conflict(res, message) {
        return BaseController.jsonResponse(res, 409, message || 'Conflict');
    }
    fail(res, error) {
        console.error(error);
        return res.status(500).json({
            message: error.toString()
        });
    }
}
exports.BaseController = BaseController;
