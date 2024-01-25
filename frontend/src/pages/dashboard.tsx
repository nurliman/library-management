"use client";

import { useEffect, type ReactElement } from "react";
import {
  AreaChart,
  Card,
  Metric,
  Title,
  Text,
  TabList,
  Tab,
  TabGroup,
  TabPanels,
  TabPanel,
} from "@tremor/react";
import AppLayout from "@/components/AppLayout";
import {
  useGetBorrowedBooks24hDataQuery,
  useGetReturnedBooks24hDataQuery,
  useGetTotalBooksCountQuery,
  useGetTotalBooksDataQuery,
  useGetTotalBorrowedBooks24hCountQuery,
  useGetTotalBorrowedBooksCountQuery,
  useGetTotalBorrowedBooksDataQuery,
  useGetTotalReturnedBooks24hCountQuery,
} from "@/api/dashboard";

export default function DashboardPage() {
  const { data: totalBooksData = [] } = useGetTotalBooksDataQuery();
  const { data: totalBooksCount = 0 } = useGetTotalBooksCountQuery();
  const { data: totalBorrowedBooksData = [] } = useGetTotalBorrowedBooksDataQuery();
  const { data: totalBorrowedBooksCount = 0 } = useGetTotalBorrowedBooksCountQuery();
  const { data: borrowedBooks24hData = [] } = useGetBorrowedBooks24hDataQuery();
  const { data: borrowedBooks24hCount = 0 } = useGetTotalBorrowedBooks24hCountQuery();
  const { data: returnedBooks24hData = [] } = useGetReturnedBooks24hDataQuery();
  const { data: returnedBooks24hCount = 0 } = useGetTotalReturnedBooks24hCountQuery();

  return (
    <main className="mx-auto max-w-7xl p-4 md:p-10">
      <Title>Dashboard</Title>
      <Text>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eros diam, lobortis in maximus
        sit amet, lobortis non quam. Aenean posuere sodales nunc a sagittis. Sed ullamcorper, enim
        sed volutpat tincidunt, eros erat efficitur lectus, in imperdiet ipsum leo sed justo.
      </Text>
      <Card className="mt-6">
        <TabGroup>
          <TabList>
            <Tab className="p-4 text-left sm:p-6">
              <p className="text-sm sm:text-base">Borrowed books (24h)</p>
              <Metric className="mt-2 text-inherit">{borrowedBooks24hCount}</Metric>
            </Tab>
            <Tab className="p-4 text-left sm:p-6">
              <p className="text-sm sm:text-base">Returned books (24h)</p>
              <Metric className="mt-2 text-inherit">{returnedBooks24hCount}</Metric>
            </Tab>
            <Tab className="p-4 text-left sm:p-6">
              <p className="text-sm sm:text-base">Total books</p>
              <Metric className="mt-2 text-inherit">{totalBooksCount}</Metric>
            </Tab>
            <Tab className="p-4 text-left sm:p-6">
              <p className="text-sm sm:text-base">Total borrowed books</p>
              <Metric className="mt-2 text-inherit">{totalBorrowedBooksCount}</Metric>
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel className="p-6">
              <AreaChart
                className="mt-10 h-80"
                data={borrowedBooks24hData}
                index="date"
                categories={["total_borrowed_books"]}
                colors={["blue"]}
                showLegend={false}
                yAxisWidth={50}
              />
            </TabPanel>
            <TabPanel className="p-6">
              <AreaChart
                className="mt-10 h-80"
                data={returnedBooks24hData}
                index="date"
                categories={["total_return_books"]}
                colors={["blue"]}
                showLegend={false}
                yAxisWidth={50}
              />
            </TabPanel>
            <TabPanel className="p-6">
              <AreaChart
                className="mt-10 h-80"
                data={totalBooksData}
                index="date"
                categories={["total_books"]}
                colors={["blue"]}
                showLegend={false}
                yAxisWidth={50}
              />
            </TabPanel>
            <TabPanel className="p-6">
              <AreaChart
                className="mt-10 h-80"
                data={totalBorrowedBooksData}
                index="date"
                categories={["total_borrowed_books"]}
                colors={["blue"]}
                showLegend={false}
                yAxisWidth={50}
              />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </Card>
    </main>
  );
}

DashboardPage.getLayout = (page: ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};
