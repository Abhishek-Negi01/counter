import React from "react";
import { Layout } from "../components/layout/index.js";
import { CounterList } from "../components/counter/index.js";

const DashboardPage = () => {
  return (
    <Layout>
      <CounterList />
    </Layout>
  );
};

export default DashboardPage;
