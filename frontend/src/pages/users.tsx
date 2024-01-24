import { ReactElement, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useAddUserMutation,
  useDeleteUserMutation,
  useEditUserMutation,
  useGetUsersQuery,
} from "@/api/users";
import {
  Title,
  Text,
  Button,
  Card,
  List,
  ListItem,
  Dialog,
  DialogPanel,
  TextInput,
  Select,
  SelectItem,
  Bold,
} from "@tremor/react";
import AppLayout from "@/components/AppLayout";
import { useRouter } from "next/router";

const UserRole = {
  SUPERADMIN: "superadmin",
  ADMIN: "admin",
  MEMBER: "member",
} as const;

const addUserSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(1),
  role: z.enum([UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MEMBER]),
});

const editUserSchema = addUserSchema.partial();

type AddUserSchema = z.infer<typeof addUserSchema>;

type EditUserSchema = z.infer<typeof editUserSchema>;

export default function UsersPage() {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useGetUsersQuery();
  const [addUser, { isLoading: isAddingUserLoading }] = useAddUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<AddUserSchema>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      role: UserRole.MEMBER,
    },
  });

  const onSubmit = handleSubmit((data) => {
    addUser(data)
      .unwrap()
      .then(() => {
        toast.success("Successfully added user");
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
          <Title>Users</Title>
          <Text>List of users</Text>
        </div>
        <Button onClick={() => setIsOpen(true)}>Add user</Button>
      </div>

      <Card className="mt-6">
        <List>{data?.map?.((item: any) => <UserItem key={item.id} data={item} />)}</List>
      </Card>

      <Dialog open={isOpen || isAddingUserLoading} onClose={(val) => setIsOpen(val)} static={true}>
        <DialogPanel>
          <Title className="mb-3">Add user</Title>
          <form className="mt-3 space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Text>Username</Text>
              <TextInput
                type="text"
                placeholder="Username"
                {...register("username")}
                error={!!errors.username?.message}
                errorMessage={errors.username?.message?.toString()}
              />
            </div>
            <div className="space-y-2">
              <Text>Email</Text>
              <TextInput
                type="text"
                placeholder="Email"
                {...register("email")}
                error={!!errors.email?.message}
                errorMessage={errors.email?.message?.toString()}
              />
            </div>

            <div className="space-y-2">
              <Text>Role</Text>
              <Controller
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Select
                    ref={ref}
                    enableClear={false}
                    value={value}
                    onValueChange={onChange}
                    onBlur={onBlur}
                  >
                    <SelectItem value={UserRole.SUPERADMIN}>Super Admin</SelectItem>
                    <SelectItem value={UserRole.ADMIN}>Staff Admin</SelectItem>
                    <SelectItem value={UserRole.MEMBER}>Member</SelectItem>
                  </Select>
                )}
                name="role"
                control={control}
              />
            </div>

            <div className="space-y-2">
              <Text>Password</Text>
              <TextInput
                type="password"
                placeholder="Password"
                {...register("password")}
                error={!!errors.password?.message}
                errorMessage={errors.password?.message?.toString()}
              />
            </div>

            <div className="mt-5 flex items-center space-x-4">
              <Button type="submit" loading={isAddingUserLoading} disabled={isAddingUserLoading}>
                Submit
              </Button>
              <Button
                variant="light"
                color="red"
                type="button"
                loading={isAddingUserLoading}
                disabled={isAddingUserLoading}
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

const UserItem = ({ data }: { data: any }) => {
  const router = useRouter();
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDetailsOpen, setDetailsOpen] = useState(false);
  const [deleteUser, { isLoading: isDeletingUserLoading }] = useDeleteUserMutation();
  const [editUser, { isLoading: isEditingUserLoading }] = useEditUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<EditUserSchema>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      username: data.username,
      email: data.email,
      role: data.role,
    },
  });

  const handleSubmitEdit = handleSubmit((submitData) => {
    editUser({
      id: data.id,
      ...submitData,
    })
      .unwrap()
      .then(() => {
        toast.success("Successfully edited user");
        setEditOpen(false);
        reset({
          username: submitData.username || data.username,
          email: submitData.email || data.email,
          role: submitData.role || data.role,
        });
      })
      .catch((err) => {
        toast.error(err.data?.message || "Something went wrong");
      });
  });

  const handleDelete = () => {
    deleteUser(data.id)
      .unwrap()
      .then(() => {
        toast.success("Successfully deleted user");
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
            {data.username} ({data.role})
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="light"
              disabled={isEditingUserLoading || isDeletingUserLoading}
              onClick={() => setDetailsOpen(true)}
            >
              View
            </Button>
            <Button
              variant="light"
              loading={isEditingUserLoading}
              disabled={isEditingUserLoading || isDeletingUserLoading}
              onClick={() => setEditOpen(true)}
            >
              Edit
            </Button>
            <Button
              variant="light"
              color="red"
              loading={isDeletingUserLoading}
              disabled={isDeletingUserLoading || isEditingUserLoading}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </ListItem>

      <Dialog open={isEditOpen} onClose={(val) => setEditOpen(val)} static={true}>
        <DialogPanel>
          <Title className="mb-3">Edit user</Title>
          <form className="mt-3 space-y-4" onSubmit={handleSubmitEdit}>
            <div className="space-y-2">
              <Text>Username</Text>
              <TextInput
                type="text"
                placeholder="Username"
                {...register("username")}
                error={!!errors.username?.message}
                errorMessage={errors.username?.message?.toString()}
              />
            </div>
            <div className="space-y-2">
              <Text>Email</Text>
              <TextInput
                type="text"
                placeholder="Email"
                {...register("email")}
                error={!!errors.email?.message}
                errorMessage={errors.email?.message?.toString()}
              />
            </div>

            <div className="space-y-2">
              <Text>Role</Text>
              <Controller
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Select
                    ref={ref}
                    enableClear={false}
                    value={value}
                    onValueChange={onChange}
                    onBlur={onBlur}
                  >
                    <SelectItem value={UserRole.SUPERADMIN}>Super Admin</SelectItem>
                    <SelectItem value={UserRole.ADMIN}>Staff Admin</SelectItem>
                    <SelectItem value={UserRole.MEMBER}>Member</SelectItem>
                  </Select>
                )}
                name="role"
                control={control}
              />
            </div>

            <div className="space-y-2">
              <Text>Password</Text>
              <TextInput
                type="password"
                placeholder="Password"
                {...register("password")}
                error={!!errors.password?.message}
                errorMessage={errors.password?.message?.toString()}
              />
            </div>
            <div className="mt-5 flex items-center space-x-4">
              <Button type="submit" loading={isEditingUserLoading} disabled={isEditingUserLoading}>
                Submit
              </Button>
              <Button
                variant="light"
                color="red"
                type="button"
                loading={isEditingUserLoading}
                disabled={isEditingUserLoading}
                onClick={() => {
                  reset();
                  setEditOpen(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogPanel>
      </Dialog>

      <Dialog open={isDetailsOpen} onClose={(val) => setDetailsOpen(val)} static={true}>
        <DialogPanel>
          <Title className="mb-3">User</Title>
          <div className="space-y-2">
            <div className="flex flex-row items-center space-x-2">
              <Text>ID:</Text>
              <Bold>{data.id}</Bold>
            </div>
            <div className="flex flex-row items-center space-x-2">
              <Text>Username:</Text>
              <Bold>{data.username}</Bold>
            </div>
            <div className="flex flex-row items-center space-x-2">
              <Text>Email:</Text>
              <Bold>{data.email}</Bold>
            </div>
            <div className="flex flex-row items-center space-x-2">
              <Text>Role:</Text>
              <Bold>{data.role}</Bold>
            </div>
          </div>
          <div className="mt-4">
            <Button variant="light" onClick={() => setDetailsOpen(false)}>
              Close
            </Button>
          </div>
        </DialogPanel>
      </Dialog>
    </>
  );
};

UsersPage.getLayout = (page: ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};
