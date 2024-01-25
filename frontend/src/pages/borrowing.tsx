import dayjs from "dayjs";
import { ReactElement, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  useGetAllBorrowedQuery,
  useBorrowBookMutation,
  useReturnBookMutation,
  useExtendBorrowingMutation,
} from "@/api/borrowed";
import { useGetAvailableBooksQuery } from "@/api/books";
import { useGetUsersQuery } from "@/api/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Title,
  Text,
  Button,
  Card,
  List,
  ListItem,
  Dialog,
  DialogPanel,
  Select,
  SelectItem,
  DatePicker,
  Bold,
  Badge,
  TextInput,
} from "@tremor/react";
import AppLayout from "@/components/AppLayout";
import { useMatchRoles } from "@/hooks/useMatchRoles";
import { UserRole } from "@/constants";

const borrowBookSchema = z.object({
  book_id: z.coerce.number().min(1),
  member_id: z.coerce.number().min(1),
  borrow_date: z.date(),
  due_date: z.date().optional(),
});

const extendBorrowingSchema = z.object({
  due_date: z.date(),
});

const returnBookSchema = z.object({
  is_lost: z.boolean().optional(),
  is_damaged: z.boolean().optional(),
  return_date: z.date().optional(),
  additional_fee: z.coerce.number().optional(),
});

type BorrowBookSchema = z.infer<typeof borrowBookSchema>;

type ExtendBorrowingSchema = z.infer<typeof extendBorrowingSchema>;

type ReturnBookSchema = z.infer<typeof returnBookSchema>;

