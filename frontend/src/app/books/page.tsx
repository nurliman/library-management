"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useGetBooksQuery,
  useAddBookMutation,
  useDeleteBookMutation,
  useEditBookMutation,
} from "@/api/books";
import {
  Card,
  Title,
  Text,
  List,
  ListItem,
  Dialog,
  DialogPanel,
  Button,
  TextInput,
} from "@tremor/react";

// export const dynamic = "force-dynamic";

const addBookSchema = z.object({
  author: z.string().min(1),
  title: z.string().min(1),
  image_url: z.string().url(),
});

const editBookSchema = addBookSchema.partial();

type AddBookSchema = z.infer<typeof addBookSchema>;

type EditBookSchema = z.infer<typeof editBookSchema>;

export default function BooksPage() {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useGetBooksQuery();
  const [addBook, { isLoading: isAddingBookLoading }] = useAddBookMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddBookSchema>({
    resolver: zodResolver(addBookSchema),
  });

  const onSubmit = handleSubmit((data) => {
    addBook(data)
      .unwrap()
      .then(() => {
        toast.success("Successfully added book");
        setIsOpen(false);
        reset();
      })
      .catch((err) => {
        toast.error(err.data?.message || "Something went wrong");
      });
  });

  return (
    <main className="mx-auto max-w-7xl p-4 md:p-10">
      <div className="flex items-center justify-between">
        <div>
          <Title>Books</Title>
          <Text>List of books</Text>
        </div>
        <Button onClick={() => setIsOpen(true)}>Add book</Button>
      </div>

      <Card className="mt-6">
        <List>{data?.map?.((item: any) => <BookItem key={item.id} data={item} />)}</List>
      </Card>
      <Dialog open={isOpen || isAddingBookLoading} onClose={(val) => setIsOpen(val)} static={true}>
        <DialogPanel>
          <Title className="mb-3">Add book</Title>
          <div className="mt-3 space-y-4">
            <div className="space-y-2">
              <Text>Title</Text>
              <TextInput
                type="text"
                placeholder="Title"
                {...register("title")}
                error={!!errors.title?.message}
                errorMessage={errors.title?.message?.toString()}
              />
            </div>
            <div className="space-y-2">
              <Text>Author</Text>
              <TextInput
                type="text"
                placeholder="Author"
                {...register("author")}
                error={!!errors.author?.message}
                errorMessage={errors.author?.message?.toString()}
              />
            </div>
            <div className="space-y-2">
              <Text>Cover image URL</Text>
              <TextInput
                type="text"
                placeholder="Cover image URL"
                {...register("image_url")}
                error={!!errors.image_url?.message}
                errorMessage={errors.image_url?.message?.toString()}
              />
            </div>
            <Button onClick={onSubmit} loading={isAddingBookLoading} disabled={isAddingBookLoading}>
              Submit
            </Button>
          </div>
        </DialogPanel>
      </Dialog>
    </main>
  );
}

const BookItem = ({ data }: any) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [deleteBook, { isLoading: isDeletingBookLoading }] = useDeleteBookMutation();
  const [editBook, { isLoading: isEditingBookLoading }] = useEditBookMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditBookSchema>({
    resolver: zodResolver(editBookSchema),
    defaultValues: {
      title: data.title,
      author: data.author,
      image_url: data.image_url,
    },
  });

  const handleView = () => {
    router.push(`/books/${data.id}`);
  };

  const handleSubmitEdit = handleSubmit((submitData) => {
    editBook({
      id: data.id,
      ...submitData,
    })
      .unwrap()
      .then(() => {
        toast.success("Successfully edited book");
        setIsOpen(false);
        reset({
          title: submitData.title || data.title,
          author: submitData.author || data.author,
          image_url: submitData.image_url || data.image_url,
        });
      })
      .catch((err) => {
        toast.error(err.data?.message || "Something went wrong");
      });
  });

  const handleDelete = () => {
    deleteBook(data.id)
      .unwrap()
      .then(() => {
        toast.success("Successfully deleted book");
      })
      .catch((err) => {
        toast.error(err.data?.message || "Something went wrong");
      });
  };

  return (
    <>
      <ListItem>
        <div className="flex w-full items-center justify-between">
          <div>
            {data.title} ({data.author})
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="light" onClick={handleView}>
              View
            </Button>
            <Button
              variant="light"
              loading={isEditingBookLoading}
              disabled={isEditingBookLoading || isDeletingBookLoading}
              onClick={() => setIsOpen(true)}
            >
              Edit
            </Button>
            <Button
              variant="light"
              color="red"
              loading={isDeletingBookLoading}
              disabled={isDeletingBookLoading || isEditingBookLoading}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </ListItem>
      <Dialog open={isOpen} onClose={(val) => setIsOpen(val)} static={true}>
        <DialogPanel>
          <Title className="mb-3">Add book</Title>
          <div className="mt-3 space-y-4">
            <div className="space-y-2">
              <Text>Title</Text>
              <TextInput
                type="text"
                placeholder="Title"
                {...register("title")}
                error={!!errors.title?.message}
                errorMessage={errors.title?.message?.toString()}
              />
            </div>
            <div className="space-y-2">
              <Text>Author</Text>
              <TextInput
                type="text"
                placeholder="Author"
                {...register("author")}
                error={!!errors.author?.message}
                errorMessage={errors.author?.message?.toString()}
              />
            </div>
            <div className="space-y-2">
              <Text>Cover image URL</Text>
              <TextInput
                type="text"
                placeholder="Cover image URL"
                {...register("image_url")}
                error={!!errors.image_url?.message}
                errorMessage={errors.image_url?.message?.toString()}
              />
            </div>
            <Button
              onClick={handleSubmitEdit}
              loading={isEditingBookLoading}
              disabled={isEditingBookLoading}
            >
              Submit
            </Button>
          </div>
        </DialogPanel>
      </Dialog>
    </>
  );
};
