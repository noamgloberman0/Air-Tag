import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';

let server: any;
let accessToken: string;
let refreshToken: string;

beforeAll(async () => {
  server = app.listen(process.env.PORT, () => {
    mongoose.connect(process.env.DATABASE_URL!)
      .then(() => console.log('MongoDB connected'))
      .catch(err => console.error('MongoDB connection error:', err));
  });

  // Register and login to get access token
  try {
    await request(app).post('/auth/register').send({
      username: "testuser",
      fullname: "Test User",
      password: "password123",
      email: "testuser@example.com"
    });
  } catch (error) {
    console.error('User registration error:', error);
  }

  const loginResponse = await request(app).post('/auth/login').send({
    username: "testuser",
    password: "password123"
  });
  accessToken = loginResponse.body.accessToken;
  refreshToken = loginResponse.body.refreshToken;
}, 30000);

afterAll((done) => {
  mongoose.connection.close();
  server.close(() => {
    done();
  });
});

describe('Auth API Tests', () => {
  test('Test user registration', async () => {
    const response = await request(app).post('/auth/register').send({
      username: "newuser",
      fullname: "New User",
      password: "newpassword",
      email: "newuser@example.com"
    });
    if (response.status === 500) {
      console.error('User registration error:', response.body.error);
    }
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
  });

  test('Test user login', async () => {
    const response = await request(app).post('/auth/login').send({
      username: "newuser",
      password: "newpassword"
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
  });

  test('Test user logout', async () => {
    const response = await request(app)
      .post('/auth/logout')
      .set('Authorization', `JWT ${accessToken}`)
      .send({ token: refreshToken });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Logged out successfully');
  });

  test('Test refresh token', async () => {
    const response = await request(app)
      .post('/auth/refresh-token')
      .set('Authorization', `JWT ${refreshToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
  });
});

describe('Post API Tests', () => {
  const post = {
    sender: "Unittest",
    message: "This is the content of the post",
    likes: 0
  };

  test('Test post create', async () => {
    const createResponse = await request(app)
      .post('/post')
      .set('Authorization', `JWT ${accessToken}`)
      .send(post);
    expect(createResponse.status).toBe(201);
    expect(createResponse.body.sender).toBe(post.sender);
    expect(createResponse.body.message).toBe(post.message);
    expect(createResponse.body.likes).toBe(post.likes);
  });

  test('Test post get', async () => {
    const getAllPostsResponse = await request(app)
      .get('/post')
      .set('Authorization', `JWT ${accessToken}`);
    expect(getAllPostsResponse.status).toBe(200);
    expect(getAllPostsResponse.body.length).toBeGreaterThan(0);
  });

  test('Test post get by sender, id and update', async () => {
    const bySenderResponse = await request(app)
      .get(`/post/sender?sender=${post.sender}`)
      .set('Authorization', `JWT ${accessToken}`);
    expect(bySenderResponse.status).toBe(200);
    expect(bySenderResponse.body.length).toBeGreaterThan(0);

    const post_id = bySenderResponse.body[0]._id;
    const updatedPost = {
      message: "Updated message",
      likes: 1
    };

    const updateResponse = await request(app)
      .put(`/post/${post_id}`)
      .set('Authorization', `JWT ${accessToken}`)
      .send(updatedPost);
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.message).toBe(updatedPost.message);
    expect(updateResponse.body.likes).toBe(updatedPost.likes);

    const byIDResponse = await request(app)
      .get(`/post/id/${post_id}`)
      .set('Authorization', `JWT ${accessToken}`);
    expect(byIDResponse.status).toBe(200);
    expect(byIDResponse.body.message).toBe(updatedPost.message);

    await mongoose.connection.db?.collection('posts').deleteMany({ sender: post.sender });
  });
});

describe('Comment API Tests', () => {
  const comment = {
    sender: "Unittest",
    message: "This is the content of the comment",
    post: "Unittest"
  };

  test('Test comment create', async () => {
    const createResponse = await request(app)
      .post('/comment')
      .set('Authorization', `JWT ${accessToken}`)
      .send(comment);
    expect(createResponse.status).toBe(201);
    expect(createResponse.body.sender).toBe(comment.sender);
    expect(createResponse.body.message).toBe(comment.message);
    expect(createResponse.body.post).toBe(comment.post);
  });

  test('Test comment get', async () => {
    const getAllCommentsResponse = await request(app)
      .get('/comment/comments')
      .set('Authorization', `JWT ${accessToken}`);
    expect(getAllCommentsResponse.status).toBe(200);
    expect(getAllCommentsResponse.body.length).toBeGreaterThan(0);
  });

  test('Test update comment', async () => {
    const byPostResponse = await request(app)
      .get(`/comment/post/${comment.post}`)
      .set('Authorization', `JWT ${accessToken}`);
    expect(byPostResponse.status).toBe(200);
    expect(byPostResponse.body.length).toBeGreaterThan(0);

    const comment_id = byPostResponse.body[0]._id;
    const updatedComment = {
      id: comment_id,
      message: "Updated message"
    };

    const updateResponse = await request(app)
      .put('/comment/')
      .set('Authorization', `JWT ${accessToken}`)
      .send(updatedComment);
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.message).toBe(updatedComment.message);
  });

  test('Test delete and get by post and by id', async () => {
    const byPostResponse = await request(app)
      .get(`/comment/post/${comment.post}`)
      .set('Authorization', `JWT ${accessToken}`);
    expect(byPostResponse.status).toBe(200);
    expect(byPostResponse.body.length).toBeGreaterThan(0);

    const comment_id = byPostResponse.body[0]._id;
    const byIDResponse = await request(app)
      .get(`/comment/comments/${comment_id}`)
      .set('Authorization', `JWT ${accessToken}`);
    expect(byIDResponse.status).toBe(200);
    expect(byIDResponse.body.sender).toBe(comment.sender);

    const deleteResponse = await request(app)
      .delete(`/comment/${comment_id}`)
      .set('Authorization', `JWT ${accessToken}`);
    expect(deleteResponse.status).toBe(200);
  });
});
