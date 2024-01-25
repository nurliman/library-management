import { ReactElement, useEffect } from "react";
import { useRouter } from "next/router";
import { useGetBookQuery } from "@/api/books";
import { Title, Text, Card } from "@tremor/react";
import AppLayout from "@/components/AppLayout";

export default function BookPage() {
  const router = useRouter();

  const { data: book } = useGetBookQuery(router.query.book_id);

  return (
    <main className="mx-auto max-w-7xl p-4 md:p-10">
      <Card className="mt-6 flex space-x-4">
        <div className="bg-gray-100">
          <img
            className="min-w-56 bg-cover"
            src={book?.image_url || "https://via.placeholder.com/220x280"}
            alt={book?.title || "Book"}
            loading="lazy"
          />
        </div>
        <div>
          <Title>{book?.title || "Book"}</Title>
          <Text>by {book?.author || "Author"}</Text>
          <Text className="mt-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut aliquet auctor sem, eu
            rutrum ligula maximus porttitor. Quisque at finibus orci. Aliquam sed molestie eros.
            Integer luctus nulla sed iaculis viverra. Vivamus vel tincidunt tellus. In et odio a
            tellus placerat vestibulum nec a neque. In vel convallis lorem, ac eleifend metus.
            Integer ultricies lectus non nisi imperdiet ultricies ac nec libero. Nunc est eros,
            aliquet egestas orci sit amet, rhoncus porta leo. In quis sem et mi imperdiet elementum.
            Donec blandit gravida ipsum eget sagittis. Nam pretium bibendum luctus. Ut non pharetra
            ligula. Morbi mi orci, vulputate eu sagittis euismod, malesuada non turpis. Ut finibus
            diam diam, in semper nibh lobortis vel. Mauris et sodales risus. Cras vel sollicitudin
            mi. Nulla a consectetur nulla, nec cursus erat. Mauris lacus odio, dictum quis luctus
            sit amet, tristique vel nisl. Cras dui ex, tempor eget gravida quis, mollis sed nisi.
            Fusce scelerisque sed nunc quis laoreet.
          </Text>
        </div>
      </Card>
    </main>
  );
}

BookPage.getLayout = (page: ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};
