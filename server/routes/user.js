import Router from 'koa-router';

import { userDataByName } from '../controllers';

const router = new Router({
    prefix: '/user',
});

router.get('/:name', userDataByName);

export default router;