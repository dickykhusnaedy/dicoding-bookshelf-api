const {nanoid} = require('nanoid');
const books = require('./books');

// save data book
const addBookHandler = (request, h) => {
  // eslint-disable-next-line max-len
  const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage ? true : false;
  const insertedAt = new Date().toISOString();
  const updatedAt = new Date().toISOString();

  if (name === '' || name === null || name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      // eslint-disable-next-line max-len
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((books) => books.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// get all data book
const getBookHandler = () => ({
  status: 'success',
  data: {
    books,
  },
});

// get data book by id
const getBookByIdHandler = (request, h) => {
  const {bookId} = request.params;

  const getBook = books.findIndex((data) => data.id === bookId);
  if (getBook !== -1) {
    return {
      status: 'success',
      data: {
        book: books[getBook],
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

// edit book by id
const editBookByIdHandler = (request, h) => {
  const {bookId} = request.params;
  // eslint-disable-next-line max-len
  const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
  const updatedAt = new Date().toISOString();

  if (name === '' || name === null || name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      // eslint-disable-next-line max-len
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const getBook = books.findIndex((data) => data.id === bookId);

  if (getBook !== -1) {
    const finished = readPage === pageCount ? true : false;
    books[getBook] = {
      ...books[getBook],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// delete data book
const deleteBookByIdHandler = (request, h) => {
  const {bookId} = request.params;

  const getBook = books.findIndex((data) => data.id === bookId);
  if (getBook !== -1) {
    books.splice(getBook, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// eslint-disable-next-line max-len
module.exports = {addBookHandler, getBookHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler};
