const expect = require('expect');
const request = require('supertest');

const {Todo} = require('./../db/todos');
const {app} = require('./../server');

const todos = [
    {text: "first todo"},
    {text: "second todo"}
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