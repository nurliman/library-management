"use client";

import { useState, type ReactElement } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  Title,
  Text,
  TextInput,
  List,
  ListItem,
  Button,
  Dialog,
  DialogPanel,
} from "@tremor/react";
import {
  useGetVariablesQuery,
  useAddVariableMutation,
  useDeleteVariableMutation,
  useEditVariableMutation,
} from "@/api/settings";
import AppLayout from "@/components/AppLayout";

const addVariableSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

const editVariableSchema = z.object({
  value: z.string().min(1),
});

type AddVariableSchema = z.infer<typeof addVariableSchema>;

type EditVariableSchema = z.infer<typeof editVariableSchema>;

export default function SettingsPage() {
  const [isAddOpen, setAddOpen] = useState(false);
  const { data: settings = [] } = useGetVariablesQuery();
  const [addVariable, { isLoading: isAddingVariableLoading }] = useAddVariableMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddVariableSchema>({
    resolver: zodResolver(addVariableSchema),
  });

  const onSubmit = handleSubmit((data) => {
    addVariable(data)
      .unwrap()
      .then(() => {
        toast.success("Successfully added variable");
        setAddOpen(false);
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
          <Title>Settings</Title>
          <Text>Manage variables</Text>
        </div>
        <Button onClick={() => setAddOpen(true)}>Add Variable</Button>
      </div>
      <Card className="mt-6">
        <List>
          {settings.map((setting: any) => (
            <SettingItem key={setting.name} data={setting} />
          ))}
        </List>
      </Card>

      <Dialog
        open={isAddOpen || isAddingVariableLoading}
        onClose={(val) => setAddOpen(val)}
        static={true}
      >
        <DialogPanel>
          <Title className="mb-3">Add variable</Title>
          <form className="mt-3 space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Text>Name</Text>
              <TextInput
                type="text"
                placeholder="Name"
                {...register("name")}
                error={!!errors.name?.message}
                errorMessage={errors.name?.message?.toString()}
              />
            </div>
            <div className="space-y-2">
              <Text>Value</Text>
              <TextInput
                type="text"
                placeholder="Value"
                {...register("value")}
                error={!!errors.value?.message}
                errorMessage={errors.value?.message?.toString()}
              />
            </div>
            <div className="mt-5 flex items-center space-x-4">
              <Button
                type="submit"
                loading={isAddingVariableLoading}
                disabled={isAddingVariableLoading}
              >
                Submit
              </Button>
              <Button
                variant="light"
                color="red"
                type="button"
                loading={isAddingVariableLoading}
                disabled={isAddingVariableLoading}
                onClick={() => {
                  reset();
                  setAddOpen(false);
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

const SettingItem = ({ data }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteVariable, { isLoading: isDeletingVariableLoading }] = useDeleteVariableMutation();
  const [editVariable, { isLoading: isEditingVariableLoading }] = useEditVariableMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditVariableSchema>({
    resolver: zodResolver(editVariableSchema),
    defaultValues: {
      value: data.value,
    },
  });

  const handleDelete = () => {
    deleteVariable(data.name)
      .unwrap()
      .then(() => {
        toast.success("Successfully deleted variable");
      })
      .catch((err) => {
        toast.error(err.data?.message || "Something went wrong");
      });
  };

  const handleSubmitEdit = handleSubmit((submitData) => {
    editVariable({
      name: data.name,
      ...submitData,
    })
      .unwrap()
      .then(() => {
        toast.success("Successfully edited variable");
        setIsOpen(false);
        reset({
          value: submitData.value || data.value,
        });
      })
      .catch((err) => {
        toast.error(err.data?.message || "Something went wrong");
      });
  });

  return (
    <>
      <ListItem>
        <div className="flex w-full items-center justify-between">
          <div>
            {data.name}: {data.value}
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="light"
              loading={isEditingVariableLoading}
              disabled={isEditingVariableLoading || isDeletingVariableLoading}
              onClick={() => setIsOpen(true)}
            >
              Edit
            </Button>
            <Button
              variant="light"
              color="red"
              loading={isDeletingVariableLoading}
              disabled={isDeletingVariableLoading || isEditingVariableLoading}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </ListItem>

      <Dialog open={isOpen} onClose={(val) => setIsOpen(val)} static={true}>
        <DialogPanel>
          <Title className="mb-3">Edit variable</Title>
          <form className="mt-3 space-y-4" onSubmit={handleSubmitEdit}>
            <div className="space-y-2">
              <Text>Variable</Text>
              <TextInput
                type="text"
                placeholder="Variable"
                {...register("value")}
                error={!!errors.value?.message}
                errorMessage={errors.value?.message?.toString()}
              />
            </div>
            <div className="mt-5 flex items-center space-x-4">
              <Button
                type="submit"
                loading={isEditingVariableLoading}
                disabled={isEditingVariableLoading}
              >
                Submit
              </Button>
              <Button
                variant="light"
                color="red"
                type="button"
                disabled={isEditingVariableLoading}
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
    </>
  );
};

SettingsPage.getLayout = (page: ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};
