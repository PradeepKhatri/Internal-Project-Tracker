import React from "react";
import StageChart from "../components/StageChart";
import DeadlineList from "../components/DeadlineList";
import StagesInfo from "../components/StagesInfo";
import DashboardComment from "../components/DashboardComment";

const DashboardPage = () => {
  return (
    <div
      className="bg-cover bg-top bg-fixed min-h-screen flex flex-col px-20 py-10 gap-10"
      style={{
        backgroundImage:
          "url('https://cdn.properties.emaar.com/wp-content/uploads/2023/09/MicrosoftTeams-image-70-e1694072306832.jpg')",
      }}
    >
      {/* <DashboardComment /> */}
      {/* <StageChart />   */}

      <div className="flex gap-10">
        <StagesInfo />

        <DeadlineList />
      </div>
    </div>
  );
};

export default DashboardPage;
