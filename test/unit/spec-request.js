import test from 'ava';
import Request from '../../src/request';

test('Request instantiation without options raise an error with "options.uri is a required argument"', (t) => {
    const error = t.throws(() => {
        new Request()
    }, Error);

    t.is(error.message, 'options.uri is a required argument');
});

test('Request return as a promise', async (t) => {
    const request = new Request({url: 'https://www.example.com/'}),
          res = await request.promise();

    t.truthy(res.body);
});


test('Request promise then and catch functions', async (t) => {
    const res = await new Request({url: 'https://www.example.com/'});

    t.truthy(res.body);
});

test.cb('Request raise error when try get a promise when response already receiving', (t) => {

    const request = new Request({url: 'https://www.example.com/'});

    setTimeout(() => {
        request.promise().catch((err) => {
            const error = t.throws(() => {
                throw err;
            }, Error);

            t.is(error.message, 'Response already receiving can\'t transform to a promise');
            t.end();
        });
    }, 1000);
});


test.cb('Request transform with function', (t) => {
    const request = new Request({url: 'https://www.example.com/', json: true});

    request.transform(function (chunk, enc, done) {
        this.push(chunk.toString().replace('<title>Example Domain</title>', '<title>Example Domain Modified</title>'));
        done();
    }).on('data', (data) => {
        t.regex(data.toString(), /Example Domain Modified/);
    });

    request.on('end', t.end);
});