export default function BorrowingPage() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: borrowedBooks = [] } = useGetAllBorrowedQuery();
  const { data: books = [], isLoading: isLoadingBooks } = useGetAvailableBooksQuery();
  const { data: users = [], isLoading: isLoadingUsers } = useGetUsersQuery();
  const [borrowBook, { isLoading: isBorrowingBookLoading }] = useBorrowBookMutation();
  const isRoleMatch = useMatchRoles([UserRole.ADMIN, UserRole.SUPERADMIN]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<BorrowBookSchema>({
    resolver: zodResolver(borrowBookSchema),
    defaultValues: {
      borrow_date: new Date(),
      due_date: dayjs().add(7, "day").toDate(),
    },
  });

  const onSubmit = handleSubmit(
    (data) => {
      borrowBook({
        ...data,
        borrow_date: data.borrow_date.toISOString(),
      })
        .unwrap()
        .then(() => {
          toast.success("Successfully borrowed book");
          setIsOpen(false);
          reset();
        })
        .catch((err) => {
          toast.error(err.data?.message || "Something went wrong");
        });
    },
    (errors) => {
      toast.error("Something went wrong, please check your input");
      console.log(errors);
    },
  );

  return (
    <main className="mx-auto max-w-7xl p-4 md:p-10">
      <div className="flex items-center justify-between">
        <div>
          <Title>Borrowing</Title>
          <Text>View and manage your borrowing.</Text>
        </div>
        {isRoleMatch ? <Button onClick={() => setIsOpen(true)}>Borrow</Button> : null}
      </div>

      <Card className="mt-6">
        <List>
          {borrowedBooks?.map?.((item: any) => <BorrowingItem key={item.id} data={item} />)}
        </List>
      </Card>

      <Dialog
        open={isOpen || isBorrowingBookLoading}
        onClose={(val) => setIsOpen(val)}
        static={true}
      >
        <DialogPanel>
          <Title className="mb-3">Book Borrowing</Title>
          <form
            className="relative mt-3 flex h-[450px] flex-col space-y-4 overflow-y-auto"
            onSubmit={onSubmit}
          >
            <div className="space-y-2">
              <Text>Borrower</Text>
              <Controller
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Select
                    ref={ref}
                    enableClear={false}
                    value={value as any}
                    onValueChange={onChange}
                    onBlur={onBlur}
                    disabled={isLoadingUsers}
                  >
                    {users?.map?.((item: any) => (
                      <SelectItem value={item.id}>
                        {item.username} ({item.email})
                      </SelectItem>
                    ))}
                  </Select>
                )}
                name="member_id"
                control={control}
              />
            </div>

            <div className="space-y-2">
              <Text>Book</Text>
              <Controller
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Select
                    ref={ref}
                    enableClear={false}
                    value={value as any}
                    onValueChange={onChange}
                    onBlur={onBlur}
                    disabled={isLoadingBooks}
                  >
                    {books?.map?.((item: any) => (
                      <SelectItem value={item.id}>
                        {item.title} ({item.author})
                      </SelectItem>
                    ))}
                  </Select>
                )}
                name="book_id"
                control={control}
              />
            </div>

            <div className="space-y-2">
              <Text>Borrow Date</Text>
              <Controller
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <DatePicker ref={ref} value={value} onValueChange={onChange} onBlur={onBlur} />
                )}
                name="borrow_date"
                control={control}
              />
            </div>

            <div className="space-y-2">
              <Text>Due Date</Text>
              <Controller
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <DatePicker ref={ref} value={value} onValueChange={onChange} onBlur={onBlur} />
                )}
                name="due_date"
                control={control}
              />
            </div>

            <div className="flex-1" />

            <div className="mt-5 flex items-center space-x-4">
              <Button
                type="submit"
                loading={isBorrowingBookLoading}
                disabled={isBorrowingBookLoading}
              >
                Submit
              </Button>
              <Button
                variant="light"
                color="red"
                type="button"
                disabled={isBorrowingBookLoading}
                onClick={() => {
                  reset();
                  setIsOpen(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogPanel>
      </Dialog>
    </main>
  );
}

// item
const BorrowingItem = ({ data }: { data: any }) => {
  const [isExtFormOpen, setExtFormOpen] = useState(false);
  const [isReturnOpen, setReturnOpen] = useState(false);
  const [isDetailsOpen, setDetailsOpen] = useState(false);
  const [returnBook, { isLoading: isReturningBookLoading }] = useReturnBookMutation();
  const [extendBorrowing, { isLoading: isExtendingBorrowingLoading }] =
    useExtendBorrowingMutation();
  const isRoleMatch = useMatchRoles([UserRole.ADMIN, UserRole.SUPERADMIN]);
  const isLoading = isReturningBookLoading || isExtendingBorrowingLoading;
  const isReturned = !!data?.return_date;
  const isLate = isReturned
    ? dayjs(data.return_date).isAfter(dayjs(data.due_date))
    : dayjs(data.due_date).isBefore(dayjs());

  const handleExtendBorrowing = (submitData: ExtendBorrowingSchema) => {
    extendBorrowing({
      id: data.id,
      ...submitData,
    })
      .unwrap()
      .then(() => {
        toast.success("Successfully extended borrowing");
        setExtFormOpen(false);
      })
      .catch((err) => {
        toast.error(err.data?.message || "Something went wrong");
      });
  };

  const handleReturnBook = (submitData: ReturnBookSchema) => {
    returnBook({
      id: data.id,
      ...submitData,
    })
      .unwrap()
      .then(() => {
        toast.success("Successfully returned book");
        setReturnOpen(false);
      })
      .catch((errors) => {
        toast.error(errors.data?.message || "Something went wrong");
        console.log(errors);
      });
  };

  return (
    <>
      <ListItem>
        <div className="flex w-full items-center justify-between">
          <div>
            <Bold>{data.member.username}&nbsp;</Bold>
            <span>borrowed&nbsp;</span>
            <Bold>{data.book.title}</Bold>
            {isReturned ? (
              <Badge className="ml-1" size="xs" color="green">
                Returned
              </Badge>
            ) : null}
            {isLate ? (
              <Badge className="ml-1" size="xs" color="red">
                Late
              </Badge>
            ) : null}
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="light" disabled={isLoading} onClick={() => setDetailsOpen(true)}>
              Details
            </Button>
            {isRoleMatch ? (
              <>
                <Button
                  variant="light"
                  disabled={isLoading || isReturned}
                  loading={isExtendingBorrowingLoading}
                  onClick={() => setExtFormOpen(true)}
                >
                  Extend
                </Button>
                <Button
                  variant="light"
                  disabled={isLoading || isReturned}
                  loading={isReturningBookLoading}
                  onClick={() => setReturnOpen(true)}
                >
                  Return
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </ListItem>

      {isRoleMatch ? (
        <>
          <ExtendBorrowingModal
            isLoading={isExtendingBorrowingLoading}
            isOpen={isExtFormOpen}
            onClose={(val: any) => setExtFormOpen(val)}
            onSubmit={handleExtendBorrowing}
          />

          <ReturnBookModal
            isLoading={isReturningBookLoading}
            isOpen={isReturnOpen}
            onClose={(val: any) => setReturnOpen(val)}
            onSubmit={handleReturnBook}
            dueDate={data.due_date}
          />
        </>
      ) : null}

      <Dialog open={isDetailsOpen} onClose={(val) => setDetailsOpen(val)} static={true}>
        <DialogPanel>
          <Title className="mb-3">Details</Title>

          <div className="space-y-2">
            <div className="flex flex-row items-center space-x-2">
              <Text>Status:</Text>
              <div>{isReturned ? <>Returned</> : isLate ? <>Late</> : <>Borrowed</>}</div>
            </div>

            <div className="flex flex-row items-center space-x-2">
              <Text>Book:</Text>
              <div className="truncate">
                <Bold>{data.book.title}</Bold> by {data.book.author}
              </div>
            </div>

            <div className="flex flex-row items-center space-x-2">
              <Text>Borrower:</Text>
              <div>
                <Bold>{data.member.username}</Bold> ({data.member.email})
              </div>
            </div>

            <div className="flex flex-row items-center space-x-2">
              <Text>Borrow Date:</Text>
              <div>{dayjs(data.borrow_date).format("DD MMM YYYY")}</div>
            </div>

            <div className="flex flex-row items-center space-x-2">
              <Text>Due Date:</Text>
              <div className="flex flex-row items-center">
                <div>{dayjs(data.due_date).format("DD MMM YYYY")}</div>
                {isLate ? (
                  <Badge className="ml-1" size="xs" color="red">
                    Late by {dayjs().diff(dayjs(data.due_date), "day")} days
                  </Badge>
                ) : null}
              </div>
            </div>

            <div className="flex flex-row items-center space-x-2">
              <Text>Return Date:</Text>
              <div>{data.return_date ? dayjs(data.return_date).format("DD MMM YYYY") : "-"}</div>
            </div>

            {isReturned ? (
              <>
                <div className="flex flex-row items-center space-x-2">
                  <Text>Is Lost:</Text>
                  <div>{data.is_lost ? "Yes" : "No"}</div>
                </div>

                <div className="flex flex-row items-center space-x-2">
                  <Text>Is Damaged:</Text>
                  <div>{data.is_damaged ? "Yes" : "No"}</div>
                </div>

                <div className="flex flex-row items-center space-x-2">
                  <Text>Late Fee:</Text>
                  <div>{data.late_fee ? data.late_fee : "-"}</div>
                </div>

                <div className="flex flex-row items-center space-x-2">
                  <Text>Additional Fee:</Text>
                  <div>{data.additional_fee ? data.additional_fee : "-"}</div>
                </div>

                <div className="flex flex-row items-center space-x-2">
                  <Text>Total Fee:</Text>
                  <div>{data.late_fee + data.additional_fee}</div>
                </div>
              </>
            ) : null}
          </div>

          <div className="mt-3">
            <Button variant="light" onClick={() => setDetailsOpen(false)}>
              Close
            </Button>
          </div>
        </DialogPanel>
      </Dialog>
    </>
  );
};

const ReturnBookModal = ({ isLoading, isOpen, onClose, onSubmit, dueDate = new Date() }: any) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm<ReturnBookSchema>({
    resolver: zodResolver(returnBookSchema),
    defaultValues: {
      is_lost: false,
      is_damaged: false,
      additional_fee: 0,
      return_date: new Date(),
    },
  });

  const lateFee = useMemo(() => {
    const perDayFee = 1000;
    const daysLate = dayjs(watch("return_date")).diff(dayjs(dueDate), "day");
    if (daysLate <= 0) return 0;
    return daysLate * perDayFee;
  }, [watch("return_date"), dueDate]);

  const handleReturnBook = handleSubmit(onSubmit, (errors) => {
    toast.error("Something went wrong, please check your input");
    console.log(errors);
  });

  return (
    <Dialog open={isOpen} onClose={onClose} static={true}>
      <DialogPanel>
        <Title className="mb-3">Return book</Title>
        <form
          className="relative mt-3 flex h-[385px] flex-col space-y-4 overflow-y-auto"
          onSubmit={handleReturnBook}
        >
          <label className="flex flex-row items-center space-x-2">
            <input {...register("is_lost")} type="checkbox" />
            <Text>Is Lost</Text>
          </label>
          <label className="flex flex-row items-center space-x-2">
            <input {...register("is_damaged")} type="checkbox" />
            <Text>Is Damaged</Text>
          </label>
          <div className="space-y-2">
            <Text>Returns Date</Text>
            <Controller
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <DatePicker ref={ref} value={value} onValueChange={onChange} onBlur={onBlur} />
              )}
              name="return_date"
              control={control}
            />
          </div>
          <div className="space-y-2">
            <Text>Late Fee</Text>
            <TextInput type="text" contentEditable="false" value={"" + lateFee} />
          </div>
          <div className="space-y-2">
            <Text>Addition Fee</Text>
            <TextInput
              type="text"
              placeholder="Addition Fee"
              {...register("additional_fee")}
              error={!!errors.additional_fee?.message}
              errorMessage={errors.additional_fee?.message?.toString()}
            />
          </div>
          <div className="flex-1" />
          <div className="mt-5 flex items-center space-x-4">
            <Button type="submit" loading={isLoading} disabled={isLoading}>
              Submit
            </Button>
            <Button
              variant="light"
              color="red"
              type="button"
              disabled={isLoading}
              onClick={() => {
                reset();
                onClose(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogPanel>
    </Dialog>
  );
};

const ExtendBorrowingModal = ({ isLoading, isOpen, onClose, onSubmit }: any) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<ExtendBorrowingSchema>({
    resolver: zodResolver(extendBorrowingSchema),
    defaultValues: {
      due_date: dayjs().add(7, "day").toDate(),
    },
  });

  const handleExtendBorrowing = handleSubmit(onSubmit, (errors) => {
    toast.error("Something went wrong, please check your input");
    console.log(errors);
  });

  return (
    <Dialog open={isOpen} onClose={onClose} static={true}>
      <DialogPanel>
        <Title className="mb-3">Extend borrowing</Title>
        <form
          className="relative mt-3 flex h-[200px] flex-col space-y-4 overflow-y-auto"
          onSubmit={handleExtendBorrowing}
        >
          <div className="space-y-2">
            <Text>Due Date</Text>
            <Controller
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <DatePicker ref={ref} value={value} onValueChange={onChange} onBlur={onBlur} />
              )}
              name="due_date"
              control={control}
            />
          </div>
          <div className="flex-1" />
          <div className="mt-5 flex items-center space-x-4">
            <Button type="submit" loading={isLoading} disabled={isLoading}>
              Submit
            </Button>
            <Button
              variant="light"
              color="red"
              type="button"
              disabled={isLoading}
              onClick={() => {
                reset();
                onClose(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogPanel>
    </Dialog>
  );
};

BorrowingPage.getLayout = (page: ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};
