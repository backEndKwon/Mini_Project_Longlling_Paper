const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const { Op } = require('sequelize');
const { Posts, Users } = require('../models');

//내 롱링페이퍼 삭제 : DELETE -> /posts/:postId
router.delete('/:postId', authMiddleware, async (req, res) => {
    try {
        const { userId } = res.locals.user;
        const { postId } = req.params;

        //롱링페이퍼 유효성 검증
        const post = await Posts.findOne({ where: { postId } });
        if (!post) {
            return res
                .status(403)
                .json({ errorMessage: '롱링페이퍼가 존재하지 않습니다.' });
        }
        //롱링페이퍼 권한 확인 후 삭제
        if (userId === post.UserId) {
            await Posts.destroy({
                where: {
                    [Op.and]: [{ postId }, { UserId: userId }],
                },
            });
            return res
                .status(200)
                .json({ message: '내 롱링페이퍼를 삭제하였습니다.' });
        } else {
            return res
                .status(403)
                .json({ message: '롱링페이퍼를 삭제할 권한이 없습니다.' });
        }
    } catch (err) {
        console.log(err);
        return res
            .status(400)
            .send({ errorMessage: '롱링페이퍼 삭제에 실패하였습니다.' });
    }
});

module.exports = router;
