const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb')

const {Todo} = require('./../db/todos');
const {app} = require('./../server');

const todos = [
    {
        text: "first todo",
        _id: new ObjectId()
    },
    {
        text: "second todo",
        _id: new ObjectId()
    }
];

beforeEach((done) => {
    Todo.remove({}).then(()=> {
        Todo.insertMany(todos)
        done()
    })
        // .catch(e=>done(e));
});

describe('POST /todos', ()=>{

    it('Should add todo to the database', (done)=>{

        let text = "testing the todos";

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect(res=>{
                expect(res.body.text).toBe(text)
            })
            .end((err, res)=>{

                if(err) return done(err);

                Todo.find({text}).then(todo=>{
                    expect(todo.length).toBe(1);
                    expect(todo[0].text).toBe(text);
                    done();
                }).catch(e=>done(e));

            });
    })

    it('Should not add an invalid todos', (done)=>{
        let text = "testing the todos";

        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res)=>{

                if (err) return done(err);

                Todo.find().then(todo=>{
                    expect(todo.length).toBe(2);
                    done();
                }).catch(e => done(e))
                
            })
    })

});

describe('GEt /todos',()=>{

    it('should get todos', (done)=>{
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res)=>{
                expect(res.body.todos.length).toBe(2)
            })
            .end(done)
    })

})

describe('GEt /todos/:id',()=>{

    it('should return a todo doc', (done)=>{
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 if id does not exist in the database', (done)=>{

        let id = new ObjectId();
        request(app)
            .get(`/todos/${id.toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return 400 for non-object ids', (done)=>{

        request(app)
            .get(`/todos/123`)
            .expect(400)
            .end(done);
    });
})