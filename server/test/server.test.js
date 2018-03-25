const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb')

const {Todo} = require('./../db/todos');
const {User} = require('./../db/users');
const {app} = require('./../server');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

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
});

describe('DELETE /todos/:id', ()=>{

    it('should successfully remove a todo', (done)=>{

        request(app)
            .delete(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end((err, res)=>{

                if (err) return done(err);
                
                Todo.findById(todos[0]._id.toHexString()).then((todo)=>{
                    expect(todo).toNotExist;
                    done();
                }).catch(e => done(e))
            })

    })

    it('should return a 404 for a non existing id in database', (done)=>{

        let id = new ObjectId().toHexString();

        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done)

    })

    it('should return a 400 for an invalid id', (done)=>{

        request(app)
            .delete(`/todos/123`)
            .expect(400)
            .end(done)

    })

});

describe("PATCH /todos/:id", ()=>{

    it('should update the todo', (done)=>{
        
        let text = "something awesome"

        request(app)
            .patch(`/todos/${todos[0]._id.toHexString()}`)
            .send({text, completed: true})
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(typeof(res.body.todo.completedAt)).toBe('number')
            })
            .end(done)

    });

    it('should clear completedAt when todo is not completed', (done)=>{

        let text = "something awesome Luis";

        request(app)
            .patch(`/todos/${todos[1]._id.toHexString()}`)
            .send({completed:false, text})
            .expect(200)
            .expect(res=>{
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBe(null);
            })
            .end(done)
    })

})


describe("GET /users/me", ()=>{

    it('should return user if authenticated', (done)=>{
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res=>{
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done)
    })

    it('should return 401 if not authenticated', (done)=>{

        request(app)
            .get('/users/me')
            .expect(401)
            .expect(res =>{
                expect(res.body).toEqual({})
            })
            .end(done)
    })
    

})

describe("POST /users", ()=>{

    it('should create a user in the database', (done)=>{

        var email = "testexample@test.com";
        var password = "password";

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect(res=>{
                expect(res.headders['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err)=>{
                if(err) return done();

                User.findOne({email}).then((res)=>{
                    expect(user).toExist;
                    expect(res.body.password).toNotBe(password);
                    done();
                }).catch(e=> done(e))
                
            });
    })

    it('should return error if email or password are invalid', (done)=>{

        request(app)
            .post('/users')
            .send({email:'abc', password:'123'})
            .expect(400)
            .end(done);
    })
    
    it('should not save the user if email exist', (done)=>{

        request(app)
            .post('/users')
            .send({email:'test@email.com', password:'12345667'})
            .expect(400)
            .end(done);
    })
});

describe('POST /users/login', ()=>{

    it('should return user token', (done)=>{
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email, 
                password: users[1].password
            })
            .expect(200)
            .expect(res=>{
                expect(res.body._id).toBe(users[1]._id.toHexString());
                expect(res.headers['x-auth']).toExist();
            })
            .end((err, res)=>{
                if (err) return done();

                User.findById(users[1]._id).then((user)=>{
                    expect(user.tokens[0]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch(e => done(e));
               
            });

    });

    it('should reject invalid login', (done)=>{

        request(app)
            .post('/users/login')
            .send({
                email: 'user@user.com', 
                password: 'pass123'
            })            
            .expect(res=>{;
                expect(res.headers['x-auth']).toNotExist;
            })
            .expect(400)
            .end(done)

    });

})