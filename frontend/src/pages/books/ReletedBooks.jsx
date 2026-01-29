import { useFetchAllBooksQuery } from "../../app/features/books/booksApi";
import BookCard from "../books/BookCard";

const RelatedBooks = ({ categoryId, currentBookId }) => {
  const { data } = useFetchAllBooksQuery({
    category: categoryId,
    limit: 20,
  });

  const books = data?.data?.filter((b) => b._id !== currentBookId) || [];

  if (!books.length) return null;

  return (
    <div className="mt-16">
      <h2 className="text-xl font-semibold mb-6">Related Books</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default RelatedBooks;
