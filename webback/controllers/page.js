const Restaurant = require('../models/restaurant');
const User = require('../models/user');
const Review = require('../models/review');

exports.renderProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const reviews = await Review.findAll({
            where: { userId }, // userId가 현재 로그인한 사용자와 일치하는 리뷰만 조회
            include: [
                {
                    model: Restaurant,
                    as: 'restaurant',
                }
            ],
            order: [['createdAt', 'DESC']], // 'createdAt'을 기준으로 내림차순
        });
        console.log(reviews);
        res.render('profile', {
            title: '내 정보 - 동국요리사',
            reviews: reviews, // 조회된 리뷰 데이터를 템플릿에 전달
            user: req.user
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('리뷰 데이터를 불러오는 데 실패했습니다.');
    }
};

exports.renderJoin =(req, res)=>{
    res.render('join', {title: '회원가입 - 동국요리사'});
};

exports.renderMain =(req, res,next)=>{
    const twits = [];
    res.render('loading', {title: '동국요리사', twits});
};
exports.renderLogin =(req, res,next)=>{
    res.render('login', {title: '로그인'});
};

exports.followRestaurant = async (req, res,next) => {
    
    
    try {
        const user = await User.findOne({where:{id:req.user.id}});
        const restaurantId = parseInt(req.params.restaurantId, 10);

        if (user) {
            await user.addFollowing(restaurantId);
            res.send('해당 음식점을 찜했습니다.');
        }else {
            res.status(404).send('사용자가 확인되지 않습니다.');
        } 
    }catch(error){
            console.error(error);
            next(error);
    }
    
};


exports.unFollowRestaurant = async (req, res,next) => {
    
    
    try {
        const user = await User.findOne({where:{id:req.user.id}});
        const restaurantId = parseInt(req.params.restaurantId, 10);

        if (user) {
            await user.removeFollowing(restaurantId);
            res.send('해당 음식점을 찜 취소했습니다.');
        }else {
            res.status(404).send('사용자가 확인되지 않습니다.');
        } 
    }catch(error){
            console.error(error);
            next(error);
    }
    
};
