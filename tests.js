const request = require('supertest');
const app = require('../app');
const db = require('../db');

process.env.NODE_ENV = 'test';

describe('GET /books', () => {
    test('It should respond with an array of books', async () => {
        const response = await request(app).get('/books');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('books');
        expect(Array.isArray(response.body.books)).toBe(true);
    });
});

describe('GET /books/:id', () => {
    test('It should return a single book', async () => {
        const response = await request(app).get('/books/123');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('book');
    });

    test('It should handle non-existing book', async () => {
        const response = await request(app).get('/books/nonexistent');
        expect(response.statusCode).toBe(404);
    });
});

describe('POST /books', () => {
    test('It should create a new book', async () => {
        const newBook = {
            isbn: '1234567890',
            amazon_url: 'http://example.com',
            author: 'Author',
            language: 'English',
            pages: 300,
            publisher: 'Publisher',
            title: 'New Book',
            year: 2021,
        };
        const response = await request(app).post('/books').send(newBook);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('book');
        expect(response.body.book).toMatchObject(newBook);
    });

    test('It should validate new book data', async () => {
        const newBook = {
            isbn: '1234567890',
            // missing other required fields
        };
        const response = await request(app).post('/books').send(newBook);
        expect(response.statusCode).toBe(400);
    });
});

describe('PUT /books/:isbn', () => {
    test('It should update an existing book', async () => {
        const updatedData = { title: 'Updated Title' };
        const response = await request(app).put('/books/1234567890').send(updatedData);
        expect(response.statusCode).toBe(200);
        expect(response.body.book.title).toBe('Updated Title');
    });
});

describe('DELETE /books/:isbn', () => {
    test('It should delete a book', async () => {
        const response = await request(app).delete('/books/1234567890');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ message: 'Book deleted' });
    });
});
