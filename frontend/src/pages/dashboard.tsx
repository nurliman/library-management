"use client";

import type { ReactElement } from "react";
import { Card, Title, Text } from "@tremor/react";
import AppLayout from "@/components/AppLayout";

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-7xl p-4 md:p-10">
      <Title>Dashboard</Title>
      <Text>text</Text>
      <Card className="mt-6">text</Card>
    </main>
  );
}

DashboardPage.getLayout = (page: ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};
