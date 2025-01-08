import request from 'supertest';
import e, { Application } from 'express';
import app from '../src/app';
import mongoose from 'mongoose';
import exp from 'constants';

let server : any;

beforeAll(async () => {
  server = app.listen(process.env.PORT, () => {
        mongoose.connect(process.env.DATABASE_URL!)
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.error('MongoDB connection error:', err));
  });
}, 30000);

afterAll((done) => {
  mongoose.connection.close();
  server.close(() => {
    done();
  });
});

describe('Post API Tests', () => {

    const post = {
        sender: "Unittest",
        message: "This is the content of the post",
        likes: 0
    }

    test('Test post create', async () => {

        const createResponse = await request(app).post('/post').send(post);
        expect(createResponse.status).toBe(201);
        expect(createResponse.body.sender).toBe(post.sender);
        expect(createResponse.body.message).toBe(post.message);
        expect(createResponse.body.likes).toBe(post.likes);

    });

    test('Test post get', async () => {

        const getAllPostsResponse = await request(app).get('/post');
        expect(getAllPostsResponse.status).toBe(200);
        expect(getAllPostsResponse.body.length).toBeGreaterThan(0);

    });

    test('Test post get by sender, id and update', async () => {

        const bySenderResponse = await request(app).get(`/post/sender?sender=${post.sender}`);
        expect(bySenderResponse.status).toBe(200);
        expect(bySenderResponse.body.length).toBeGreaterThan(0);

        const post_id = bySenderResponse.body[0]._id;
        const updatedPost = {
            message: "Updated message",
            likes: 1
        }

        const updateResponse = await request(app).put(`/post/${post_id}`).send(updatedPost);
        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body.message).toBe(updatedPost.message);
        expect(updateResponse.body.likes).toBe(updatedPost.likes);

        const byIDResponse = await request(app).get(`/post/id/${post_id}`);
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
    }

    test('Test comment create', async () => {

        const createResponse = await request(app).post('/comment').send(comment);
        expect(createResponse.status).toBe(201);
        expect(createResponse.body.sender).toBe(comment.sender);
        expect(createResponse.body.message).toBe(comment.message);
        expect(createResponse.body.post).toBe(comment.post);

    });

    test('Test comment get', async () => {

        const getAllCommentsResponse = await request(app).get('/comment/comments');
        expect(getAllCommentsResponse.status).toBe(200);
        expect(getAllCommentsResponse.body.length).toBeGreaterThan(0);

    });

    test('Test update comment', async () => {

        const byPostResponse = await request(app).get(`/comment/post/${comment.post}`);
        console.log(byPostResponse.body);
        expect(byPostResponse.status).toBe(200);
        expect(byPostResponse.body.length).toBeGreaterThan(0);

        const comment_id = byPostResponse.body[0]._id;
        const updatedComment = {
            id: comment_id,
            message: "Updated message"
        }

        const updateResponse = await request(app).put('/comment/').send(updatedComment);
        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body.message).toBe(updatedComment.message);

    });

    test('Test delete and get by post and by id', async () => {
        const byPostResponse = await request(app).get(`/comment/post/${comment.post}`);
        console.log(byPostResponse.body);
        expect(byPostResponse.status).toBe(200);
        expect(byPostResponse.body.length).toBeGreaterThan(0);

        const comment_id = byPostResponse.body[0]._id;
        const byIDResponse = await request(app).get(`/comment/comments/${comment_id}`);
        expect(byIDResponse.status).toBe(200);
        expect(byIDResponse.body.sender).toBe(comment.sender);

        const deleteResponse = await request(app).delete(`/comment/${comment_id}`);
        expect(deleteResponse.status).toBe(200);

    });

});
