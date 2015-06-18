import request from "koa-request"

const r = require("rethinkdbdash")()

let apiKey = "AIzaSyDpWQzU8bhKbJeWXKZYble9Rh6Se4JV0WA"

let find = function *(next) {
  let isbn = this.request.body.fields.isbn

  let opts = {
    url: `https://www.googleapis.com/books/v1/volumes?q=${isbn}&maxResults=1&key=${apiKey}`
  }

  console.log("making books api request to", opts.url)

  let response = yield request(opts)
  let data = JSON.parse(response.body).items
  let book = {}

  if (data && data.length > 0) {
    book.id = data.id
    book.uri = data.selfLink
    book.title = data.volumeInfo.title
    book.authors = data.volumeInfo.authors
    book.description = data.volumeInfo.description
    book.publishedDate = data.volumeInfo.publishedDate
    book.categories = data.volumeInfo.categories
    book.smallThumbnail = data.volumeInfo.imageLinks.smallThumbnail
    book.thumbnail = data.volumeInfo.imageLinks.thumbnail
    book.language = data.volumeInfo.language
    book.previewLink = data.volumeInfo.previewLink

    let result = yield r.db("quoth").table("books").insert(book).run()

    if (result.inserted === 1) {
      this.type = "application/json"
      this.body = JSON.stringify(book)
    } else {
      this.status = 400
    }
  } else {
    this.status = 404
  }
}

export default function (router) {
  return function *(next) {
    router.post("/books", find)

    yield next
  }
}
