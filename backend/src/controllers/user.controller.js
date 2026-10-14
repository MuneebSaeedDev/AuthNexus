
const { getUserById: findUserById, deleteUser } = require("../services/user.service");

const deleteUserController = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await deleteUser({
            id,
            requester: req.user,
        });

        return res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        next(error);
    }
};

const getUserById = async (req, res, next) => {
    try {
        const user = await findUserById(req.params.id);

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUserById,
    deleteUserController,
};
