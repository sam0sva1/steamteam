import Router from 'koa-router';

import { commonList } from '../controllers';


const router = new Router({
    prefix: '/games',
});

router.get('/common', commonList);

export default router;
