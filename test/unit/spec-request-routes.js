import test from 'ava';
import RequestRouter from '../../src/request-routes';

test('Request Routes', async (t) => {
    const client = RequestRouter();
    client.use('/:test?', (req) => {
        req.next();
    });

    const res = await client.request({url: 'https://www.example.com/test'});
    t.truthy(res.body);
});
